/**
 * Safe number formatting utility to prevent runtime crashes when values are undefined/null.
 */

export const formatNumber = (val, options = {}) => {
  if (typeof val !== "number" || isNaN(val)) {
    return options.fallback ?? "0";
  }
  return val.toLocaleString(undefined, options);
};

export const formatCurrency = (val, currency = "USD") => {
  return formatNumber(val, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
