import "server-only";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Transactional email abstraction. Configure EMAIL_API_KEY (Resend) in
 * production. Without it, emails are logged to the server console so local
 * development and this sandbox can exercise the full auth flow (copy the
 * printed link) without a real provider — this is a dev fallback, not a
 * fake "success" response to a configured provider.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM || "The Light Music Institute <hello@tlmi.example>";

  if (!apiKey) {
    console.log(
      `\n[email:dev-fallback] EMAIL_API_KEY not set — printing instead of sending.\nTo: ${to}\nSubject: ${subject}\n${stripHtml(html)}\n`
    );
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    throw new Error(`Failed to send email via Resend: ${error.message}`);
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function verificationEmailTemplate(verifyUrl: string, firstName: string) {
  return {
    subject: "Verify your email — The Light Music Institute",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#17130f">Welcome to TLMI, ${firstName} 🎵</h2>
        <p>Confirm your email to activate your account and start your first course.</p>
        <p><a href="${verifyUrl}" style="background:#d4901f;color:#17130f;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Verify email</a></p>
        <p style="color:#6f5f45;font-size:13px">This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
      </div>`,
  };
}

export function passwordResetEmailTemplate(resetUrl: string) {
  return {
    subject: "Reset your password — The Light Music Institute",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#17130f">Reset your password</h2>
        <p>Click below to choose a new password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}" style="background:#d4901f;color:#17130f;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Reset password</a></p>
        <p style="color:#6f5f45;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  };
}
