import { format } from "date-fns";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import { formatDateToLocal } from "../atoms/Formatters";

const DateTimeInput = ({
  className,
  value,
  labelDate,
  labelTime,
  placeholder,
  changeHandler,
  readOnly,
}: {
  className: string;
  value?: string;
  labelDate?: string;
  labelTime?: string;
  placeholder?: string;
  changeHandler?: (value) => void;
  readOnly?: boolean;
}) => {
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value && value.length ? new Date(value) : undefined,
  );
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    setUniqueId(Math.random().toString(36).substring(2, 11));
  }, []);

  useEffect(() => {
    if (selectedDate !== undefined) {
      setDateValue(format(selectedDate, "yyyy/MM/dd"));
      setTimeValue(
        selectedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    }
  }, [selectedDate]);

  const handleDateFocus = () => {
    setIsDateFocused(true);
  };

  const handleDateBlur = () => {
    setIsDateFocused(false);
  };

  const handleTimeFocus = () => {
    setIsTimeFocused(true);
  };

  const handleTimeBlur = () => {
    setIsTimeFocused(false);
  };

  const openDatePicker = () => {
    if (readOnly) return;
    const datePicker = document.getElementById(`date-picker_${uniqueId}`);
    datePicker?.click();
  };

  const openTimePicker = () => {
    if (readOnly) return;
    const timePicker = document.getElementById(`time-picker_${uniqueId}`);
    timePicker?.click();
  };

  const datepickerChangeHandler = (date) => {
    setSelectedDate(date);
    changeHandler(formatDateToLocal(date, true));
  };

  const dateInputChangeHandler = (e) => {
    setDateValue(e.target.value.length ? e.target.value : "");
    if (e.target.value.length == 0) setTimeValue("");

    changeHandler("");
  };

  const timeInputChangeHandler = (e) => {
    setTimeValue(e.target.value.length ? e.target.value : "");
    if (e.target.value.length == 0) setDateValue("");

    changeHandler("");
  };

  registerLocale("ja", ja);
  setDefaultLocale("ja");

  return (
    <div
      className={clsx(
        "h-12 border-2 rounded-lg border-secondary",
        readOnly
          ? "bg-secondary-200"
          : "hover:border-hover-color focus-within:border-focus-color hover:focus-within:border-focus-color",
        "flex flex-row",
        className,
      )}
    >
      <div
        className="w-36 flex-[3_2_auto] ml-5 mr-4 relative font-normal text-sm"
        onClick={openDatePicker}
      >
        <input
          type="text"
          id={`date-input_${uniqueId}`}
          value={dateValue}
          className={clsx(
            "absolute left-0 right-0 top-0 bottom-0 pt-4 outline-none",
            "text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder={isDateFocused ? placeholder : ""}
          onFocus={handleDateFocus}
          onBlur={handleDateBlur}
          onChange={dateInputChangeHandler}
          readOnly={readOnly}
        />
        <label
          className={`absolute cursor-text font-normal transition-all duration-300 z-[1] ${
            isDateFocused || (dateValue && dateValue.length)
              ? "text-xs top-1 text-input-color"
              : "text-sm top-3 text-placeholder-color"
          }`}
          htmlFor={`date-input_${uniqueId}`}
        >
          {" "}
          {labelDate}
        </label>
        <DatePicker
          id={`date-picker_${uniqueId}`}
          selected={selectedDate}
          onChange={datepickerChangeHandler}
          dateFormat="yyyy/MM/dd"
          showPopperArrow={false}
          className="hidden"
          popperPlacement="bottom-start"
          popperClassName="mt-4"
          locale="ja"
        />
      </div>
      <div className="w-px bg-secondary/50"></div>
      <div
        className="w-16 flex-auto mx-4 relative font-normal text-sm"
        onClick={openTimePicker}
      >
        <input
          id={`time-input_${uniqueId}`}
          type="text"
          value={timeValue}
          className={clsx(
            "absolute left-0 right-0 top-0 bottom-0 pt-4 outline-none",
            "text-sm text-input-color",
          )}
          onFocus={handleTimeFocus}
          onBlur={handleTimeBlur}
          onChange={timeInputChangeHandler}
          readOnly={readOnly}
        />
        <label
          className={`absolute cursor-text font-normal transition-all duration-300 z-[1] ${
            isTimeFocused || (timeValue && timeValue.length)
              ? "text-xs top-1 text-input-color"
              : "text-sm top-3 text-placeholder-color"
          }`}
          htmlFor={`time-input_${uniqueId}`}
        >
          {" "}
          {labelTime}
        </label>
        <DatePicker
          id={`time-picker_${uniqueId}`}
          selected={selectedDate}
          onChange={datepickerChangeHandler}
          dateFormat="HH:mm"
          showPopperArrow={false}
          showTimeSelect
          showTimeSelectOnly
          timeFormat="HH:mm"
          timeCaption="時間"
          className="hidden"
          popperPlacement="bottom-start"
          popperClassName="mt-4"
          locale="ja"
        />
      </div>
    </div>
  );
};

export default DateTimeInput;
