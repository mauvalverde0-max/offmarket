const nodemailer = require('nodemailer');

async function createTransporter() {
  if (!process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, '');
}

function renderAlertTemplate({ productName, price, storeName }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>Precio en baja</h2>
      <p><strong>${productName}</strong> ahora está a <strong>$${price}</strong> en ${storeName}.</p>
      <p>Entrá a Offmarket para comparar y comprar.</p>
    </div>`;
}

async function sendAlertEmail(to, subject, data) {
  const transporter = await createTransporter();
  const html = typeof data === 'string' ? data : renderAlertTemplate(data);
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || '"Offmarket" <no-reply@offmarket.local>',
    to,
    subject,
    html,
    text: stripHtml(html)
  });
  console.log('Email sent', { to, preview: nodemailer.getTestMessageUrl(info) });
  return info;
}

module.exports = { sendAlertEmail };
