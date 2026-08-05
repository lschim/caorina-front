export const LOGIN_LABELS = {
  title: 'Caorina',
  email: 'Email',
  password: 'Mot de passe',
  submit: 'Se connecter',
  submitting: 'Connexion...',
  invalidCredentialsError: 'Email ou mot de passe incorrect.',
  emailNotVerifiedError: 'Adresse email non vérifiée.',
  registeredBanner: (email: string) =>
    `Compte créé. Un email de vérification a été envoyé à ${email}.`,
  resendButton: "Renvoyer l'email de vérification",
  resendSending: 'Envoi en cours...',
  resendSuccess: 'Email de vérification renvoyé.',
  resendError: "Impossible de renvoyer l'email pour le moment. Réessayez plus tard.",
  registerLink: 'Créer un compte',
};
