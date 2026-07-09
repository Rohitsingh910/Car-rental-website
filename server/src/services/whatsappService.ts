import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886'

let client: twilio.Twilio | null = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

export const sendWhatsAppNotification = async (phoneNumber: string, message: string) => {
  try {
    // Basic validation: ensure phone number has country code (e.g., +91 for India)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

    // If no credentials, log to console (Simulation Mode)
    if (!client || !TWILIO_WHATSAPP_NUMBER) {
      console.log(`--- WHATSAPP SIMULATION (Twilio) ---`);
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      console.log(`Note: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER to .env for real messages.`);
      console.log(`------------------------------------`);
      return true;
    }

    const response = await client.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`WhatsApp message sent via Twilio: ${response.sid}`);
    return true;
  } catch (error: any) {
    console.error('WhatsApp notification failed:', error.message);
    return false;
  }
};

export const sendBookingWhatsApp = async (bookingData: any) => {
  const { user, car, bookingId, totalAmount } = bookingData;
  
  // High-quality professional message
  const message = `*DesiRent Car Rental* 🚗\n\n` +
                 `Hi ${user.name},\n` +
                 `Your booking for *${car.brand} ${car.name}* is confirmed! ✅\n\n` +
                 `*Booking ID:* ${bookingId}\n` +
                 `*Total Amount:* ₹${totalAmount}\n\n` +
                 `Thank you for choosing DesiRent. Our team will contact you shortly for verification.`;

  return sendWhatsAppNotification(user.phone || '', message);
};
