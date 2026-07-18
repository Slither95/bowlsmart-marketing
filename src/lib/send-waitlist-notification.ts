type WaitlistEntry = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type NotificationResult =
  | { sent: true; id: string }
  | { sent: false; error: string };

export async function sendWaitlistNotification(
  entry: WaitlistEntry,
  config: {
    apiKey?: string;
    notifyEmail?: string;
    fromEmail?: string;
  },
): Promise<NotificationResult> {
  const { apiKey, notifyEmail, fromEmail = 'BowlSmart <onboarding@resend.dev>' } = config;

  if (!apiKey || !notifyEmail) {
    return {
      sent: false,
      error: 'RESEND_API_KEY or WAITLIST_NOTIFY_EMAIL is not configured on the Worker.',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      reply_to: entry.email,
      subject: `New waitlist signup: ${entry.name}`,
      text: [
        'New BowlSmart waitlist signup',
        '',
        `Name: ${entry.name}`,
        `Email: ${entry.email}`,
        `Role: ${entry.role}`,
        `Submitted: ${entry.createdAt}`,
      ].join('\n'),
    }),
  });

  const raw = await response.text();
  let payload: { id?: string; message?: string } | null = null;

  try {
    payload = JSON.parse(raw);
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = payload?.message ?? raw;
    console.error('Failed to send waitlist notification:', error);
    return { sent: false, error };
  }

  if (!payload?.id) {
    return { sent: false, error: 'Resend accepted the request but did not return an email id.' };
  }

  return { sent: true, id: payload.id };
}
