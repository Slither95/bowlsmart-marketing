type WaitlistEntry = {
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export async function sendWaitlistNotification(
  entry: WaitlistEntry,
  config: {
    apiKey?: string;
    notifyEmail?: string;
    fromEmail?: string;
  },
): Promise<void> {
  const { apiKey, notifyEmail, fromEmail = 'BowlSmart <onboarding@resend.dev>' } = config;

  if (!apiKey || !notifyEmail) {
    console.warn('Waitlist email skipped: RESEND_API_KEY or WAITLIST_NOTIFY_EMAIL not configured');
    return;
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
  }
}
