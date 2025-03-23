export const isValidPassword = (password: unknown): boolean => {
  if (typeof password !== 'string') {
    return false;
  }

  // eslint-disable-next-line regexp/prefer-w
  return /^[A-Z0-9_+-]{3,}$/i.test(password);
};
