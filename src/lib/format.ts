{/** Format a numeric amount as a currency string (e.g. 18.55 â†’ "Â£18.55"). */}
export function formatPrice(amount: number, currency: string): string {
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {

      return `${amount.toFixed(2)} ${currency}`;
    }
  }
  
  {/** Show a price range, collapsing to a single value when min === max. */}

  export function formatPriceRange(
    min: number,
    max: number,
    currency: string,
  ): string {
    if (min === max) return formatPrice(min, currency);
    return `${formatPrice(min, currency)} â€“ ${formatPrice(max, currency)}`;
  }
  