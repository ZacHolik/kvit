import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type AdminClient = ReturnType<typeof createServiceRoleClient>;

export async function findUserByEmail(
  admin: AdminClient,
  email: string,
): Promise<{ id: string; last_sign_in_at: string | null } | null> {
  if (!admin) return null;
  const normalized = email.toLowerCase().trim();
  let page = 1;
  const perPage = 200;
  for (let i = 0; i < 10; i++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) break;
    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) {
      return {
        id: match.id,
        last_sign_in_at: match.last_sign_in_at ?? null,
      };
    }
    if (data.users.length < perPage) break;
    page++;
  }
  return null;
}

export async function sendPasswordSetupEmail(
  admin: AdminClient,
  email: string,
  userId: string,
  isExistingUser: boolean,
): Promise<void> {
  if (!admin) return;

  if (isExistingUser) {
    const { data: userData, error: userError } =
      await admin.auth.admin.getUserById(userId);
    if (!userError && userData?.user?.last_sign_in_at) {
      console.log('User already has password, skipping setup email');
      return;
    }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'https://kvik.online';
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${appUrl}/auth/callback?next=/nova-lozinke`,
    },
  });
  if (error || !data?.properties?.action_link) return;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'Kvik <noreply@kvik.online>',
      to: [email],
      subject: 'Dobrodošao u Kvik — postavi lozinku',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <h2 style="color:#0d9488">Plaćanje uspješno!</h2>
          <p>Tvoj Kvik account je spreman. Postavi lozinku da pristupiš aplikaciji:</p>
          <p style="margin:24px 0">
            <a href="${data.properties.action_link}"
              style="display:inline-block;background:#0d9488;color:#fff;
              padding:12px 24px;border-radius:8px;text-decoration:none;
              font-weight:600">
              Postavi lozinku →
            </a>
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error('Welcome email error:', err));
}
