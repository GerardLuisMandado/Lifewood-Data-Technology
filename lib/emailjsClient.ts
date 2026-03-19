type EmailJsSendParams = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  templateParams: Record<string, unknown>;
};

export const EMAILJS_DEFAULT_SERVICE_ID = 'service_d7glscr';

export const sendEmailJs = async ({ serviceId, templateId, publicKey, templateParams }: EmailJsSendParams) => {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`EmailJS send failed (${res.status}): ${text || res.statusText}`);
  }
};

