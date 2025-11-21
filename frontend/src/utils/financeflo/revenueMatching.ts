/**
 * Revenue bracket matching utilities for GHL form integration
 * Maps calculator revenue inputs to GHL dropdown brackets
 */

export interface RevenueBracketResult {
  bracket: string;
  exactRevenue: number;
  formattedRevenue: string;
}

/**
 * Convert annual revenue to GHL dropdown bracket
 * Matches exact dropdown options from GHL form
 */
export function getRevenueBracket(annualRevenue: number): string {
  if (annualRevenue < 1000000) return 'Under £1M';
  if (annualRevenue < 5000000) return '£1M-£5M';
  if (annualRevenue < 10000000) return '£5M-£10M';
  if (annualRevenue < 25000000) return '£10M-£25M';
  if (annualRevenue < 50000000) return '£25M-£50M';
  if (annualRevenue < 100000000) return '£50M-£100M';
  return '£100M+';
}

/**
 * Format revenue for PDF display
 * Returns UK-formatted currency string (e.g., "£8,500,000")
 */
export function formatRevenueForPDF(annualRevenue: number): string {
  return '£' + annualRevenue.toLocaleString('en-GB');
}

/**
 * Get exact revenue number for GHL number field
 * Returns plain number without any formatting
 */
export function getExactRevenueForGHL(annualRevenue: number): number {
  return annualRevenue;
}

/**
 * Complete revenue data for GHL submission
 */
export function getRevenueData(annualRevenue: number): RevenueBracketResult {
  return {
    bracket: getRevenueBracket(annualRevenue),
    exactRevenue: getExactRevenueForGHL(annualRevenue),
    formattedRevenue: formatRevenueForPDF(annualRevenue)
  };
}

/**
 * Extract URL parameters for email pre-fill and UTM tracking
 */
export function getURLParameters() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    email: params.get('email') || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || ''
  };
}

/**
 * Store calculator data in session storage for thank you page
 */
export function storeCalculatorData(inputs: any, results: any) {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('calculator_inputs', JSON.stringify(inputs));
  sessionStorage.setItem('calculator_results', JSON.stringify(results));
  sessionStorage.setItem('calculator_timestamp', new Date().toISOString());
}

/**
 * Retrieve calculator data from session storage
 */
export function getStoredCalculatorData() {
  if (typeof window === 'undefined') return null;

  const inputs = sessionStorage.getItem('calculator_inputs');
  const results = sessionStorage.getItem('calculator_results');
  const timestamp = sessionStorage.getItem('calculator_timestamp');

  if (!inputs || !results) return null;

  return {
    inputs: JSON.parse(inputs),
    results: JSON.parse(results),
    timestamp
  };
}

/**
 * Clear calculator data from session storage
 */
export function clearStoredCalculatorData() {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('calculator_inputs');
  sessionStorage.removeItem('calculator_results');
  sessionStorage.removeItem('calculator_timestamp');
}
