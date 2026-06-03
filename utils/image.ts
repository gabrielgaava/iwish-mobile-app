import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

/**
 * Compressao/redimensionamento de imagens antes do upload.
 *
 * Antes as imagens iam em Base64 no JSON (varios parses + payload grande).
 * Agora processamos com expo-image-manipulator (WEBP) e enviamos o arquivo
 * direto em multipart/form-data.
 */

export type ImagePreset = "avatar" | "cover" | "wish" | "feedback";

type PresetConfig = {
  /** Largura maxima. So redimensiona quando a origem e maior (evita upscale). */
  width: number;
  /** Qualidade de compressao (0..1). */
  compress: number;
};

const PRESETS: Record<ImagePreset, PresetConfig> = {
  avatar: { width: 512, compress: 0.8 },
  cover: { width: 1200, compress: 0.85 },
  wish: { width: 1600, compress: 0.85 },
  // Prints de celular (retrato) - Full HD: lado maior ~1920, largura ~1080.
  feedback: { width: 1080, compress: 0.8 },
};

const OUTPUT_FORMAT = SaveFormat.WEBP;
const OUTPUT_MIME = "image/webp";
const OUTPUT_EXTENSION = "webp";

export type ProcessedImage = {
  uri: string;
  width: number;
  height: number;
};

/**
 * Reconhece URLs remotas (http/https) - ja hospedadas (ex: R2),
 * que NAO devem ser reenviadas no upload.
 */
export function isRemoteUri(uri: string): boolean {
  return /^https?:\/\//i.test(uri);
}

/**
 * Redimensiona (se necessario) e recomprime a imagem para WEBP.
 * Passe `sourceWidth` (ex: asset.width) para evitar upscale de imagens menores.
 */
export async function processImage(
  source: { uri: string; width?: number },
  preset: ImagePreset
): Promise<ProcessedImage> {
  const { width, compress } = PRESETS[preset];

  const context = ImageManipulator.manipulate(source.uri);

  if (!source.width || source.width > width) {
    context.resize({ width });
  }

  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({ compress, format: OUTPUT_FORMAT });

  return { uri: result.uri, width: result.width, height: result.height };
}

/**
 * Anexa um arquivo de imagem local em um FormData no formato esperado
 * pelo fetch/axios do React Native.
 */
export function appendImageFile(
  form: FormData,
  field: string,
  uri: string,
  filename?: string
): void {
  const name = filename ?? `${field}-${Date.now()}.${OUTPUT_EXTENSION}`;

  // O React Native aceita este shape para upload de arquivos.
  form.append(field, {
    uri,
    name,
    type: OUTPUT_MIME,
  } as unknown as Blob);
}

/**
 * Processa e anexa uma imagem local de uma vez.
 */
export async function appendProcessedImage(
  form: FormData,
  field: string,
  source: { uri: string; width?: number },
  preset: ImagePreset,
  filename?: string
): Promise<void> {
  const processed = await processImage(source, preset);
  appendImageFile(form, field, processed.uri, filename);
}

/**
 * Anexa imagens de wish a um FormData separando:
 *  - URLs remotas (ja hospedadas, ex: R2) -> enviadas como JSON em `keepImages`
 *    para o backend preservar sem reupload;
 *  - arquivos locais do dispositivo -> comprimidos e enviados como `images` (File).
 */
export async function appendWishImages(
  form: FormData,
  images: string[],
  field = "images",
  keepField = "keepImages"
): Promise<void> {
  const remote = images.filter(isRemoteUri);
  const local = images.filter((uri) => !isRemoteUri(uri));

  form.append(keepField, JSON.stringify(remote));

  for (let i = 0; i < local.length; i++) {
    await appendProcessedImage(
      form,
      field,
      { uri: local[i] },
      "wish",
      `wish-${Date.now()}-${i}.${OUTPUT_EXTENSION}`
    );
  }
}
