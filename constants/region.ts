import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const Portugese = { 

  verify : {
    header: "Digite seu código de verificação",
    subheader: "Enviamos um código de verificação para este email:",
  },

  recovery: {
    header: "Recuperação de Senha",
    subheader: "Digite seu email para receber um código de redefinição de senha.",
  },

  //Error Messages
  TOO_SMALL: "Senha muito curta! Minimo 8 caracteres.",
  MISSING_UPPERCASE_PASSWORD: 'A senha deve conter pelo menos uma letra maiúscula.',
  MISSING_NUMBER_PASSWORD: 'A senha deve conter pelo menos um número',
  MISSING_SPECIAL_PASSWORD: 'A senha deve conter pelo menos um caractere especial.',
  EMAIL_EXISTS: "Email já cadastrado. Tentou outro ou faça login.",
  INVALID_FORMAT: "Email invalido!",
  EMAIL_NOT_VERIFIED: "Email não verificado.",
  INVALID_EMAIL_OR_PASSWORD:  "Email ou senha inválidos.",
  OTP_EXPIRED: "O código expirou. Clique para reenviar.",
  INVALID_OTP: "O código OTP inserido é inválido."
};

const English = { 

  verify : {
    header: "Enter your verification code",
    subheader: "We sent you an One Time Passcode to this email:",
  },

  recovery: {
    header: "Password Recovery",
    subheader: "Enter your email to receive a password reset code.",
  },

  //Error Messages
  TOO_SMALL: 'Password too short! Minimum 8 characters.',
  MISSING_UPPERCASE_PASSWORD: 'Password must contain at least one uppercase letter',
  MISSING_NUMBER_PASSWORD: 'Password must contain at least one number',
  MISSING_SPECIAL_PASSWORD: 'Password must contain at least one special character',
  EMAIL_EXISTS: 'User already exists. Use another email.',
  INVALID_FORMAT: 'Invalid email',
  EMAIL_NOT_VERIFIED: 'Email not verified.',
  INVALID_EMAIL_OR_PASSWORD:  'Invalid email or password.',
  OTP_EXPIRED: 'The code has expired. Click to resend.',
  INVALID_OTP: 'The OTP code entered is invalid.'
};

const i18n = new I18n({
  pt: Portugese,
  en: English,
});

// Set the locale once at the beginning of your app.
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLocale;

export default i18n;