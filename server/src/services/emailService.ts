import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingEmail = async (bookingData: any) => {
  const { user, car, bookingId, totalAmount, pickupDate, returnDate } = bookingData;

  const mailOptions = {
    from: `"DesiRent Notifications" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Booking Confirmed: ${bookingId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #f97316; text-align: center;">Booking Confirmation</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for choosing <strong>DesiRent</strong>! Your booking for <strong>${car.name}</strong> has been successfully initiated.</p>
        
        <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #ea580c;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Car:</strong> ${car.brand} ${car.name}</p>
          <p><strong>Pickup Date:</strong> ${new Date(pickupDate).toLocaleDateString()}</p>
          <p><strong>Return Date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        </div>

        <p>Our team will contact you shortly for verification and payment completion.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">
          Need help? Contact us at support@desirent.com or reply to this email.
        </p>
      </div>
    `,
  };

  try {
    // If no credentials, just log it (prevent crashing in dev)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('--- MOCK EMAIL SENT ---');
      console.log('To:', user.email);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.html);
      console.log('-----------------------');
      return true;
    }

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendAdminAlert = async (bookingData: any) => {
    const { user, car, bookingId, totalAmount } = bookingData;
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
        from: `"DesiRent System" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `🚨 NEW BOOKING ALERT: ${bookingId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 10px;">
            <h2 style="color: #ef4444;">New Booking Received!</h2>
            <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
            <p><strong>Car:</strong> ${car.name}</p>
            <p><strong>Amount:</strong> ₹${totalAmount}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <a href="${process.env.FRONTEND_URL}/admin" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View in Admin Dashboard</a>
          </div>
        `,
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('--- MOCK ADMIN ALERT SENT ---');
            return true;
        }
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Admin alert failed:', error);
        return false;
    }
};
