import clsx from "clsx";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimeInput = ({
  className,
  value,
  changeHandler,
  placeholder,
}: {
  className: string;
  value?: string;
  changeHandler?: (value) => void;
  placeholder?: string;
}) => {
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? value.split(" ")[1] : ""
  );

  const onChangeDatePicker = (date) => {
    setSelectedDate(date);
    setSelectedTime(
      date
        ? date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : ""
    );
  };

  return (
    <div
      className={clsx(
        "border-2 border-[#717171]/50 rounded-lg flex flex-row pl-5 pr-4",
        className
      )}
    >
      <DatePicker
        selected={selectedDate}
        onChange={onChangeDatePicker}
        dateFormat="yyyy/MM/dd"
        showPopperArrow={false}
        className="h-12 flex-auto w-64 text-sm placeholder:text-[#717171]/50 placeholder:font-normal outline-none"
        placeholderText={selectedDate ? "" : placeholder} // Set the placeholder text conditionally
      />
      <div className="w-px bg-[#717171]/50"></div>
      <span className="ml-3 mt-3.5 flex-auto w-32 text-sm placeholder:text-[#717171]/50 placeholder:font-normal">
        {selectedTime}
      </span>
    </div>
  );
};

export default DateTimeInput;
