export function getErrorMessage(error) {
  if (!error) {
    return 'Unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error.message === 'string' && error.message.length > 0) {
    const parts = [error.message];

    if (error.code) {
      parts.push(`(${error.code})`);
    }

    if (error.details) {
      parts.push(error.details);
    }

    if (error.hint) {
      parts.push(error.hint);
    }

    return parts.join(' ');
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'An unexpected error occurred';
  }
}

export function toError(error, fallback = 'An unexpected error occurred') {
  if (error instanceof Error) {
    return error;
  }

  return new Error(getErrorMessage(error) || fallback);
}
