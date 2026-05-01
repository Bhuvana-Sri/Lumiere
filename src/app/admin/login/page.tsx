import { redirect } from 'next/navigation';
import { setAdminCookie, checkPassword, isAuthed } from '@/lib/admin-auth';

export const metadata = { title: 'Admin — Lumière' };

async function login(formData: FormData) {
  'use server';
  const password = String(formData.get('password') ?? '');
  if (!checkPassword(password)) {
    redirect('/admin/login?error=1');
  }
  await setAdminCookie();
  redirect('/admin');
}

export default async function AdminLogin({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect('/admin');
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[360px]">
        <div className="font-serif text-[18px] tracking-editorial text-center mb-12">
          LUMIÈRE
        </div>
        <h1 className="serif-h text-[28px] mb-8 text-center">Admin sign in.</h1>
        <form action={login} className="space-y-6">
          <label className="block">
            <span className="smalcap mb-1 inline-block">Password</span>
            <input
              type="password"
              name="password"
              className="input"
              autoFocus
              required
            />
          </label>
          {error && (
            <p className="text-[12px] text-red-700">
              Incorrect password. Try again.
            </p>
          )}
          <button type="submit" className="pill-btn w-full text-center">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
