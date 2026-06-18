import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sendWaitlistNotification } from '../../lib/send-waitlist-notification';

export const prerender = false;

const ROLES = ['Bowler', 'Coach', 'Parent'] as const;

type WaitlistEntry = {
  name: string;
  email: string;
  role: (typeof ROLES)[number];
  createdAt: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  const kv = env.WAITLIST;
  if (!kv) {
    return Response.json({ error: 'Waitlist is temporarily unavailable.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, role } = body as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'Full name is required.' }, { status: 400 });
  }

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    return Response.json({ error: 'A valid school email is required.' }, { status: 400 });
  }

  if (typeof role !== 'string' || !ROLES.includes(role as (typeof ROLES)[number])) {
    return Response.json({ error: 'Please select a valid role.' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const key = `entry:${normalizedEmail}`;

  if (await kv.get(key)) {
    return Response.json({ error: 'This email is already on the waitlist.' }, { status: 409 });
  }

  if (!env.RESEND_API_KEY || !env.WAITLIST_NOTIFY_EMAIL) {
    console.error('Waitlist secrets are not configured on the Worker.');
    return Response.json(
      { error: 'Waitlist is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  const entry: WaitlistEntry = {
    name: name.trim(),
    email: normalizedEmail,
    role: role as (typeof ROLES)[number],
    createdAt: new Date().toISOString(),
  };

  await kv.put(key, JSON.stringify(entry));

  const notification = await sendWaitlistNotification(entry, {
    apiKey: env.RESEND_API_KEY,
    notifyEmail: env.WAITLIST_NOTIFY_EMAIL,
    fromEmail: env.WAITLIST_FROM_EMAIL,
  });

  if (!notification.sent) {
    console.error('Waitlist notification failed:', notification.error);
    return Response.json(
      {
        error:
          'Your signup was saved, but we could not send the notification email. Please try again later or contact support.',
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
};
