import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const Portugese = { 

  invalidEmail: "E-mail inválido",
  required: "Campo obrigatório",
  min: "Mínimo",
  max: "Máximo",
  characters: "caracteres",
  money: "R$",
  or: "Ou",

  auth: {
    email: "E-mail",
    password: "Senha",

    login: {
      title: "Entrar",
      subTitle: "Bem-vindo de volta! Acesse sua conta para continuar.",
      noAccount: "Não tem uma conta? Criar agora",
      forgotPassword: "Esqueci minha senha",
      enter: "Entrar",
      goWithGoogle: "Continuar com Google",
      goWithApple: "Continuar com Apple",
    },

    register: {
      title: "Criar Conta",
      subTitle: "Comece a realizar seus desejos.",
      fullName: "Nome Completo",
      username: "Username",
      createAccount: "Criar Conta",
      alreadyHaveAccount: "Já tem uma conta?",
      login: "Login",
      orContinueWith: "ou continue com",
      termsPrefix: "Ao criar uma conta, você concorda com nossos",
      termsLink: "Termos de Uso",
      termsMiddle: "e",
      privacyLink: "Política de Privacidade",
    },
  },

  welcome: {
    tagline: "Sua rede social de desejos.",
    subtitle: "Crie listas, compartilhe sonhos e descubra o presente perfeito para quem você ama.",
    features: {
      lists: {
        title: "Crie Listas",
        description: "Organize tudo o que você deseja em um só lugar.",
      },
      socialize: {
        title: "Socialize",
        description: "Acompanhe os desejos de amigos e familiares.",
      },
    },
    createAccount: "Criar Conta",
    login: "Login",
  },

  verify : {
    title: "Verificação",
    subTitle: "Insira o código de 6 dígitos enviado para o seu e-mail.",
    header: "Digite seu código de verificação",
    subheader: "Enviamos um código de verificação para este e-mail:",
    resendIn: "Reenviar código em",
    notReceived: "Não recebeu o código?",
    resend: "Reenviar",
    verifyCode: "Verificar Código",
  },

  recovery: {
    header: "Recuperação de Senha",
    subTitle: "Insira seu e-mail para receber um código de recuperação.",
    send: "Enviar codigo",
    doLogin: 'Lemboru a senha?',
    doLoginBold: 'Fazer login',
    updatePassword: 'Atulizar senha',
  },

  home: {
    feed: {
      goToWish: "Ver detalhes",
    }
  },

  wish: {
    reserved: "Comprado",
    youReserved: "Você Comprou",
    actions: {
      markAsPurchased: "Marcar como comprado",
      markAsUnpurchased: "Desmarcar como comprado",
      visit: "Ver no site",
    },
    edit: {
      title: "Editar Desejo",
      subtitle: "Atualize os detalhes do seu desejo.",
      saveButton: "Salvar alterações",
      error: "Erro ao atualizar desejo. Tente novamente.",
    },
    create: {
      linkTitle: "Adicionar Novo Desejo",
      linkSubtitle: "Cole o link do produto que você deseja ganhar e nós buscaremos as informações para você.",
      manual: "Adicionar manualmente",
      detailsTitle: "Detalhes do Item",
      detailsSubtitle: "Personalize seu desejo para que todos saibam exatamente o que você quer.",
      titleLabel: "Título",
      priceLabel: "Preço",
      notesLabel: "Notas",
      priority: "Alta Prioridade?",
      pics: "Fotos do Item (Até 3)",
      imagesOf: "IMAGENS",
      addImage: "ADD",
      save: "Salvar Item",
      selectListTitle: "Em qual lista o desejo será adicionado?",
      selectListSubtitle: "Selecione uma de suas coleções ou crie uma nova.",
      searchPlaceholder: "Buscar listas...",
      createNewList: "Criar Nova Lista",
      createNewListSub: "Comece uma nova coleção",
      confirmSelection: "Confirmar Seleção",
      itemCount: "%{count} itens",
      itemCountSingle: "%{count} item",
    }
  },

  profile: {
    followers: "Seguidores",
    following: "Seguindo",
    wishlists: "Wishlists",
    myWishlists: "Minhas Listas",
    userWishlists: "Listas de %{name}",
    seeAll: "Ver Todos",
    follow: "Seguir",
    unfollow: "Seguindo",
    private: "Privado",
    public: "Público",
    editProfile: "Editar Perfil",
    edit: {
      title: "Editar Perfil",
      subtitle: "Atualize suas informações.",
      nameLabel: "Nome Completo",
      usernameLabel: "Username",
      emailLabel: "E-mail",
      emailHint: "O e-mail não pode ser alterado.",
      saveButton: "Salvar alterações",
      error: "Erro ao atualizar perfil. Tente novamente.",
    },
  },

  wishlist: {
    coverPhoto: "Adicionar Foto de Capa",
    tapToSelect: "Clique para selecionar uma imagem",

    options: {
      label: "Gerenciar Lista",
      title: "O que gostaria de fazer?",
      share: "Compartilhar",
      editDetails: "Editar detalhes",
      addItems: "Adicionar novos itens",
      deleteList: "Excluir permanentemente",
      deleteConfirm: {
        title: "Excluir lista?",
        message: "Todos os itens desta lista serão excluídos permanentemente. Pessoas que marcaram itens como comprados também serão notificadas. Essa ação não pode ser desfeita.",
        confirm: "Excluir",
        cancel: "Cancelar",
      },
    },

    create: {
      permissionTitle: "Permissão necessária",
      permissionMessage: "Permissão para acessar a galeria é necessária.",
      title: "Nova Wishlist",
      subTitle: "Comece a planejar seus desejos e compartilhe com as pessoas que você ama.",
      nameLabel: "Nome da lista",
      descriptionLabel: "Descreve sua lista: Casamento, aniversario ...",
      error: "Erro ao criar a wishlist. Tente novamente mais tarde",
      buttonText: "Salvar alterações",
    },
    edit: {
      title: "Editar Wishlist",
      subTitle: "Atualize as informações da sua lista.",
      error: "Erro ao atualizar a wishlist. Tente novamente mais tarde.",
      buttonText: "Salvar alterações",
    }
  },

  feedback: {
    title: "Feedback & Bugs",
    subtitle: "Sua opinião nos ajuda a melhorar. Descreva o que aconteceu ou deixe sua sugestão.",
    descriptionPlaceholder: "Descrição",
    imagesLabel: "Imagens (opcional)",
    imagesLimit: "até 3",
    infoMessage: "Seu reporte técnico inclui automaticamente informações básicas do seu dispositivo para nos ajudar a identificar erros com precisão.",
    submitButton: "Enviar Reporte",
    successTitle: "Reporte enviado!",
    successMessage: "Obrigado pelo seu feedback. Nossa equipe irá analisar em breve.",
    errorMessage: "Erro ao enviar o reporte. Tente novamente.",
    descriptionRequired: "Por favor, descreva o problema ou sugestão.",
  },

  createPage: {
    title: "O que vamos criar hoje?",
    subtitle: "Transforme seus desejos em realidade ou organize suas coleções.",
    wish: {
      title: "Adicionar desejo",
      description: "Adicionar um novo item individual",
    },
    wishlist: {
      title: "Criar uma Wishlist",
      description: "Organizar desejos em coleções",
    },
    event: {
      title: "Criar um evento",
      description: "Defina a data e as regras das listas",
    },
    soonBadge: "Em breve",
  },

  tabs: {
    home: "Início",
    search: "Buscar",
    create: "Criar",
    profile: "Perfil",
    settings: "Config.",
  },

  shareIntent: {
    loading: "Buscando produto...",
  },

  emptyState: {
    wish: {
      title: "Esta lista está vazia",
      description: "Parece que não há nenhum item aqui. Que tal adicionar um novo desejo para começar a preencher esta lista?",
    },
    users: {
      title: "Nenhum usuário encontrado",
      description: "Digite um nome ou e-mail para encontrar pessoas que você conhece e se conectar com elas.",
    },
    wishlist: {
      title: "Nenhuma lista criada",
      description: "Crie sua primeira lista e comece a adicionar tudo aquilo que você deseja.",
    },
    publicWishlist: {
      title: "Toda lista começa vazia...",
      description: "Parece que esta wishlist ainda está esperando o primeiro desejo ✨",
    },
    notifications: {
      title: "Nenhuma notificação por aqui",
      description: "Você está em dia! Volte mais tarde para ver suas novidades.",
    },
    feed: {
      title: "Seu feed está esperando por novidades ✨",
      description: "Siga amigos para acompanhar suas wishlists e atividades. As novidades aparecerão aqui.",
    },
    addButton: "Adicionar / Criar",
  },

  actions: {
    edit: "Editar",
    delete: "Deletar",
  },

  //Error Messages
  TOO_SMALL: "Senha muito curta! Mínimo 8 caracteres.",
  MISSING_UPPERCASE_PASSWORD: 'A senha deve conter pelo menos uma letra maiúscula.',
  MISSING_LOWERCASE_PASSWORD: 'A senha deve conter pelo menos uma letra minúscula.',
  MISSING_NUMBER_PASSWORD: 'A senha deve conter pelo menos um número.',
  MISSING_SPECIAL_PASSWORD: 'A senha deve conter pelo menos um caractere especial.',
  EMAIL_EXISTS: "E-mail já cadastrado. Tente outro ou faça login.",
  INVALID_FORMAT: "E-mail inválido!",
  INVALID_USERNAME: 'Permitido apenas letras, números e ponto',
  EMAIL_NOT_VERIFIED: "E-mail não verificado.",
  INVALID_NAME: 'Nome invalido',
  NAME_TOO_SHORT: 'Nome muito curto',
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
  INVALID_URL: "Este link é inválido.",
  OTP_EXPIRED: "O código expirou. Clique para reenviar.",
  INVALID_OTP: "O código OTP inserido é inválido.",
  USER_NOT_FOUND: 'Não encontramos esta conta',
  SERVER_ERROR: 'Algo deu errado. Tente novamente mais tarde.',
};

const English = { 

  invalidEmail: "Invalid e-mail",
  required: "Required field",
  min: "Minimum ",
  max: "Maximum ",
  characters: "characters",
  or: "Or",
  money: "$",

  auth: {
    email: "E-mail",
    password: "Password",

    login: {
      title: "Sign in",
      subTitle: "Welcome back! Access your account to continue.",
      noAccount: "Don't have an account? Create now",
      forgotPassword: "Forgot my password",
      enter: "Sign In",
      goWithGoogle: "Sign in with Google",
      goWithApple: "Sign in with Apple",
    },

    register: {
      title: "Create Account",
      subTitle: "Start making your wishes come true.",
      fullName: "Full Name",
      username: "Username",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      login: "Login",
      orContinueWith: "or continue with",
      termsPrefix: "By creating an account, you agree to our",
      termsLink: "Terms of Use",
      termsMiddle: "and",
      privacyLink: "Privacy Policy",
    },
  },

  welcome: {
    tagline: "Your social network of wishes.",
    subtitle: "Create lists, share dreams and discover the perfect gift for those you love.",
    features: {
      lists: {
        title: "Create Lists",
        description: "Organize everything you want in one place.",
      },
      socialize: {
        title: "Socialize",
        description: "Follow the wishes of friends and family.",
      },
    },
    createAccount: "Create Account",
    login: "Login",
  },

  verify : {
    title: "Verification",
    subTitle: "Enter the 6-digit code sent to your e-mail.",
    header: "Enter your verification code",
    subheader: "We sent a One Time Passcode to this email:",
    resendIn: "Resend code in",
    notReceived: "Didn't receive the code?",
    resend: "Resend",
    verifyCode: "Verify Code",
  },

  recovery: {
    header: "Password Recovery",
    subTitle: "Enter your email to receive a recovery code.",
    send: "Send recovery code",
    doLogin: 'Remembered your password ?',
    doLoginBold: 'Sign-in',
    updatePassword: 'Update password',
  },

  home: {
    feed: {
      goToWish: "Go to wish",
    }
  },

  wish: {
    reserved: "Reserved",
    youReserved: "You Reserved",
    actions: {
      markAsPurchased: "Mark as purchased",
      markAsUnpurchased: "Unmark as purchased",
      visit: "View on site",
    },
    edit: {
      title: "Edit Wish",
      subtitle: "Update the details of your wish.",
      saveButton: "Save changes",
      error: "Error updating wish. Please try again.",
    },
    create: {
      linkTitle: "Add New Wish",
      linkSubtitle: "Paste the link of the product you want to win and we will find the information for you.",
      manual: "Add manually",
      detailsTitle: "Wish Details",
      detailsSubtitle: "Personalize your wish so that everyone knows exactly what you want.",
      titleLabel: "Title",
      priceLabel: "Price",
      notesLabel: "Notes",
      priority: "High Priority?",
      pics: "Photos of the Item (Up to 3)",
      imagesOf: "IMAGES",
      addImage: "ADD",
      save: "Save Item",
      selectListTitle: "Which list should the wish be added to?",
      selectListSubtitle: "Select one of your collections or create a new one.",
      searchPlaceholder: "Search lists...",
      createNewList: "Create New List",
      createNewListSub: "Start a new collection",
      confirmSelection: "Confirm Selection",
      itemCount: "%{count} items",
      itemCountSingle: "%{count} item",
    }
  },

  profile: {
    followers: "Followers",
    following: "Following",
    wishlists: "Wishlists",
    myWishlists: "My Wishlists",
    userWishlists: "%{name}'s Wishlists",
    seeAll: "See All",
    follow: "Follow",
    unfollow: "Following",
    private: "Private",
    public: "Public",
    editProfile: "Edit Profile",
    edit: {
      title: "Edit Profile",
      subtitle: "Update your information.",
      nameLabel: "Full Name",
      usernameLabel: "Username",
      emailLabel: "E-mail",
      emailHint: "Email cannot be changed.",
      saveButton: "Save changes",
      error: "Error updating profile. Please try again.",
    },
  },

  wishlist: {
    coverPhoto: "Add Cover Photo",
    tapToSelect: "Tap to select an image",

    options: {
      label: "Manage List",
      title: "What would you like to do?",
      share: "Share",
      editDetails: "Edit details",
      addItems: "Add new items",
      deleteList: "Delete permanently",
      deleteConfirm: {
        title: "Delete list?",
        message: "All items in this list will be permanently deleted. People who marked items as purchased will also be notified. This action cannot be undone.",
        confirm: "Delete",
        cancel: "Cancel",
      },
    },

    create: {
      permissionTitle: "Permission required",
      permissionMessage: "Permission to access the media library is required.",
      title: "Nova Wishlist",
      subTitle: "Start planning your wishes and share them with your friends.",
      nameLabel: "Wishlist name",
      descriptionLabel: "Describe your list: Wedding, anniversary...",
      error: "Error creating wishlist. Please try again later.",
      buttonText: "Criar lista",
    },
    edit: {
      title: "Edit Wishlist",
      subTitle: "Update your wishlist details.",
      error: "Error updating wishlist. Please try again later.",
      buttonText: "Save changes",
    }
  },

  feedback: {
    title: "Feedback & Bugs",
    subtitle: "Your opinion helps us improve. Describe what happened or leave your suggestion.",
    descriptionPlaceholder: "Description",
    imagesLabel: "Images (optional)",
    imagesLimit: "up to 3",
    infoMessage: "Your technical report automatically includes basic device information to help us identify errors accurately.",
    submitButton: "Send Report",
    successTitle: "Report sent!",
    successMessage: "Thank you for your feedback. Our team will review it shortly.",
    errorMessage: "Error sending the report. Please try again.",
    descriptionRequired: "Please describe the issue or suggestion.",
  },

  createPage: {
    title: "What are we creating today?",
    subtitle: "Turn your wishes into reality or organize your collections.",
    wish: {
      title: "Add a wish",
      description: "Add a new individual item",
    },
    wishlist: {
      title: "Create a Wishlist",
      description: "Organize wishes into collections",
    },
    event: {
      title: "Create an event",
      description: "Set the date and rules for the lists",
    },
    soonBadge: "Coming soon",
  },

  tabs: {
    home: "Home",
    search: "Search",
    create: "Create",
    profile: "Profile",
    settings: "Settings",
  },

  shareIntent: {
    loading: "Fetching product...",
  },

  emptyState: {
    wish: {
      title: "This list is empty",
      description: "Looks like there's nothing here yet. How about adding a new wish to start filling this list?",
    },
    users: {
      title: "No users found",
      description: "Enter a name or email to find people you know and connect with them. Sharing wishlists is more fun with friends!",
    },
    wishlist: {
      title: "No lists created",
      description: "Create your first list and start adding everything you wish for.",
    },
    publicWishlist: {
      title: "Every list starts empty...",
      description: "Looks like this wishlist is still waiting for its first wish ✨",
    },
    notifications: {
      title: "No notifications here",
      description: "You're all caught up! Check back later for updates.",
    },
    feed: {
      title: "Your feed is waiting for new updates ✨",
      description: "Follow friends to keep up with their wishlists and activities. New updates will appear here.",
    },
    addButton: "Add / Create",
  },

  actions: {
    edit: "Edit",
    delete: "Delete"
  },

  //Error Messages
  TOO_SMALL: 'Password too short! Minimum 8 characters.',
  MISSING_UPPERCASE_PASSWORD: 'Password must contain at least one uppercase letter.',
  MISSING_LOWERCASE_PASSWORD: 'Password must contain at least one lowercase letter.',
  MISSING_NUMBER_PASSWORD: 'Password must contain at least one number.',
  MISSING_SPECIAL_PASSWORD: 'Password must contain at least one special character.',
  EMAIL_EXISTS: 'User already exists. Use another email.',
  INVALID_FORMAT: 'Invalid email',
  INVALID_USERNAME: 'Only letters, numbers and dot',
  INVALID_NAME: 'Invalid username',
  NAME_TOO_SHORT: 'Name is too short',
  EMAIL_NOT_VERIFIED: 'Email not verified.',
  INVALID_EMAIL_OR_PASSWORD:  'Invalid email or password.',
  INVALID_URL: "Invalid link.",
  OTP_EXPIRED: 'The code has expired. Click to resend.',
  INVALID_OTP: 'The OTP code entered is invalid.',
  USER_NOT_FOUND: 'We did not found this account.',
  SERVER_ERROR: 'Something went wrong. Try again later.',
};

const i18n = new I18n({
  pt: Portugese,
  en: English,
});

// Set the locale once at the beginning of your app.
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLocale;

export default i18n;
