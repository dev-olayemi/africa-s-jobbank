import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Initialize Resend only if API key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️ RESEND_API_KEY not found. Email functionality will be disabled.');
}

// Reusable function to send any email
const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.log('📧 Email would be sent to:', to, 'Subject:', subject);
    return { success: true, data: { id: 'mock-email-id' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'JOBFOLIO Africa <onboarding@resend.dev>', // Allowed in dev
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data.id);
    return { success: true, data };
  } catch (err) {
    console.error('Send email failed:', err);
    return { success: false, error: err };
  }
};

// Send OTP Email
const sendOTP = async (email, otp, type = 'verification') => {
  const titles = {
    verification: 'Your JOBFOLIO Verification Code',
    reset: 'Reset Your JOBFOLIO Password'
  };

  const messages = {
    verification: 'Your verification code is:',
    reset: 'Your password reset code is:'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
      <h2 style="color: #0D9488; text-align: center;">JOBFOLIO Africa</h2>
      <p>Hello!</p>
      <p>${messages[type]}</p>
      <h1 style="font-size: 36px; letter-spacing: 10px; text-align: center; color: #F97316; background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </h1>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #666; text-align: center;">© 2026 JOBFOLIO Africa — Africa's JobBank</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: titles[type],
    html,
  });
};

// Send Welcome Email
const sendWelcomeEmail = async (email, fullName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
      <h2 style="color: #0D9488; text-align: center;">Welcome to JOBFOLIO Africa! 🎉</h2>
      <p>Hi ${fullName},</p>
      <p>Welcome to Africa's premier job platform and professional network!</p>
      <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0D9488;">What's Next?</h3>
        <ul>
          <li>Complete your profile to attract employers</li>
          <li>Upload your CV and showcase your skills</li>
          <li>Browse thousands of job opportunities</li>
          <li>Connect with professionals across Africa</li>
        </ul>
      </div>
      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}" 
           style="background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Get Started
        </a>
      </p>
      <hr>
      <p style="font-size: 12px; color: #666; text-align: center;">© 2026 JOBFOLIO Africa — Africa's JobBank</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to JOBFOLIO Africa! 🚀',
    html,
  });
};

// Send Job Alert Email
const sendJobAlert = async (email, fullName, jobs) => {
  const jobsHtml = jobs.map(job => `
    <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #F97316;">
      <h4 style="margin: 0 0 8px 0; color: #0D9488;">${job.title}</h4>
      <p style="margin: 0; color: #666; font-size: 14px;">${job.companyName} • ${job.location.city}, ${job.location.state}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px;">${job.description.substring(0, 100)}...</p>
    </div>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
      <h2 style="color: #0D9488; text-align: center;">New Jobs for You! 💼</h2>
      <p>Hi ${fullName},</p>
      <p>We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your profile:</p>
      ${jobsHtml}
      <p style="text-align: center; margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/jobs" 
           style="background: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View All Jobs
        </a>
      </p>
      <hr>
      <p style="font-size: 12px; color: #666; text-align: center;">© 2026 JOBFOLIO Africa — Africa's JobBank</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `${jobs.length} New Job${jobs.length > 1 ? 's' : ''} for You!`,
    html,
  });
};

export { sendEmail, sendOTP, sendWelcomeEmail, sendJobAlert };