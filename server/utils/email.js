const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to Linux Community Hub!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Linux Community Hub, ${data.name}!</h1>
        <p>Thank you for joining our community of Linux enthusiasts.</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${data.verificationUrl}</p>
        <p>Happy coding!</p>
        <p>The Linux Community Hub Team</p>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${data.name},</p>
        <p>You requested a password reset for your Linux Community Hub account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${data.resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${data.resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <p>The Linux Community Hub Team</p>
      </div>
    `
  }),

  contributionReceived: (data) => ({
    subject: 'Thank you for your contribution application!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank you for your interest!</h1>
        <p>Hi ${data.name},</p>
        <p>We received your application to contribute as a <strong>${data.role}</strong>.</p>
        <p>Our team will review your application and get back to you within 3-5 business days.</p>
        <p>Thank you for wanting to be part of our community!</p>
        <p>The Linux Community Hub Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (options.template && templates[options.template]) {
      emailContent = templates[options.template](options.data);
    } else {
      emailContent = {
        subject: options.subject,
        html: options.html || options.message
      };
    }

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };