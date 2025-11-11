export const APP_LOGO = '/logo.svg';
export const APP_TITLE = 'ApexDeliver';

export const getLoginUrl = () => {
  return import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in';
};
