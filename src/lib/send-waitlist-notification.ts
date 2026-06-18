type WaitlistEntry = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type NotificationResult =
  | { sent: true }
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

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send waitlist notification:', error);
    return { sent: false, error };
  }

  return { sent: true };
}
