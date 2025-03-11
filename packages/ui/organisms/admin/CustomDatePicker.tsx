import { addMonths, endOfMonth, format, getDay, startOfMonth } from "date-fns";
import { format as tzFormat, toZonedTime } from "date-fns-tz";
import React, { useEffect, useRef, useState } from "react";

interface CustomDatePickerProps {
  onDateTimeChange: (date: Date) => void;
  onClose: () => void;
  onScheduleDone: () => void;
  initialDateTime: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateTimeChange,
  onClose,
  onScheduleDone,
  initialDateTime,
}) => {
  const timeZone = "Asia/Tokyo";
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateTime);
  const getCurrentTokyoTimePlusTwoHours = () => {
    const originalNow = new Date();
    const now = new Date();
    now.setHours(now.getHours() + 2);

    const targetDate = originalNow < initialDateTime ? initialDateTime : now;
    return tzFormat(toZonedTime(targetDate, timeZone), "HH:mm", { timeZone });
  };
  const [time, setTime] = useState<string>(getCurrentTokyoTimePlusTwoHours());

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalNow = new Date();

    if (originalNow < initialDateTime) {
      return;
    }

    const now = new Date(originalNow);
    now.setHours(now.getHours() + 2);

    if (now.getDate() !== originalNow.getDate()) {
      setSelectedDate(new Date(now));
    }
  }, []);

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
    onDateTimeChange(date);
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
      className="date-picker absolute bg-white border border-gray-300 rounded-2xl p-2.5 text-center mt-3"
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
          <div className="absolute right-5" onClick={() => onClose()}>
            X
          </div>
        </div>
        <div className="day-names grid my-1 text-sm grid-cols-7">
          {dayNames.map((day) => (
            <div key={day} className="font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="days grid gap-1 grid-cols-7">
          {daysInMonth().map((day, index) => {
            const isPastDay =
              day &&
              new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                day,
              ) < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={index}
                className="flex items-center justify-center w-[44px] h-[44px]"
              >
                {day && (
                  <button
                    onClick={() => !isPastDay && handleDateChange(day)}
                    className={`flex items-center border-none p-6 cursor-pointer w-[44px] h-[44px] rounded-full justify-center ${
                      isPastDay
                        ? "text-gray-500 cursor-not-allowed"
                        : selectedDate.getDate() === day
                          ? "bg-[#b4d5f8] text-primary text-[24px]"
                          : "text-black text-[20px]"
                    }`}
                    disabled={isPastDay}
                  >
                    {day}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-black text-base font-medium rounded-b-[16px] border-t border-gray-300 pt-2">
        <div className="pl-4">Publish</div>
        <div className="flex items-center">
          <input
            id="appointment-time"
            name="appointment-time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-22 bg-[#7878801F] text-center py-1 px-[10px] rounded-[6px] border-none outline-none"
          />
        </div>
      </div>
      <div className="float-right mt-3">
        <button
          onClick={() => {
            const [hours, minutes] = time.split(":").map(Number);
            const updatedDate = new Date(selectedDate);
            updatedDate.setHours(hours, minutes);
            updateDateTime(updatedDate);
            onScheduleDone();
          }}
          className="ml-2 bg-primary text-white px-4 py-1 rounded-[40px] text-[15px]"
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
