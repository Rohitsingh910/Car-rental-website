import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Meta WhatsApp Cloud API Service (Industry Standard & Free Tier)
 * 
 * To use this in production:
 * 1. Go to https://developers.facebook.com/
 * 2. Create a "Business" app and add the "WhatsApp" product.
 * 3. Get your 'Permanent Access Token' and 'Phone Number ID'.
 * 4. Add them to your .env file.
 */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v21.0';

export const sendWhatsAppNotification = async (phoneNumber: string, message: string) => {
  try {
    // Basic validation: ensure phone number has country code (e.g., 91 for India)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : `91${phoneNumber}`;

    // If no credentials, log to console (Simulation Mode)
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.log(`--- WHATSAPP SIMULATION (Meta API) ---`);
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      console.log(`Note: Add WHATSAPP_TOKEN to .env for real messages.`);
      console.log(`---------------------------------------`);
      return true;
    }

    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

    // Note: To send messages outside the 24h window, Meta requires "Templates".
    // For this demonstration, we use a basic text message.
    const response = await axios.post(url, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`WhatsApp message sent via Meta API:`, response.data);
    return true;
  } catch (error: any) {
    console.error('WhatsApp notification failed:', error.response?.data || error.message);
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
