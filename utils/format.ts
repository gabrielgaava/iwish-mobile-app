import i18n from "@/constants/region";

type ImageMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/jpg";

const DEFAULT_MIME: ImageMime = "image/jpeg";

export function normalizeImageUri(
  input?: string | null,
  mime: ImageMime = DEFAULT_MIME
): string {
  if (!input) return "";

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
  return "";
}

export function toPrice(value: string | number | undefined | null) {

  if(value === undefined || value === null) return "";

  const valueString = Number(value).toFixed(2);
  const money = i18n.get("money");

  return `${money} ${valueString}`;
}

export function getRelativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
}

export function limitText(text: string|undefined, size: number) {
  if(text && text.length > 0) {
    if(text.length <= size) return text;
    return text.slice(0, size-3) + "... "
  }

  return "";
}