const STUDENT_EMAIL_PATTERN = /^(\d{10})@g\.siit\.tu\.ac\.th$/i;
const STAFF_EMAIL_SUFFIX = '@siit.tu.ac.th';

export function isAllowedSiitEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const normalized = email.trim().toLowerCase();

  if (STUDENT_EMAIL_PATTERN.test(normalized)) {
    return true;
  }

  if (normalized.endsWith(STAFF_EMAIL_SUFFIX) && !normalized.endsWith('@g.siit.tu.ac.th')) {
    return true;
  }

  return false;
}

export function parseStudentEmail(email) {
  if (!email) {
    return null;
  }

  const match = email.trim().toLowerCase().match(STUDENT_EMAIL_PATTERN);
  if (!match) {
    return null;
  }

  return {
    studentId: match[1],
    email: match[0],
  };
}

export function isStudentEmail(email) {
  return Boolean(parseStudentEmail(email));
}

export function isStaffEmail(email) {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(STAFF_EMAIL_SUFFIX) && !normalized.endsWith('@g.siit.tu.ac.th');
}
