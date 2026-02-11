const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

// Get credentials from Firebase Config or Environment Variables
const EMAIL_USER = process.env.EMAIL_USER || functions.config().email?.user;
const EMAIL_PASS = process.env.EMAIL_PASS || functions.config().email?.pass;

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

/**
 * Sends a notification email to the user.
 * @param {string} userEmail - User's email address
 * @param {string} title - Notification Title
 * @param {string} message - Notification Message
 */
async function sendNotificationEmail(userEmail, title, message) {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('❌ Email credentials missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
        return;
    }

    const mailOptions = {
        from: `"CareerGrowth Team" <${EMAIL_USER}>`,
        to: userEmail,
        subject: `CareerGrowth Notification: ${title}`,
        text: `Hello,

You have a new update in CareerGrowth.

Title: ${title}
Message: ${message}

Visit Dashboard:
https://career-growth-five.vercel.app/dashboard

Regards,
CareerGrowth Team
`,
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Hello,</h2>
      <p>You have a new update in <strong>CareerGrowth</strong>.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2563eb;">${title}</h3>
        <p style="margin-bottom: 0;">${message}</p>
      </div>

      <a href="https://career-growth-five.vercel.app/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Visit Dashboard
      </a>

      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        Regards,<br>
        CareerGrowth Team
      </p>
    </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${userEmail}: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        // Do not throw error so function doesn't crash
    }
}

module.exports = { sendNotificationEmail };
