import React from "react";
import numeral from "numeral";

export const formatCurrency = (amount: number) => {
  // Format the amount using numeral
  const formattedAmount =
    !!amount && amount !== 0 ? numeral(amount).format("0,0") : "-";

  return <span>{formattedAmount}</span>;
};

export const formatDateToLocal = (
  dateStr: string,
  showTime: boolean = false,
  locale: string = "ja-JP",
) => {
  const date = new Date(dateStr);
  const optionsDateOnly: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const optionsDateTime: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat(
    locale,
    showTime ? optionsDateTime : optionsDateOnly,
  );
  return formatter.format(date);
};
