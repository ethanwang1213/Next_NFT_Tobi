export const formatCurrency = (amount: number) => {
  return (amount / 1).toLocaleString('ja-JP', {
    style: 'currency',
    currency: '',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'ja-JP',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

