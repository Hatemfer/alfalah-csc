import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateFeeBreakdown } from '@/utils/stripeFee';

// Map causes to donor-facing descriptions
const CAUSE_NAMES: Record<string, { title: string; subtitle: string }> = {
  purchase: {
    title: 'Mosque Purchase Appeal',
    subtitle: 'Sadaqah Jariyah for 89 Tindal Street building purchase',
  },
  zakat: {
    title: 'Zakat al-Mal (100% Policy)',
    subtitle: 'Strictly distributed directly to eligible needy recipients',
  },
  sadaqah: {
    title: 'General Sadaqah & Welfare',
    subtitle: 'Mosque running costs, heating, utilities & community welfare',
  },
  academy: {
    title: 'Youth & Madrasah Education',
    subtitle: 'Children classes, Quran tajweed & Youth STEM electronics lab',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      frequency = 'oneoff',
      fundId = 'purchase',
      coverFee = true,
      giftAid = false,
      donorName = '',
      donorEmail = '',
      donorAddress = '',
      donorPostcode = '',
    } = body;

    // 1. Validation
    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json(
        { error: 'Minimum donation amount is £1.00.' },
        { status: 400 }
      );
    }
    if (parsedAmount > 100000) {
      return NextResponse.json(
        { error: 'For donations above £100,000, please contact our Board of Trustees directly.' },
        { status: 400 }
      );
    }

    if (giftAid && (!donorName || !donorPostcode)) {
      return NextResponse.json(
        { error: 'HMRC requires full name and UK postcode for Gift Aid declaration.' },
        { status: 400 }
      );
    }

    // 2. Compute Fee Coverage
    const feeData = calculateFeeBreakdown(parsedAmount);
    const feeToCharge = coverFee ? feeData.feeAmount : 0;
    const causeInfo = CAUSE_NAMES[fundId] || CAUSE_NAMES.purchase;

    // Determine Base URL for callbacks
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 3. Check Stripe Secret Key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeConfigured =
      Boolean(stripeSecretKey) &&
      !stripeSecretKey?.includes('placeholder') &&
      stripeSecretKey?.startsWith('sk_');

    // If Stripe is not yet configured, provide a realistic simulated flow with instructions
    if (!isStripeConfigured) {
      const simulatedUrl = `${origin}/donate/success?simulated=true&amount=${parsedAmount}&coverFee=${coverFee}&fee=${feeToCharge}&fund=${encodeURIComponent(fundId)}&giftAid=${giftAid}&donorName=${encodeURIComponent(donorName)}&frequency=${frequency}&email=${encodeURIComponent(donorEmail)}`;
      
      return NextResponse.json({
        success: true,
        url: simulatedUrl,
        isSimulated: true,
        message: 'Stripe secret key not configured in .env.local. Running in demonstration preview mode.',
      });
    }

    // 4. Initialize Stripe
    const stripe = new Stripe(stripeSecretKey as string, {
      apiVersion: '2024-06-20' as any,
    });

    const isMonthly = frequency === 'monthly';

    // 5. Build Line Items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Main Donation Line Item
    lineItems.push({
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(parsedAmount * 100),
        product_data: {
          name: `Donation: ${causeInfo.title}`,
          description: `${causeInfo.subtitle} • Alfalah Community Support Centre (Charity #1150221)`,
        },
        ...(isMonthly ? { recurring: { interval: 'month' } } : {}),
      },
      quantity: 1,
    });

    // Optional Fee Recovery Line Item
    if (coverFee && feeToCharge > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(feeToCharge * 100),
          product_data: {
            name: 'Card Processing Fee Contribution',
            description: `Donor contribution covering transaction fees so 100% of £${parsedAmount.toFixed(2)} reaches Masjid Al Falah`,
          },
          ...(isMonthly ? { recurring: { interval: 'month' } } : {}),
        },
        quantity: 1,
      });
    }

    // 6. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: isMonthly ? 'subscription' : 'payment',
      customer_email: donorEmail || undefined,
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?cancelled=true`,
      billing_address_collection: giftAid ? 'required' : 'auto',
      submit_type: isMonthly ? undefined : 'donate',
      metadata: {
        charityName: 'Alfalah Community Support Centre',
        charityNumber: '1150221',
        fundId,
        causeTitle: causeInfo.title,
        baseAmount: parsedAmount.toString(),
        coverFee: coverFee ? 'true' : 'false',
        feeAmount: feeToCharge.toString(),
        totalCharged: (parsedAmount + feeToCharge).toFixed(2),
        giftAid: giftAid ? 'true' : 'false',
        giftAidDonor: donorName,
        giftAidPostcode: donorPostcode,
        giftAidAddress: donorAddress,
        frequency,
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize secure checkout session.' },
      { status: 500 }
    );
  }
}
