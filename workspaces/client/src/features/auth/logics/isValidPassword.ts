export const isValidPassword = (password: string): boolean => {
  // eslint-disable-next-line regexp/prefer-w
  return /^[A-Z0-9_+-]{3,}$/i.test(password);
};
