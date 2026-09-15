import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "EXPONTANEA SV <onboarding@resend.dev>";
const contactToEmail =
  process.env.CONTACT_TO_EMAIL ?? process.env.RESEND_FROM_EMAIL;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Recupera tu contraseña - EXPONTANEA SV",
    html: `
      <h2>Recupera tu contraseña</h2>

      <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>

      <p>
        Haz clic en el siguiente enlace para establecer una nueva contraseña:
      </p>

      <p>
        <a href="${resetLink}">
          Cambiar mi contraseña
        </a>
      </p>

      <p>Este enlace será válido por un tiempo limitado.</p>

      <p>
        Si no solicitaste este cambio, puedes ignorar este correo.
      </p>

      <p>EXPONTANEA SV</p>
    `,
  });
};

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  if (!contactToEmail) {
    throw new Error("No se configuró el correo de contacto");
  }

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\n/g, "<br />");

  await resend.emails.send({
    from: fromEmail,
    to: contactToEmail,
    replyTo: data.email,
    subject: `Nuevo mensaje de contacto: ${data.subject}`,
    html: `
      <h2>Nuevo mensaje desde EXPONTANEA SV</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  });
};
