import { NextRequest, NextResponse } from 'next/server';

interface DonationPayload {
  amount: number;
  frequency: 'oneoff' | 'monthly';
  fundId: string;
  donorName: string;
  donorEmail: string;
  donorAddress?: string;
  donorPostcode?: string;
  giftAid: boolean;
  paymentMethod: 'card' | 'bank';
  cardLast4?: string;
}

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

// Helper to sanitize text and prevent HTML/script injection
function sanitizeString(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-client';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (rateData) {
      if (now > rateData.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Too many donation requests from your connection. Please wait a moment and try again.' },
          {
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-Content-Type-Options': 'nosniff',
              'X-Frame-Options': 'DENY',
            },
          }
        );
      } else {
        rateData.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // 2. Parse and Validate Payload
    const body: DonationPayload = await req.json();

    // Validate Amount
    if (!body.amount || typeof body.amount !== 'number' || body.amount < 1 || !isFinite(body.amount)) {
      return NextResponse.json(
        { error: 'Invalid donation amount. Minimum donation is £1.00.' },
        { status: 400 }
      );
    }
    if (body.amount > 500000) {
      return NextResponse.json(
        { error: 'For donations above £500,000, please contact our Board of Trustees directly.' },
        { status: 400 }
      );
    }

    // Sanitize and Validate Donor Name
    const sanitizedName = sanitizeString(body.donorName).slice(0, 100);
    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid donor name (at least 2 characters).' },
        { status: 400 }
      );
    }

    // Sanitize and Validate Email
    const sanitizedEmail = sanitizeString(body.donorEmail).toLowerCase().slice(0, 100);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address for your official tax receipt.' },
        { status: 400 }
      );
    }

    // Sanitize Address & Postcode
    const sanitizedAddress = sanitizeString(body.donorAddress).slice(0, 200);
    const sanitizedPostcode = sanitizeString(body.donorPostcode).toUpperCase().slice(0, 12);

    // Validate Gift Aid requirements (if selected)
    if (body.giftAid) {
      if (!sanitizedPostcode || sanitizedPostcode.length < 3) {
        return NextResponse.json(
          { error: 'A valid UK Postcode is required for HMRC Gift Aid declarations.' },
          { status: 400 }
        );
      }
    }

    // Validate card last 4 digits (if paymentMethod is card)
    let cardLast4Sanitized: string | undefined = undefined;
    if (body.paymentMethod === 'card' && body.cardLast4) {
      const cleaned = body.cardLast4.replace(/\D/g, '').slice(-4);
      if (cleaned.length === 4) {
        cardLast4Sanitized = cleaned;
      }
    }

    // 3. Generate Official UK Registered Charity Reference & Timestamp
    const currentYear = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const receiptNumber = `ALF-${currentYear}-${randomSeq}`;
    const timestamp = new Date().toISOString();

    const giftAidAmount = body.giftAid ? Number((body.amount * 0.25).toFixed(2)) : 0;
    const totalBenefit = Number((body.amount + giftAidAmount).toFixed(2));

    // Response contains sanitized, verified receipt record with security headers
    return NextResponse.json(
      {
        success: true,
        receiptNumber,
        timestamp,
        charityNumber: '1150221',
        charityName: 'Alfalah Community Support Centre',
        charityAddress: '89 Tindal Street, Balsall Heath, Birmingham, B12 9QU',
        donation: {
          amount: Number(body.amount.toFixed(2)),
          currency: 'GBP',
          frequency: body.frequency === 'monthly' ? 'monthly' : 'oneoff',
          fundId: sanitizeString(body.fundId).slice(0, 50) || 'purchase',
          giftAid: Boolean(body.giftAid),
          giftAidAmount,
          totalBenefit,
          paymentMethod: body.paymentMethod === 'bank' ? 'bank' : 'card',
          cardMasked: cardLast4Sanitized ? `•••• •••• •••• ${cardLast4Sanitized}` : undefined,
          donorName: sanitizedName,
          donorEmail: sanitizedEmail,
          donorAddress: sanitizedAddress,
          donorPostcode: sanitizedPostcode,
        },
      },
      {
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      }
    );
  } catch (error) {
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your donation. Please try again.' },
      { status: 500 }
    );
  }
}
