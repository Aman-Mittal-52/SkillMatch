// src/utils/email.js
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email with Resend
 * @param {Object} p  { to, subject, html?, text? }
 */
exports.sendMail = async (p) => {
  const { to, subject, html, text } = p;

  const { data, error } = await resend.emails.send({
    from: 'Acme <joddekho@gmail.com>',   // change after you verify a domain
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error('Resend error →', error);
    throw error;
  }
  console.log('Resend data →', data);
  return data;
};