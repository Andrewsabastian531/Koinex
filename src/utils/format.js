/**
 * Utility functions for formatting and calculations
 */

/**
 * Format a number as Indian Rupee currency
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatINR(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '₹0.00';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Format with Indian numbering system
  const formatted = abs.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${sign}₹${formatted}`;
}

/**
 * Format a large number compactly
 * @param {number} value
 * @returns {string}
 */
export function formatCompact(value) {
  if (Math.abs(value) >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
  if (Math.abs(value) >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
  return formatINR(value);
}

/**
 * Format a crypto token amount
 * @param {number} value
 * @returns {string}
 */
export function formatCrypto(value) {
  if (value === 0) return '0';
  if (Math.abs(value) < 1e-8) return value.toExponential(3);
  if (Math.abs(value) < 0.0001) return value.toFixed(8);
  if (Math.abs(value) < 1) return value.toFixed(6);
  if (Math.abs(value) < 1000) return value.toFixed(4);
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

/**
 * Compute net capital gains from a capital gains object
 * @param {{ profits: number, losses: number }} gainObj
 * @returns {number}
 */
export function netGain(gainObj) {
  return gainObj.profits - gainObj.losses;
}

/**
 * Compute total realised capital gains
 * @param {{ stcg: { profits, losses }, ltcg: { profits, losses } }} capitalGains
 */
export function realisedCapitalGains(capitalGains) {
  const stcgNet = netGain(capitalGains.stcg);
  const ltcgNet = netGain(capitalGains.ltcg);
  return stcgNet + ltcgNet;
}

/**
 * Get CSS class for a gain value
 * @param {number} value
 * @returns {'positive'|'negative'|'neutral'}
 */
export function gainClass(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

/**
 * Get arrow symbol for gain direction
 * @param {number} value
 */
export function gainArrow(value) {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '–';
}
