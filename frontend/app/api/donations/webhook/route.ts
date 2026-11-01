import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !stripeSecretKey.startsWith('sk_')) {
    return NextResponse.json(
      { message: 'Stripe keys not configured. Webhook running in mock mode.' },
      { status: 200 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20' as any,
  });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (webhookSecret && !webhookSecret.includes('placeholder')) {
      event = stripe.webhooks.constructEvent(body, signature || '', webhookSecret);
    } else {
      // If webhook secret not configured yet, parse event body directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Stripe Webhook Signature Verification Failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful donation events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const donationDetails = {
      sessionId: session.id,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || 'GBP',
      donorEmail: session.customer_details?.email || session.customer_email,
      donorName: session.customer_details?.name || session.metadata?.giftAidDonor,
      fundId: session.metadata?.fundId || 'purchase',
      giftAid: session.metadata?.giftAid === 'true',
      giftAidPostcode: session.metadata?.giftAidPostcode,
      frequency: session.metadata?.frequency || 'oneoff',
      timestamp: new Date().toISOString(),
    };

    console.log('[Donation Received - Stripe Webhook]:', donationDetails);

    // TODO: In production with database, insert donation record into PostgreSQL:
    // await db.donations.create({ data: donationDetails });
    // And send automated receipt email via Resend / SendGrid / SMTP
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
