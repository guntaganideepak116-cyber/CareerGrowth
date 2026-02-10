import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends a notification email to the user.
 * @param to recipient email
 * @param title notification title
 * @param message notification message
 * @returns boolean indicating success
 */
export async function sendNotificationEmail(to: string, title: string, message: string): Promise<boolean> {
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:5173/dashboard';

    const mailOptions = {
        from: `"CareerGrowth Team" <${process.env.EMAIL_USER}>`,
        to,
        subject: `CareerGrowth Notification: ${title}`,
        text: `Hello,

You have a new update in CareerGrowth.

Title: ${title}
Message: ${message}

Visit Dashboard:
${dashboardUrl}

Regards,
CareerGrowth Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        return false;
    }
}
