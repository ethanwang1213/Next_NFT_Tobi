import { format } from "date-fns";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimeInput = ({
  className,
  value,
  labelDate,
  labelTime,
  placeholder,
  changeHandler,
}: {
  className: string;
  value?: string;
  labelDate?: string;
  labelTime?: string;
  placeholder?: string;
  changeHandler?: (value) => void;
}) => {
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value && value.length ? new Date(value) : undefined
  );
  const [dateValue, setDateValue] = useState(
    value && value.length ? value.split(" ")[0] : ""
  );
  const [timeValue, setTimeValue] = useState(
    value && value.length ? value.split(" ")[1] : ""
  );

  const uniqueId = Math.random().toString(36).substring(2, 11);

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
    document.getElementById(`date-picker_${uniqueId}`).click();
  };

  const openTimePicker = () => {
    document.getElementById(`time-picker_${uniqueId}`).click();
  };

  const datepickerChangeHandler = (date) => {
    setSelectedDate(date);
    setDateValue(format(date, "yyyy/MM/dd"));
    setTimeValue(
      date
        ? date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : ""
    );
  };

  const dateInputChangeHandler = (e) => {
    setDateValue(e.target.value.length ? e.target.value : "");
    if (e.target.value.length == 0) setTimeValue("");
  };
  const timeInputChangeHandler = (e) => {
    setTimeValue(e.target.value.length ? e.target.value : "");
    if (e.target.value.length == 0) setDateValue("");
  };

  return (
    <div
      className={clsx(
        "h-12 border-2 rounded-lg border-[#717171]/50",
        "hover:border-[#1779DE]/25 focus-within:border-[#1779DE]/50 hover:focus-within:border-[#1779DE]/50",
        "flex flex-row",
        className
      )}
    >
      <div
        className="w-36 flex-[3_2_auto] ml-5 mr-4 relative"
        onClick={openDatePicker}
      >
        <input
          type="text"
          id={`date-input_${uniqueId}`}
          value={dateValue}
          className={clsx(
            "absolute left-0 right-0 top-0 bottom-0 pt-4 outline-none",
            "text-sm font-normal text-[#717171]",
            "placeholder:text-[#717171]/50 placeholder:font-normal"
          )}
          placeholder={isDateFocused ? placeholder : ""}
          onFocus={handleDateFocus}
          onBlur={handleDateBlur}
          onChange={dateInputChangeHandler}
        />
        <label
          className={`absolute cursor-text font-normal transition-all duration-300 z-10 ${
            isDateFocused || dateValue.length
              ? "text-xs top-1 text-[#717171]"
              : "text-sm top-3 text-[#717171]/50"
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
        />
      </div>
      <div className="w-px bg-[#717171]/50"></div>
      <div className="w-16 flex-auto mx-4 relative" onClick={openTimePicker}>
        <input
          id={`time-input_${uniqueId}`}
          type="text"
          value={timeValue}
          className={clsx(
            "absolute left-0 right-0 top-0 bottom-0 pt-4 outline-none",
            "text-sm font-normal text-[#717171]"
          )}
          onFocus={handleTimeFocus}
          onBlur={handleTimeBlur}
          onChange={timeInputChangeHandler}
        />
        <label
          className={`absolute cursor-text font-normal transition-all duration-300 z-10 ${
            isTimeFocused || timeValue.length
              ? "text-xs top-1 text-[#717171]"
              : "text-sm top-3 text-[#717171]/50"
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
          timeCaption="Time"
          className="hidden"
          popperPlacement="bottom-start"
          popperClassName="mt-4"
        />
      </div>
    </div>
  );
};

export default DateTimeInput;
