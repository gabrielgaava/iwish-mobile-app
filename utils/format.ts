type ImageMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/jpg";

const DEFAULT_MIME: ImageMime = "image/jpeg";

export function normalizeImageUri(
  input?: string | null,
  mime: ImageMime = DEFAULT_MIME
): string | undefined {
  if (!input) return undefined;

  const value = input.trim();

  // 1️⃣ Já é URL remota
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // 2️⃣ Arquivo local (Android / iOS)
  if (value.startsWith("file://")) {
    return value;
  }

  // 3️⃣ Base64 com prefixo
  if (value.startsWith("data:image")) {
    return value;
  }

  // 4️⃣ Base64 cru → adiciona prefixo
  const isBase64 =
    /^[A-Za-z0-9+/=]+$/.test(value) && value.length > 50;

  if (isBase64) {
    return `data:${mime};base64,${value}`;
  }

  // 5️⃣ Não reconhecido
  return undefined;
}
