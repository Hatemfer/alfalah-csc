/**
 * Utility functions for Stripe card processing fee calculation and fee recovery.
 * 
 * Standard UK Card Processing Rate:
 * - UK Standard Stripe: 1.5% + £0.20
 * - UK Registered Charity Discount Rate: 1.2% + £0.20 (Charity #1150221)
 * 
 * Fee Recovery Formula:
 * To ensure the charity receives 100% of the intended donation (D) net of fees:
 * Total to Charge (T) = (D + fixedFee) / (1 - rate)
 * Fee to Cover = T - D
 */

export interface FeeBreakdown {
  baseAmount: number;
  feeAmount: number;
  totalAmount: number;
  giftAidAmount: number;
  totalWithGiftAid: number;
  effectiveRatePercent: number;
}

export const STRIPE_RATES = {
  // Standard UK domestic cards
  standard: {
    percent: 0.015, // 1.5%
    fixed: 0.2, // 20p
  },
  // Discounted UK registered charity rate
  charity: {
    percent: 0.012, // 1.2%
    fixed: 0.2, // 20p
  },
};

/**
 * Calculates the exact processing fee contribution needed so that
 * the charity receives 100% of the base donation after Stripe deductions.
 *
 * @param baseAmount - The donor's intended donation amount in GBP (£)
 * @param useCharityRate - Whether to use the discounted charity rate (1.2%) or standard rate (1.5%)
 */
export function calculateFeeBreakdown(
  baseAmount: number,
  useCharityRate: boolean = false
): FeeBreakdown {
  if (!baseAmount || baseAmount <= 0 || !isFinite(baseAmount)) {
    return {
      baseAmount: 0,
      feeAmount: 0,
      totalAmount: 0,
      giftAidAmount: 0,
      totalWithGiftAid: 0,
      effectiveRatePercent: 0,
    };
  }

  const rateConfig = useCharityRate ? STRIPE_RATES.charity : STRIPE_RATES.standard;
  const { percent, fixed } = rateConfig;

  // Exact gross charge required so net = baseAmount
  const gross = (baseAmount + fixed) / (1 - percent);
  const fee = gross - baseAmount;

  // Round to 2 decimal places
  const roundedFee = Math.round(fee * 100) / 100;
  const roundedTotal = Math.round((baseAmount + roundedFee) * 100) / 100;

  // UK Gift Aid is 25% of the base donation from eligible UK taxpayers
  const roundedGiftAid = Math.round(baseAmount * 0.25 * 100) / 100;
  const roundedTotalWithGiftAid = Math.round((baseAmount + roundedGiftAid) * 100) / 100;

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    feeAmount: roundedFee,
    totalAmount: roundedTotal,
    giftAidAmount: roundedGiftAid,
    totalWithGiftAid: roundedTotalWithGiftAid,
    effectiveRatePercent: Math.round((roundedFee / baseAmount) * 1000) / 10,
  };
}
