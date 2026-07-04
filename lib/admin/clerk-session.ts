import { clerkClient } from "@clerk/nextjs/server";
import {
  getEmailFromClaims,
  parseAllowedEmails,
} from "@/lib/admin/auth";

export function getAllowedAdminEmails(): string[] {
  return parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
}

export async function getSessionEmail(
  userId: string,
  claims: Record<string, unknown> | null | undefined
): Promise<string | undefined> {
  const fromClaims = getEmailFromClaims(claims);
  if (fromClaims) {
    return fromClaims;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const primary = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId
  );

  return primary?.emailAddress;
}
