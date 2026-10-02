/**
 * Indian Rupee (INR) Formatting Utility
 * Adheres strictly to Indian numbering system format (lakhs, crores, thousands).
 * Example: ₹1,499, ₹14,999, ₹1,24,999
 */

export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '₹0';
  
  // Format to integer currency representation
  const rounded = Math.round(amount);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rounded);
}

export function calculateDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
