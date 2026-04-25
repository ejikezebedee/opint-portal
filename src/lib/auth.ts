import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.PORTAL_ADMIN_PASSWORD;
const SESSION_COOKIE = "opint_portal_session";

if (!ADMIN_PASSWORD) {
  throw new Error("PORTAL_ADMIN_PASSWORD must be set in production");
}

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
  return password === ADMIN_PASSWORD;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
