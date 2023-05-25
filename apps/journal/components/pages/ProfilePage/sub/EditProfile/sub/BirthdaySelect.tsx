import { useAuth } from "@/contexts/AuthProvider";
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

const BirthdaySelect: React.FC<Props> = ({
  register,
  getValues,
  watch,
  setValue,
  isModalOpen,
}) => {
  const { user } = useAuth();

  const [thisYear, setThisYear] = useState<number>(null);
  const [endMonth, setEndMonth] = useState<number>(null);
  const [endDay, setEndDay] = useState<number>(null);

  // モーダルを開く前の初期化処理
  useEffect(() => {
    setThisYear(new Date().getFullYear());
  }, []);

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
      setValue("year", thisY);
      setValue("month", new Date().getMonth() + 1);
      setValue("day", new Date().getDate());
    }
    setValue("isBirthdayHidden", user.isBirthdayHidden);
  }, [user, isModalOpen]);

  // 今年を選択している場合のみ、月の選択肢を今月までに設定
  // それ以外は12月までに設定
  useEffect(() => {
    const thisMonth = new Date().getMonth() + 1;
    const isThisYear = getValues("year") === thisYear;
    setEndMonth(isThisYear ? thisMonth : 12);
    // 選択値が超えていた場合は、今月に設定
    if (isThisYear && getValues("month") > thisMonth) {
      setValue("month", thisMonth);
    }
  }, [watch("year")]);

  // その年月の末日を設定
  useEffect(() => {
    const endDay = new Date(getValues("year"), getValues("month"), 0).getDate();
    setEndDay(endDay);
    // 選択値が超えていた場合は、末日に設定
    if (getValues("day") > endDay) {
      setValue("day", endDay);
    }
  }, [watch("year"), watch("month")]);

  return (
    <>
      <div className="text-accent flex w-full">
        {/* 年設定 */}
        <div className="">
          <select className="select select-accent" {...register("year")}>
            <option disabled>年</option>
            {[...Array(120)].map((_, i) => (
              <option key={i}>{(thisYear - i).toString()}</option>
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
      {/* 誕生日を隠す設定 */}
      <div className="mb-2 font-bold">
        <label className="cursor-pointer label gap-2 justify-start">
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            {...register("isBirthdayHidden")}
          />
          <span className="label-text text-accent">誕生日を隠す</span>
        </label>
      </div>
    </>
  );
};

export default BirthdaySelect;
