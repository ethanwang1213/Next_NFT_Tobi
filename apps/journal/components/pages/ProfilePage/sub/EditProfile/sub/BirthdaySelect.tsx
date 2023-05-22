import { useEffect, useState } from "react";

type Props = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
};

const BirthdaySelect: React.FC<Props> = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
}) => {
  const [thisYear, setThisYear] = useState<number>(null);
  // 指定年月の末日
  const [endDay, setEndDay] = useState<number>(null);

  useEffect(() => {
    // TODO: 現在の誕生日が設定されている場合、その日付をセットする
    const now = new Date();
    const year = now.getFullYear();
    setThisYear(year);
    setSelectedYear(year);
  }, []);

  useEffect(() => {
    // その年月の末日を設定
    const endDay = new Date(selectedYear, selectedMonth, 0).getDate();
    setEndDay(endDay);
  }, [selectedYear, selectedMonth]);

  return (
    <>
      <select
        className="select select-primary w-[30%]"
        value={selectedYear}
        onChange={(ev) => setSelectedYear(parseInt(ev.target.value))}
      >
        <option disabled selected>
          年
        </option>
        {[...Array(120)].map((_, i) => (
          <option>{(thisYear - i).toString()}</option>
        ))}
      </select>
      年
      <select
        className="select select-primary w-[20%]"
        value={selectedMonth}
        onChange={(ev) => setSelectedMonth(parseInt(ev.target.value))}
      >
        <option disabled selected>
          月
        </option>
        {[...Array(12)].map((_, i) => (
          <option>{i + 1}</option>
        ))}
      </select>
      月
      <select
        className="select select-primary w-[20%]"
        value={selectedDay}
        onChange={(ev) => setSelectedDay(parseInt(ev.target.value))}
      >
        <option disabled selected>
          日
        </option>
        {[...Array(endDay)].map((_, i) => (
          <option>{(i + 1).toString()}</option>
        ))}
      </select>
      日
    </>
  );
};

export default BirthdaySelect;
