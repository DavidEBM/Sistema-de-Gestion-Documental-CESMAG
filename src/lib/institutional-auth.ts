export function isInstitutionalGoogleAccount(
  email: string | null | undefined,
  verifiedDomain: string | null | undefined,
  institutionDomain: string | undefined,
  emailVerified: boolean | null | undefined,
): boolean {
  if (!emailVerified || !email || !verifiedDomain || !institutionDomain) return false;
  const domain = institutionDomain.toLowerCase();
  const normalizedEmail = email.toLowerCase();
  return (
    verifiedDomain.toLowerCase() === domain &&
    normalizedEmail.endsWith(`@${domain}`)
  );
}
