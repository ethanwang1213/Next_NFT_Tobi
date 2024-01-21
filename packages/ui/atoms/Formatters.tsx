import React from "react";
import numeral from "numeral";

export const formatCurrency = (amount: number) => {
  // Format the amount using numeral
  const formattedAmount = amount !== 0 ? numeral(amount).format("0,0") : "-";

  return <span>{formattedAmount}</span>;
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "ja-JP"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
