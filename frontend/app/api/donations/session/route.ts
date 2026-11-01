import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey.includes('placeholder') || !stripeSecretKey.startsWith('sk_')) {
    return NextResponse.json({
      isConfigured: false,
      message: 'Stripe keys not configured in .env.local',
    });
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      isConfigured: true,
      sessionId: session.id,
      amountTotal: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency?.toUpperCase() || 'GBP',
      customerEmail: session.customer_details?.email || session.customer_email,
      customerName: session.customer_details?.name || session.metadata?.giftAidDonor,
      metadata: session.metadata,
      paymentStatus: session.payment_status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error retrieving Stripe session:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
}
