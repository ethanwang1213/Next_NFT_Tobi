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
  locale: string = "ja-JP",
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

// status number -> status string
export const formatSampleStatus = (status) => {
  let value;
  switch (status) {
    case 1:
      value = "Draft";
      break;
    case 2:
      value = "Private";
      break;
    case 3:
      value = "Viewing Only";
      break;
    case 4:
      value = "On Sale";
      break;
    case 5:
      value = "Unlisted";
      break;
    case 6:
      value = "Scheduled Publishing";
      break;
    case 7:
      value = "Scheduled for Sale";
      break;
    default:
      value = "";
      break;
  }
  return value;
};
