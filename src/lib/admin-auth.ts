import { cookies } from 'next/headers';

const COOKIE_NAME = 'lumiere_admin';
const ONE_DAY_S = 60 * 60 * 24;

// Simple admin auth: a single shared password env var, signed cookie.
// Suitable for a single-surgeon clinic. For multi-user, swap in NextAuth or Supabase Auth.

function getSecret() {
  const s = process.env.ADMIN_AUTH_SECRET;
  if (!s) throw new Error('ADMIN_AUTH_SECRET is not set');
  return s;
}

async function sign(value: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return Buffer.from(sig).toString('hex');
}

export async function setAdminCookie() {
  const value = `${Date.now()}`;
  const sig = await sign(value);
  const c = await cookies();
  c.set(COOKIE_NAME, `${value}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_DAY_S * 7,
    path: '/'
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  try {
    const c = await cookies();
    const raw = c.get(COOKIE_NAME)?.value;
    if (!raw) return false;
    const [value, sig] = raw.split('.');
    if (!value || !sig) return false;
    const expected = await sign(value);
    if (sig !== expected) return false;
    // Optional: check age
    const age = Date.now() - Number(value);
    return age < ONE_DAY_S * 7 * 1000;
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Constant-time-ish comparison
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
