export const GITHUB_USERNAME = "NicolMunoz012";
/** Cuentas de GitHub de Nicol: sus repos cuentan como propios, no como colaboración. */
export const GITHUB_OWN_ACCOUNTS = [GITHUB_USERNAME, "Nicki0m"];

export function isOwnGithubAccount(login: string) {
  return GITHUB_OWN_ACCOUNTS.some((account) => account.toLowerCase() === login.toLowerCase());
}
export const EMAIL = "nicolmunoz004@gmail.com";

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: "https://www.linkedin.com/in/nicol-mu%C3%B1oz-7b4b14307/",
  email: `mailto:${EMAIL}`,
} as const;

export const CV_LINKS = {
  es: {
    preview: "https://drive.google.com/file/d/1di72M4u4w54WpQVbkvN1NZcRhhGOG-As/view",
    download: "https://drive.google.com/uc?export=download&id=1di72M4u4w54WpQVbkvN1NZcRhhGOG-As",
  },
  en: {
    preview: "https://drive.google.com/file/d/1Ni-VZyIy31vNN8g1cyWQUcxNHCQT1cXp/view",
    download: "https://drive.google.com/uc?export=download&id=1Ni-VZyIy31vNN8g1cyWQUcxNHCQT1cXp",
  },
} as const;
