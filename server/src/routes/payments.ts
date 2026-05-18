import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret'
});

// 1. Create Order
router.post('/create-order', async (req: any, res) => {
  try {
    const { amount, currency = 'INR', receipt, bookingId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert amount to paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB
    await prisma.payment.create({
      data: {
        razorpayOrderId: order.id,
        amount,
        currency,
        bookingId,
        status: 'PENDING'
      }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
});

// 2. Verify Signature
router.post('/verify-signature', async (req: any, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      bookingId 
    } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // 1. Update Payment Record
      await prisma.payment.update({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: 'SUCCESS'
        }
      });

      // 2. Update Booking Status
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'SUCCESS',
          paymentId: razorpayPaymentId
        },
        include: { car: true }
      });

      // 3. Notify User
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title: 'Payment Successful',
          message: `Booking for ${booking.car.name} (DR-${booking.bookingId}) is confirmed!`,
          type: 'payment'
        }
      });

      res.json({ message: 'Payment verified successfully', booking });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// 3. Webhook for Refund / Late Updates
router.post('/webhook', async (req: any, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === signature) {
      const event = req.body.event;
      const payload = req.body.payload;

      if (event === 'order.paid') {
        const orderId = payload.order.entity.id;
        const paymentId = payload.payment.entity.id;

        // Find the payment record
        const payment = await prisma.payment.findUnique({
          where: { razorpayOrderId: orderId }
        });

        if (payment && payment.bookingId) {
          // Update Payment status
          await prisma.payment.update({
            where: { razorpayOrderId: orderId },
            data: { status: 'SUCCESS', razorpayPaymentId: paymentId }
          });

          // Update Booking status
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { 
              status: 'CONFIRMED', 
              paymentStatus: 'SUCCESS', 
              paymentId: paymentId 
            }
          });

          console.log(`Webhook: Booking ${payment.bookingId} confirmed via order.paid`);
        }
      }
      
      res.json({ status: 'ok' });
    } else {
      console.error('Webhook: Invalid signature');
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Error in webhook');
  }
});

export default router;
