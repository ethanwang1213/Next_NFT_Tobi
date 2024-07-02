import NextImage from "next/image";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DigitalItemStatus, ScheduleItem } from "ui/types/adminTypes";
import ScheduleEditor from "./ScheduleEditor";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const PrevMonthButton = () => {
  return (
    <div className="flex justify-center items-center">
      <NextImage
        src="/admin/images/icon/prev_month_arrow.png"
        width={24}
        height={24}
        alt="next"
      />
    </div>
  );
};

const NextMonthButton = () => {
  return (
    <div className="flex justify-center items-center">
      <NextImage
        src="/admin/images/icon/next_month_arrow.png"
        width={24}
        height={24}
        alt="next"
      />
    </div>
  );
};

const ScheduleCalendar = () => {
  const [selectedDate, onChange] = useState<Value>(new Date());
  const schedules = [
    {
      from: DigitalItemStatus.Draft,
      to: DigitalItemStatus.ViewingOnly,
      datetime: "2024-07-15 00:00",
    },
    {
      from: DigitalItemStatus.ViewingOnly,
      to: DigitalItemStatus.Unlisted,
      datetime: "2024-07-22 00:00",
    },
    {
      from: DigitalItemStatus.Unlisted,
      to: DigitalItemStatus.OnSale,
      datetime: "2024-07-25 13:00",
    },
    {
      from: DigitalItemStatus.OnSale,
      to: DigitalItemStatus.Unlisted,
      datetime: "2024-07-29 23:00",
    },
  ];

  const compare = (date: string, schedule: ScheduleItem) => {
    const scheduleTime = new Date(schedule.datetime).getTime();
    const firtTime = new Date(date).setHours(0, 0, 0, 0);
    const lastTime = new Date(date).setHours(23, 59, 59, 999);
    if (lastTime < scheduleTime) return 1;
    if (firtTime > scheduleTime) return -1;
    return 0;
  };

  const getTileClass = ({ date, view }) => {
    if (view === "month") {
      if (schedules.length == 0) return null;

      let status = schedules[0].from;
      let statusBegin = 0;
      let statusEnd = 0;
      let statusString;
      for (const schedule of schedules) {
        const result = compare(date, schedule);
        // console.log("compare", date, schedule, result);
        if (result < 0) {
          status = schedule.to;
          continue;
        }
        if (result > 0) break;

        if (
          schedule.from == DigitalItemStatus.OnSale ||
          schedule.to == DigitalItemStatus.OnSale
        ) {
          status = DigitalItemStatus.OnSale;
        } else if (
          schedule.from == DigitalItemStatus.ViewingOnly ||
          schedule.to == DigitalItemStatus.ViewingOnly
        ) {
          status = DigitalItemStatus.ViewingOnly;
        }

        statusEnd = schedule.from;
        statusBegin = schedule.to;
      }
      if (status === DigitalItemStatus.ViewingOnly) {
        statusString = "status-view-only";
      } else if (status === DigitalItemStatus.OnSale) {
        statusString = "status-on-sale";
      } else {
        return null;
      }

      if (status === statusBegin) {
        statusString = statusString + "-begin";
      }
      if (status === statusEnd) {
        statusString = statusString + "-end";
      }

      // console.log(
      //   "gettileClass",
      //   date,
      //   status,
      //   statusBegin,
      //   statusEnd,
      //   statusString,
      // );
      return statusString;
    }
    return null;
  };

  const renderCustomNavigationLabel = ({ date, view }) => {
    if (view === "month") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "-48px",
          }}
        >
          <span className="text-black text-xl font-bold mb-4">
            {date.getFullYear()}
          </span>
          <span className="text-primary text-xl font-semibold">
            {date.toLocaleString("default", { month: "long" })}
          </span>
        </div>
      );
    }
    return null;
  };

  const formatShortWeekday = (locale, date) =>
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()];

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={selectedDate}
        className="schedule-calendar"
        navigationLabel={renderCustomNavigationLabel}
        prevLabel={<PrevMonthButton />}
        nextLabel={<NextMonthButton />}
        next2Label={null}
        prev2Label={null}
        calendarType="gregory"
        formatShortWeekday={formatShortWeekday}
        tileClassName={getTileClass}
      />
      <ScheduleEditor
        date={selectedDate.toString()}
        schedules={schedules.filter((schedule) => {
          const scheduleTime = new Date(schedule.datetime).setHours(0, 0, 0, 0);
          const selectedTime = new Date(selectedDate.toString()).setHours(
            0,
            0,
            0,
            0,
          );
          return scheduleTime == selectedTime;
        })}
      />
    </div>
  );
};

export default React.memo(ScheduleCalendar);
