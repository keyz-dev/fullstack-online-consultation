/**
 * Formats a numeric amount to 2 decimal places
 * Handles both number and string inputs safely
 */
export const formatAmount = (amount: any): string => {
  if (amount === null || amount === undefined) {
    return "0.00";
  }

  return typeof amount === "number"
    ? amount.toFixed(2)
    : parseFloat(String(amount || 0)).toFixed(2);
};

/**
 * Formats a currency amount with the given currency code
 */
export const formatCurrency = (
  amount: any,
  currency: string = "FCFA"
): string => {
  return `${currency} ${formatAmount(amount)}`;
};
