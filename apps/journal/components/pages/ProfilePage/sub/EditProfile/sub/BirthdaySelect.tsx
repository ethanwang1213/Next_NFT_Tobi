import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useEffect, useState } from "react";
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { EditProfileValues } from "../EditProfileModal";

type Props = {
  register: UseFormRegister<EditProfileValues>;
  getValues: UseFormGetValues<EditProfileValues>;
  watch: UseFormWatch<EditProfileValues>;
  setValue: UseFormSetValue<EditProfileValues>;
  isModalOpen: boolean;
};

/**
 * 誕生日設定のセレクタを管理するコンポーネント
 * @param param0
 * @returns
 */
const BirthdaySelect: React.FC<Props> = ({
  register,
  getValues,
  watch,
  setValue,
  isModalOpen,
}) => {
  const { user } = useAuth();

  const [thisYear, setThisYear] = useState<number>(0);
  const [endMonth, setEndMonth] = useState<number>(0);
  const [endDay, setEndDay] = useState<number>(0);

  // モーダルを開く前の初期化処理
  useEffect(() => {
    setThisYear(new Date().getFullYear());
  }, []);

  // selectで選択するとstring型になる場合があるため、numberに強制変換する
  const forceIntValues = () => {
    let y = getValues("year");
    if (typeof y === "string") {
      y = y === "" ? 0 : parseInt(y);
      setValue("year", y);
    }
    y = !y ? 0 : y;

    let m = getValues("month");
    if (typeof m === "string") {
      m = m === "" ? 0 : parseInt(m);
      setValue("month", m);
    }
    m = !m ? 0 : m;

    let d = getValues("day");
    if (typeof d === "string") {
      d = !d || d === "" ? 0 : parseInt(d);
      setValue("day", d);
    }
    d = !d ? 0 : d;

    return { y, m, d };
  };

  // 初期化処理
  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;

    const thisY = new Date().getFullYear();
    setThisYear(thisY);
    if (user.birthday) {
      setValue("year", user.birthday.year);
      setValue("month", user.birthday.month);
      setValue("day", user.birthday.day);
    } else {
      setValue("year", 0);
      setValue("month", 0);
      setValue("day", 0);
    }
  }, [user, isModalOpen]);

  // 今年を選択している場合のみ、月の選択肢を今月までに設定
  // それ以外は12月までに設定
  useEffect(() => {
    const { y, m } = forceIntValues();

    if (y === 0) {
      setEndMonth(0);
    } else {
      const thisMonth = new Date().getMonth() + 1;
      const isThisYear = y === thisYear;
      setEndMonth(isThisYear ? thisMonth : 12);

      // 月が未設定だった場合は、1月に設定
      if (m === 0) {
        setValue("month", 1);
      }
      // 選択値が超えていた場合は、今月に設定
      if (isThisYear && m > thisMonth) {
        setValue("month", thisMonth);
      }
    }
  }, [isModalOpen, watch("year")]);

  // その年月の末日を設定
  useEffect(() => {
    // formの値がstring型になる場合があるので、確実にnumberに変換
    const { y, m, d } = forceIntValues();

    if (y === 0 || m === 0) {
      setEndDay(0);
    } else {
      const endDay = new Date(y, m, 0).getDate();
      setEndDay(endDay);

      // 日が未設定だった場合は、1日に設定
      if (d === 0) {
        setValue("day", 1);
      }
      // 選択値が超えていた場合は、末日に設定
      if (d > endDay) {
        setValue("day", endDay);
      }
      // 今日より後の日付を選択していた場合は、今日に設定
      const thisDay = new Date().getDate();
      const isThisYear = y === thisYear;
      const isThisMonth = isThisYear && m === new Date().getMonth() + 1;
      if (isThisMonth) {
        setEndDay(thisDay);
        if (d > thisDay) {
          setValue("day", thisDay);
        }
      }
    }
  }, [isModalOpen, watch("month"), endMonth]);

  const handleClearValues = () => {
    setValue("year", 0);
    setValue("month", 0);
    setValue("day", 0);
  };

  return (
    <>
      <div className="text-accent flex w-full">
        {/* 年設定 */}
        <div className="">
          <select className="select select-accent" {...register("year")}>
            <option disabled>年</option>
            {[...Array(120)].map((_, i) => (
              <option key={i}>{thisYear - i}</option>
            ))}
          </select>
          <span className="ml-1 mr-2">年</span>
        </div>
        {/* 月設定 */}
        <div className="">
          <select className="select select-accent" {...register("month")}>
            <option disabled>月</option>
            {[...Array(endMonth)].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          <span className="ml-1 mr-2">月</span>
        </div>
        {/* 日設定 */}
        <div className="">
          <select className="select select-accent" {...register("day")}>
            <option disabled>日</option>
            {[...Array(endDay)].map((_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          <span className="ml-1 mr-2">日</span>
        </div>
      </div>
      {/* 誕生日をクリア */}
      <div className="mt-2 font-bold">
        <button
          type="button"
          className="text-primary text-sm"
          onClick={handleClearValues}
        >
          誕生日をクリア
        </button>
      </div>
    </>
  );
};

export default BirthdaySelect;
