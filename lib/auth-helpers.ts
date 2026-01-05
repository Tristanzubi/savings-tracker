import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Get the current authenticated user from Better Auth session
 * @returns The authenticated user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Require authentication and return the user or throw an error
 * @throws Error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
