import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: Dispatch<SetStateAction<number>>;
  selectedDay: number;
  setSelectedDay: Dispatch<SetStateAction<number>>;
  isBirthdayHidden: boolean;
  setIsBirthdayHidden: Dispatch<SetStateAction<boolean>>;
};

const BirthdaySelect: React.FC<Props> = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  isBirthdayHidden,
  setIsBirthdayHidden,
}) => {
  const [thisYear, setThisYear] = useState<number>(null);
  // 今年の月表示は今月まで
  const [endMonth, setEndMonth] = useState<number>(null);
  // 指定年月の末日
  const [endDay, setEndDay] = useState<number>(null);

  useEffect(() => {
    setThisYear(new Date().getFullYear());
  }, []);

  // 今年を選択している場合のみ、月の選択肢を今月までに設定
  // それ以外は12月までに設定
  useEffect(() => {
    const thisMonth = new Date().getMonth() + 1;
    const isThisYear = selectedYear === thisYear;
    setEndMonth(isThisYear ? thisMonth : 12);
    // 選択値が超えていた場合は、今月に設定
    if (isThisYear && selectedMonth > thisMonth) {
      setSelectedMonth(thisMonth);
    }
  }, [selectedYear]);

  // その年月の末日を設定
  useEffect(() => {
    const endDay = new Date(selectedYear, selectedMonth, 0).getDate();
    setEndDay(endDay);
    // 選択値が超えていた場合は、末日に設定
    if (selectedDay > endDay) {
      setSelectedDay(endDay);
    }
  }, [selectedYear, selectedMonth]);

  return (
    <>
      <div className="text-accent flex w-full">
        <div className="w-[30%]">
          <select
            className="select select-accent"
            value={selectedYear}
            onChange={(ev) => setSelectedYear(parseInt(ev.target.value))}
          >
            <option disabled>年</option>
            {[...Array(120)].map((_, i) => (
              <option key={i}>{(thisYear - i).toString()}</option>
            ))}
          </select>
          <span className="ml-1">年</span>
        </div>
        <div className="w-[26%]">
          <select
            className="select select-accent"
            value={selectedMonth}
            onChange={(ev) => setSelectedMonth(parseInt(ev.target.value))}
          >
            <option disabled>月</option>
            {[...Array(endMonth)].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          <span className="ml-1">月</span>
        </div>
        <div className="w-[26%]">
          <select
            className="select select-accent"
            value={selectedDay}
            onChange={(ev) => setSelectedDay(parseInt(ev.target.value))}
          >
            <option disabled>日</option>
            {[...Array(endDay)].map((_, i) => (
              <option key={i}>{(i + 1).toString()}</option>
            ))}
          </select>
          <span className="ml-1">日</span>
        </div>
      </div>
      <div className="mb-2 font-bold">
        <label className="cursor-pointer label gap-2 justify-start">
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            checked={isBirthdayHidden}
            onChange={(ev) => setIsBirthdayHidden(ev.target.checked)}
          />
          <span className="label-text text-accent">誕生日を隠す</span>
        </label>
      </div>
    </>
  );
};

export default BirthdaySelect;
