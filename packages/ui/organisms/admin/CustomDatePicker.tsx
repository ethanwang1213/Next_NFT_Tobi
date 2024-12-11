import { addMonths, endOfMonth, format, getDay, startOfMonth } from "date-fns";
import { format as tzFormat, fromZonedTime, toZonedTime } from "date-fns-tz";
import React, { useEffect, useRef, useState } from "react";

interface CustomDatePickerProps {
  onDateTimeChange: (date: Date) => void;
  onClose: () => void;
  initialDateTime: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateTimeChange,
  onClose,
  initialDateTime,
}) => {
  const timeZone = "Asia/Tokyo";
  const [selectedDate, setSelectedDate] = useState<Date>(
    toZonedTime(initialDateTime, timeZone),
  );
  const [time, setTime] = useState<string>(
    tzFormat(fromZonedTime(initialDateTime, timeZone), "HH:mm", {
      timeZone,
    }),
  );

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const zonedDate = toZonedTime(initialDateTime, timeZone);
    setSelectedDate(zonedDate);
    setTime(tzFormat(zonedDate, "HH:mm", { timeZone }));
  }, [initialDateTime]);

  const handleDateChange = (day: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
      selectedDate.getHours(),
      selectedDate.getMinutes(),
    );
    setSelectedDate(newDate);
    updateDateTime(newDate);
  };

  const handleMonthChange = (increment: number) => {
    const newDate = addMonths(selectedDate, increment);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTime(newTime);
    const [hours, minutes] = newTime.split(":").map(Number);
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(hours, minutes);
    updateDateTime(updatedDate);
  };

  const updateDateTime = (date: Date) => {
    const utcDate = fromZonedTime(date, timeZone);
    onDateTimeChange(utcDate);
  };

  const daysInMonth = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const daysArray = [];
    const startDayIndex = getDay(start);

    for (let i = 0; i < startDayIndex; i++) {
      daysArray.push(null);
    }

    for (let i = start.getDate(); i <= end.getDate(); i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      ref={datePickerRef}
      className="date-picker absolute bg-white border border-gray-300 rounded-lg p-2.5 text-center mt-3"
    >
      <div className="mb-3">
        <div className="flex justify-start items-center mb-1 pl-3">
          <button onClick={() => handleMonthChange(-1)} className="font-bold">
            {" "}
            &lt;{" "}
          </button>
          <p className="text-[17px] font-bold py-1 px-3 text-black w-[200px]">
            {format(selectedDate, "MMMM yyyy")}
          </p>
          <button onClick={() => handleMonthChange(1)} className="font-bold">
            {" "}
            &gt;{" "}
          </button>
        </div>
        <div className="day-names grid my-1 text-sm grid-cols-7">
          {dayNames.map((day) => (
            <div key={day} className="font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="days grid gap-1 grid-cols-7">
          {daysInMonth().map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-[44px] h-[44px]"
            >
              {day ? (
                <button
                  onClick={() => handleDateChange(day)}
                  className={`flex items-center border-none p-6 cursor-pointer w-[44px] h-[44px] rounded-full justify-center ${
                    selectedDate.getDate() === day
                      ? "bg-[#b4d5f8] text-primary text-[24px]"
                      : "text-black text-[20px]"
                  }`}
                >
                  {day}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-black text-base font-medium rounded-b-[16px] border-t border-gray-300 pt-2">
        <div className="pl-4">Publish</div>
        <div className="flex items-center">
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-22 bg-[#7878801F] text-center py-1 px-[10px] rounded-[6px] border-none outline-none"
          />
          <button
            onClick={() => {
              const [hours, minutes] = time.split(":").map(Number);
              const updatedDate = new Date(selectedDate);
              updatedDate.setHours(hours, minutes);
              updateDateTime(updatedDate);
              onClose();
            }}
            className="ml-2 bg-primary text-white px-4 py-1 rounded-[40px] text-[15px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;
