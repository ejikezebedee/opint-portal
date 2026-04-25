import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "opint_portal_session";

export async function isAuthenticated() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "authenticated";
}

export async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/login");
  }
}

export function verifyPassword(password: string) {
  const correctPassword = process.env.PORTAL_ADMIN_PASSWORD || "BossOnly123!";
  return password === correctPassword;
}