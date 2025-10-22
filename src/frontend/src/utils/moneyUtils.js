// Format money with currency symbol
export const renderMoney = (money) => {
  if (!money) return '';
  
  const currencyLogos = {
    'USD': '$',
    'CAD': '$',
    'JPY': '¥',
    'EUR': '€',
    'TRY': '₺',
    'GBP': '£',
  };

  const currencyCode = money.currencyCode || 'USD';
  const units = money.units || 0;
  const nanos = money.nanos || 0;
  const nanosFormatted = String(nanos).padStart(9, '0').substring(0, 2);
  
  const logo = currencyLogos[currencyCode] || '$';
  return `${logo}${units}.${nanosFormatted}`;
};

// Get currency logo
export const renderCurrencyLogo = (currencyCode) => {
  const logos = {
    'USD': '$',
    'CAD': '$',
    'JPY': '¥',
    'EUR': '€',
    'TRY': '₺',
    'GBP': '£',
  };
  
  return logos[currencyCode] || '$';
};