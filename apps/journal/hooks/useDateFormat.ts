import { useCallback } from "react";

/**
 * 日付フォーマットを返す
 * @returns
 */
const useDateFormat = () => {
  const formattedFromDate = useCallback((date: Date) => {
    // ゼロパディングのYYYY/MM/DD形式を返す
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }, []);

  const formattedFromYMD = useCallback((y: number, m: number, d: number) => {
    const month = ("0" + m).slice(-2);
    const day = ("0" + d).slice(-2);
    return `${y}/${month}/${day}`;
  }, []);

  return { formattedFromDate, formattedFromYMD };
};

export default useDateFormat;
