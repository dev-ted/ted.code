export function parseAllowedEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getEmailFromClaims(
  claims: Record<string, unknown> | null | undefined
): string | undefined {
  if (typeof claims?.email === "string") {
    return claims.email;
  }

  if (typeof claims?.primary_email_address === "string") {
    return claims.primary_email_address;
  }

  return undefined;
}
