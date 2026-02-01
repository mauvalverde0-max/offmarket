/**
 * Email service with Ethereal fallback for development
 * Supports SendGrid, Mailgun, SES via environment configuration
 */

const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

async function initEmail() {
  const isProduction = config.nodeEnv === 'production';
  
  if (isProduction && config.smtp.user && config.smtp.pass) {
    // Use configured SMTP (SendGrid, Mailgun, AWS SES, etc.)
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    console.log('Email service initialized with production SMTP');
  } else {
    // Use Ethereal for development/testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Email service initialized with Ethereal test account');
    console.log(`Ethereal credentials: ${testAccount.user} / ${testAccount.pass}`);
  }
}

async function sendEmail(to, subject, html) {
  if (!transporter) {
    await initEmail();
  }
  
  try {
    const info = await transporter.sendMail({
      from: config.emailFrom,
      to,
      subject,
      html,
    });
    
    if (config.nodeEnv !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`Email preview: ${previewUrl}`);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendPriceAlertEmail(to, product, targetPrice, currentPrice, store) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Price Alert Triggered!</h2>
      <p>Good news! A product on your watchlist has dropped to your target price.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${product}</h3>
        <p><strong>Target Price:</strong> $${targetPrice}</p>
        <p><strong>Current Price:</strong> $${currentPrice}</p>
        <p><strong>Store:</strong> ${store}</p>
      </div>
      
      <p><a href="${config.frontendUrl}/alerts" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View Alert</a></p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message from Offmarket. Visit your alerts to manage notifications.</p>
    </div>
  `;
  
  return sendEmail(to, `Price Alert: ${product}`, html);
}

module.exports = {
  initEmail,
  sendEmail,
  sendPriceAlertEmail,
};
