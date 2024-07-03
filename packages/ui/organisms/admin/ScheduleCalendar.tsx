import NextImage from "next/image";
import React, { useCallback, useState } from "react";
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

const ScheduleCalendar = (props: {
  status: DigitalItemStatus;
  schedules: ScheduleItem[];
  changeHandler: (value: ScheduleItem[]) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [schedules, setSchedules] = useState(props.schedules);
  const [error, setError] = useState(false);

  const renderCustomNavigationLabel = useCallback(({ date, view }) => {
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
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "8px",
          }}
        >
          <span className="text-black text-xl font-bold mb-4">
            {date.getFullYear()}
          </span>
        </div>
      );
    }
  }, []);

  const formatShortWeekday = useCallback(
    (locale, date) => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()],
    [],
  );

  const getStatusPriority = useCallback((status: DigitalItemStatus) => {
    switch (status) {
      case DigitalItemStatus.OnSale:
        return 2;
      case DigitalItemStatus.ViewingOnly:
        return 1;
      default:
        return 0;
    }
  }, []);

  const getStatusClassName = useCallback((status: DigitalItemStatus) => {
    switch (status) {
      case DigitalItemStatus.OnSale:
        return "status-on-sale";
      case DigitalItemStatus.ViewingOnly:
        return "status-view-only";
      default:
        return "";
    }
  }, []);

  const get3Status = useCallback(
    (date: string) => {
      let beginStatus = props.status;
      let midStatus = props.status;
      let endStatus = props.status;

      for (const schedule of schedules) {
        const scheduleDate = new Date(schedule.datetime).setHours(0, 0, 0, 0);
        const scheduleDateTime = new Date(schedule.datetime).getTime();
        const dateTime = new Date(date).setHours(0, 0, 0, 0);
        const nextDate = new Date(dateTime);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateTime = nextDate.getTime();

        if (scheduleDate < dateTime) {
          endStatus = midStatus = beginStatus = schedule.status;
          continue;
        }

        if (scheduleDate == dateTime) {
          endStatus = schedule.status;
          if (scheduleDate == scheduleDateTime) {
            beginStatus = DigitalItemStatus.None;
            midStatus = schedule.status;
          } else {
            if (
              getStatusPriority(midStatus) <= getStatusPriority(schedule.status)
            )
              midStatus = schedule.status;
          }
        }

        if (scheduleDate > dateTime) {
          if (nextDateTime == scheduleDateTime) {
            endStatus = DigitalItemStatus.None;
          }
          break;
        }
      }

      return { beginStatus, midStatus, endStatus };
    },
    [getStatusPriority, props.status, schedules],
  );

  const getTileClass = ({ date, view }) => {
    if (view === "month") {
      const { beginStatus, midStatus, endStatus } = get3Status(date);
      return getStatusClassName(midStatus);
    }

    return null;
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const { beginStatus, midStatus, endStatus } = get3Status(date);
      return (
        <div className="absolute left-0 top-0 w-full h-full">
          <div
            className={`status-bg-section absolute top-0 h-full left-0 w-1/2 ${getStatusClassName(
              beginStatus,
            )}`}
          ></div>
          <div
            className={`status-bg-section absolute top-0 h-full right-0 w-1/2 ${getStatusClassName(
              endStatus,
            )}`}
          ></div>
          <div
            className={`status-bg-section absolute top-0 h-full w-12 rounded-lg ${getStatusClassName(
              midStatus,
            )}`}
            style={{ left: "calc(50% - 24px)" }}
          ></div>
        </div>
      );
    }
    return null;
  };

  const getPrevStatus = useCallback(
    (date: string) => {
      let status = props.status;
      for (const schedule of schedules) {
        const scheduleDate = new Date(schedule.datetime).setHours(0, 0, 0, 0);
        const dateTime = new Date(date).setHours(0, 0, 0, 0);

        if (scheduleDate < dateTime) {
          status = schedule.status;
          continue;
        }

        if (scheduleDate >= dateTime) {
          break;
        }
      }

      return status;
    },
    [props.status, schedules],
  );

  const checkSchedules = useCallback(
    (values: ScheduleItem[]) => {
      if (values.length < 2) {
        if (error) setError(false);
        return;
      }

      let prevStatus = null;
      for (const schedule of values) {
        if (prevStatus == null) {
          prevStatus = schedule;
          continue;
        } else {
          if (
            prevStatus.status != schedule.status &&
            prevStatus.datetime != schedule.datetime
          ) {
            prevStatus = schedule;
            continue;
          } else {
            setError(true);
            return;
          }
        }
      }

      if (error) setError(false);
    },
    [error],
  );

  const addScheduleHandler = useCallback(
    (status: DigitalItemStatus, time: string) => {
      let newSchedules = [...schedules, { status, datetime: time }];
      newSchedules.sort((a, b) => {
        const aTime = new Date(a.datetime).getTime();
        const bTime = new Date(b.datetime).getTime();
        return aTime - bTime;
      });
      setSchedules(newSchedules);
      checkSchedules(newSchedules);
      props.changeHandler(newSchedules);
    },
    [checkSchedules, props, schedules],
  );

  const removeScheduleHandler = useCallback(
    (status: DigitalItemStatus, time: string) => {
      const newSchedules = schedules.filter((item) => {
        if (item.status !== status) return true;
        if (new Date(item.datetime).getTime() !== new Date(time).getTime())
          return true;

        return false;
      });
      setSchedules(newSchedules);
      checkSchedules(newSchedules);
      props.changeHandler(newSchedules);
    },
    [checkSchedules, props, schedules],
  );

  const changeScheduleHandler = useCallback(
    (status: DigitalItemStatus, oTime: string, nTime: string) => {
      let newSchedules = [...schedules, { status, datetime: nTime }];
      const index = newSchedules.findIndex(
        (item) =>
          item.status === status &&
          new Date(item.datetime).getTime() == new Date(oTime).getTime(),
      );
      newSchedules.splice(index, 1);
      newSchedules.sort((a, b) => {
        const aTime = new Date(a.datetime).getTime();
        const bTime = new Date(b.datetime).getTime();
        return aTime - bTime;
      });
      setSchedules(newSchedules);
      checkSchedules(newSchedules);
      props.changeHandler(newSchedules);
    },
    [checkSchedules, props, schedules],
  );

  return (
    <div className="flex flex-col gap-9">
      <Calendar
        onChange={setSelectedDate}
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
        tileContent={getTileContent}
      />
      <ScheduleEditor
        date={selectedDate.toString()}
        schedules={schedules.filter((schedule) => {
          const scheduleTime = new Date(schedule.datetime).setHours(0, 0, 0, 0);
          const datetime = new Date(selectedDate.toString()).setHours(
            0,
            0,
            0,
            0,
          );
          return scheduleTime == datetime;
        })}
        prevStatus={getPrevStatus(selectedDate.toString())}
        addHandler={addScheduleHandler}
        removeHandler={removeScheduleHandler}
        changeHandler={changeScheduleHandler}
      />
      {error && (
        <div className="bg-[#FFEAEA] rounded-[10px] border border-[#E0E3E8] p-2 pr-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-error flex justify-center items-center">
            <NextImage
              src="/admin/images/icon/warning-bold.svg"
              width={16}
              height={16}
              alt="warning icon"
            />
          </div>
          <span className="text-[#3A3D44] text-base font-medium">
            Status change invalid: Cannot change to the same status.
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScheduleCalendar);
