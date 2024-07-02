import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DigitalItemStatus,
  getDigitalItemStatusTitle,
  ScheduleItem,
} from "ui/types/adminTypes";

const ScheduleEditor = ({
  date,
  schedules,
}: {
  date: string;
  schedules: ScheduleItem[];
}) => {
  const [statusViewOnly, setStatusViewOnly] = useState(false);
  const [statusOnSale, setStatusOnSale] = useState(false);
  const [statusUnlisted, setStatusUnlisted] = useState(false);

  const [timeViewOnly, setTimeViewOnly] = useState(null);
  const [timeOnSale, setTimeOnSale] = useState(null);
  const [timeUnlisted, setTimeUnlisted] = useState(null);

  console.log("ScheduleEditComponent", date, schedules, timeViewOnly);

  useEffect(() => {
    const scheduleViewOnlyIndex = schedules.findIndex(
      (schedule) => schedule.to == DigitalItemStatus.ViewingOnly,
    );
    if (scheduleViewOnlyIndex > -1) {
      setStatusViewOnly(true);
      setTimeViewOnly(new Date(schedules[scheduleViewOnlyIndex].datetime));
    } else {
      setStatusViewOnly(false);
      setTimeViewOnly(new Date(date));
    }
    const scheduleOnSaleIndex = schedules.findIndex(
      (schedule) => schedule.to == DigitalItemStatus.OnSale,
    );
    if (scheduleOnSaleIndex > -1) {
      setStatusOnSale(true);
      setTimeOnSale(new Date(schedules[scheduleOnSaleIndex].datetime));
    } else {
      setStatusOnSale(false);
      setTimeOnSale(new Date(date));
    }
    const scheduleUnlistedIndex = schedules.findIndex(
      (schedule) => schedule.to == DigitalItemStatus.Unlisted,
    );
    if (scheduleUnlistedIndex > -1) {
      setStatusUnlisted(true);
      setTimeUnlisted(new Date(schedules[scheduleUnlistedIndex].datetime));
    } else {
      setStatusUnlisted(false);
      setTimeUnlisted(new Date(date));
    }
  }, [date, schedules]);

  const openTimePicker = (status) => {
    if (status == DigitalItemStatus.ViewingOnly) {
      const timePicker = document.getElementById(`time-picker-view-only`);
      timePicker?.click();
    }
    if (status == DigitalItemStatus.OnSale) {
      const timePicker = document.getElementById(`time-picker-on-sale`);
      timePicker?.click();
    }
    if (status == DigitalItemStatus.Unlisted) {
      const timePicker = document.getElementById(`time-picker-unlisted`);
      timePicker?.click();
    }
  };

  const datepickerChangeHandler = (status, date) => {
    if (status == DigitalItemStatus.ViewingOnly) {
      setTimeViewOnly(date);
    }
    if (status == DigitalItemStatus.OnSale) {
      setTimeOnSale(date);
    }
    if (status == DigitalItemStatus.Unlisted) {
      setTimeUnlisted(date);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 z-10">
      <div className="flex justify-around">
        <div className="w-[100px] flex flex-col text-primary font-normal items-center">
          <span className="text-[64px] leading-[96px]">
            {new Date(date).getDate()}
          </span>
          <span className="text-xl opacity-50 uppercase">
            {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
          </span>
        </div>
        <div className="h-8 flex flex-col gap-4">
          <div className="flex items-center">
            <span className="w-[108px] text-base text-secondary text-right mr-6">
              Viewing Only
            </span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  statusViewOnly ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={statusViewOnly}
              onChange={(e) => setStatusViewOnly(e.target.checked)}
            />
            <input
              id={`time-input-view-only`}
              type="text"
              value={
                timeViewOnly
                  ? timeViewOnly.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : ""
              }
              className={`w-20 h-8 rounded-lg border-2 border-[#9A9A9A] outline-none text-base text-secondary text-center
                  ${statusViewOnly ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.ViewingOnly)}
            />
            {statusViewOnly && (
              <DatePicker
                id={`time-picker-view-only`}
                selected={timeViewOnly}
                onChange={(v) =>
                  datepickerChangeHandler(DigitalItemStatus.ViewingOnly, v)
                }
                dateFormat="HH:mm"
                showPopperArrow={false}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeCaption="時間"
                className="hidden"
                popperPlacement="top-end"
                popperClassName=""
                locale="ja"
              />
            )}
          </div>
          <div className="h-8 flex items-center">
            <span className="w-[108px] text-right mr-6">On Sale</span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  statusOnSale ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={statusOnSale}
              onChange={(e) => setStatusOnSale(e.target.checked)}
            />
            <input
              id={`time-input-on-sale`}
              type="text"
              value={
                timeOnSale
                  ? timeOnSale.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : ""
              }
              className={`w-20 h-8 rounded-lg border-2 border-[#9A9A9A] outline-none text-base text-secondary text-center
                  ${statusOnSale ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.OnSale)}
            />
            {statusOnSale && (
              <DatePicker
                id={`time-picker-on-sale`}
                selected={timeOnSale}
                onChange={(v) =>
                  datepickerChangeHandler(DigitalItemStatus.OnSale, v)
                }
                dateFormat="HH:mm"
                showPopperArrow={false}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeCaption="時間"
                className="hidden"
                popperPlacement="top-end"
                popperClassName=""
                locale="ja"
              />
            )}
          </div>
          <div className="h-8 flex items-center">
            <span className="w-[108px] text-right mr-6">Unlisted</span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  statusUnlisted ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={statusUnlisted}
              onChange={(e) => setStatusUnlisted(e.target.checked)}
            />
            <input
              id={`time-input-unlisted`}
              type="text"
              value={
                timeUnlisted
                  ? timeUnlisted.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : ""
              }
              className={`w-20 h-8 rounded-lg border-2 border-[#9A9A9A] outline-none text-base text-secondary text-center
                  ${statusUnlisted ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.Unlisted)}
            />
            {statusUnlisted && (
              <DatePicker
                id={`time-picker-unlisted`}
                selected={timeUnlisted}
                onChange={(v) =>
                  datepickerChangeHandler(DigitalItemStatus.Unlisted, v)
                }
                dateFormat="HH:mm"
                showPopperArrow={false}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeCaption="時間"
                className="hidden"
                popperPlacement="top-end"
                popperClassName=""
                locale="ja"
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0 border border-[#AEAEAE]"></div>
      {schedules.length > 0 && (
        <div className="flex justify-around">
          <span className="w-[108px] text-secondary text-center">LOG</span>
          <div className="flex flex-col gap-2">
            {schedules.map((schedule, index) => (
              <div
                key={`schedule-${index}`}
                className="flex items-center text-base text-secondary-600 font-normal"
              >
                <span className="w-16 h-6">
                  {new Date(schedule.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
                <span className="w-[108px] h-6 text-center ml-3">
                  {getDigitalItemStatusTitle(schedule.from)}
                </span>
                <span className="w-[24px] h-6 text-center">→</span>
                <span className="w-[108px] h-6 text-center">
                  {getDigitalItemStatusTitle(schedule.to)}
                </span>
              </div>
            ))}
          </div>
          {/* <div className="w-[108px]"></div> */}
        </div>
      )}
    </div>
  );
};

export default React.memo(ScheduleEditor);
