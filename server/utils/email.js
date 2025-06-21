const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Linux Community Hub!',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining the Linux Community Hub. We're excited to have you as part of our community.</p>
      <p>Get started by:</p>
      <ul>
        <li>Completing your profile</li>
        <li>Joining discussions in the forum</li>
        <li>Sharing resources with the community</li>
        <li>Attending upcoming events</li>
      </ul>
      <p>Happy coding!</p>
    `
  }),

  emailVerification: (name, verificationUrl) => ({
    subject: 'Verify Your Email Address',
    html: `
      <h1>Email Verification</h1>
      <p>Hi ${name},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you didn't create an account, please ignore this email.</p>
    `
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Hi ${name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};