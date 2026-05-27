import i18n from "./region";

export const passwordRules: Record<string, (v: string) => boolean | string> = {
  hasLowercase: (v) => /[a-z]/.test(v) || i18n.t("MISSING_LOWERCASE_PASSWORD"),
  hasUppercase: (v) => /[A-Z]/.test(v) || i18n.t("MISSING_UPPERCASE_PASSWORD"),
  hasNumber:    (v) => /[0-9]/.test(v) || i18n.t("MISSING_NUMBER_PASSWORD"),
  hasSpecial:   (v) => /[^a-zA-Z0-9]/.test(v) || i18n.t("MISSING_SPECIAL_PASSWORD"),
};

export const usernameRules: Record<string, (v: string) => boolean | string> = {
  isValidUsername: (v) => /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9.]+$/.test(v) || i18n.t("INVALID_USERNAME"),
}

export const nameRules: Record<string, (v: string) => boolean | string> = {
  minLength: (v) => v.trim().length >= 2 || i18n.t("NAME_TOO_SHORT"),
  isValidName: (v) => /^[A-Za-zÀ-ÿ' -]+$/.test(v) || i18n.t("INVALID_NAME"),
}

export const urlRules: Record<string, (v: string) => boolean | string> = {
  isValidUrl: (v) => {
    try {
      const url = new URL(v);

      return (
        ["http:", "https:"].includes(url.protocol) ||
        i18n.t("INVALID_URL")
      );
    } catch {
      return i18n.t("INVALID_URL");
    }
  },
};