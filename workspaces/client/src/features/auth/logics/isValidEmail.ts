export const isValidEmail = (email: unknown): boolean => {
  if (typeof email !== 'string') {
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domainPart] = parts as [string, string];
  // eslint-disable-next-line regexp/prefer-w
  if (!/^[A-Z0-9_.+-]+$/i.test(localPart)) {
    return false;
  }
  if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  if (!/^(?:[A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i.test(domainPart)) {
    return false;
  }

  return true;
};
