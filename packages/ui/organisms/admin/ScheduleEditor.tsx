import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateToLocal } from "ui/atoms/Formatters";
import {
  DigitalItemStatus,
  getDigitalItemStatusTitle,
  ScheduleItem,
} from "ui/types/adminTypes";

const ScheduleEditor = (props: {
  date: string;
  schedules: ScheduleItem[];
  prevStatus: DigitalItemStatus;
  addHandler: (status: DigitalItemStatus, time: string) => void;
  removeHandler: (status: DigitalItemStatus, time: string) => void;
  changeHandler: (
    status: DigitalItemStatus,
    oTime: string,
    nTime: string,
  ) => void;
}) => {
  const [scheduleViewOnly, setScheduleViewOnly] = useState(false);
  const [scheduleOnSale, setScheduleOnSale] = useState(false);
  const [scheduleUnlisted, setScheduleUnlisted] = useState(false);

  const [timeViewOnly, setTimeViewOnly] = useState(null);
  const [timeOnSale, setTimeOnSale] = useState(null);
  const [timeUnlisted, setTimeUnlisted] = useState(null);

  useEffect(() => {
    if (!props.date) return;

    const scheduleViewOnlyIndex = props.schedules.findIndex(
      (schedule) => schedule.status == DigitalItemStatus.ViewingOnly,
    );
    if (scheduleViewOnlyIndex > -1) {
      setScheduleViewOnly(true);
      setTimeViewOnly(
        new Date(props.schedules[scheduleViewOnlyIndex].datetime),
      );
    } else {
      setScheduleViewOnly(false);
      setTimeViewOnly(new Date(props.date));
    }

    const scheduleOnSaleIndex = props.schedules.findIndex(
      (schedule) => schedule.status == DigitalItemStatus.OnSale,
    );
    if (scheduleOnSaleIndex > -1) {
      setScheduleOnSale(true);
      setTimeOnSale(new Date(props.schedules[scheduleOnSaleIndex].datetime));
    } else {
      setScheduleOnSale(false);
      setTimeOnSale(new Date(props.date));
    }
    
    const scheduleUnlistedIndex = props.schedules.findIndex(
      (schedule) => schedule.status == DigitalItemStatus.Unlisted,
    );
    if (scheduleUnlistedIndex > -1) {
      setScheduleUnlisted(true);
      setTimeUnlisted(
        new Date(props.schedules[scheduleUnlistedIndex].datetime),
      );
    } else {
      setScheduleUnlisted(false);
      setTimeUnlisted(new Date(props.date));
    }
  }, [props.date, props.schedules]);

  const openTimePicker = useCallback((status) => {
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
  }, []);

  const datepickerChangeHandler = useCallback(
    (status, date) => {
      if (status == DigitalItemStatus.ViewingOnly) {
        props.changeHandler(
          DigitalItemStatus.ViewingOnly,
          formatDateToLocal(timeViewOnly, true),
          formatDateToLocal(date, true),
        );
      }
      if (status == DigitalItemStatus.OnSale) {
        props.changeHandler(
          DigitalItemStatus.OnSale,
          formatDateToLocal(timeOnSale, true),
          formatDateToLocal(date, true),
        );
      }
      if (status == DigitalItemStatus.Unlisted) {
        props.changeHandler(
          DigitalItemStatus.Unlisted,
          formatDateToLocal(timeUnlisted, true),
          formatDateToLocal(date, true),
        );
      }
    },
    [props, timeOnSale, timeUnlisted, timeViewOnly],
  );

  const scheduleChangeHandler = useCallback(
    (status: DigitalItemStatus, v: boolean) => {
      if (v) {
        props.addHandler(
          status,
          status === DigitalItemStatus.ViewingOnly
            ? formatDateToLocal(timeViewOnly, true)
            : status === DigitalItemStatus.OnSale
              ? formatDateToLocal(timeOnSale, true)
              : formatDateToLocal(timeUnlisted, true),
        );
      } else {
        props.removeHandler(
          status,
          status === DigitalItemStatus.ViewingOnly
            ? formatDateToLocal(timeViewOnly, true)
            : status === DigitalItemStatus.OnSale
              ? formatDateToLocal(timeOnSale, true)
              : formatDateToLocal(timeUnlisted, true),
        );
      }
    },
    [props, timeOnSale, timeUnlisted, timeViewOnly],
  );

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex justify-around gap-8">
        <div className="w-[100px] flex flex-col text-primary font-normal items-center">
          <span className="text-[64px] leading-[96px]">
            {props.date?new Date(props.date).getDate():""}
          </span>
          <span className="text-xl opacity-50 uppercase">
            {props.date?new Date(props.date).toLocaleDateString("en-US", {
              weekday: "short",
            }):""}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <span className="w-[108px] text-base text-secondary text-right mr-6">
              Viewing Only
            </span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  scheduleViewOnly ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={scheduleViewOnly}
              onChange={(e) => {
                scheduleChangeHandler(
                  DigitalItemStatus.ViewingOnly,
                  e.target.checked,
                );
              }}
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
                  ${scheduleViewOnly ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.ViewingOnly)}
              readOnly
            />
            {scheduleViewOnly && (
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
                popperClassName="custom-datepicker-popper"
              />
            )}
          </div>
          <div className="flex items-center">
            <span className="w-[108px] text-right mr-6">On Sale</span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  scheduleOnSale ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={scheduleOnSale}
              onChange={(e) => {
                scheduleChangeHandler(
                  DigitalItemStatus.OnSale,
                  e.target.checked,
                );
              }}
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
                  ${scheduleOnSale ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.OnSale)}
              readOnly
            />
            {scheduleOnSale && (
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
                popperClassName="custom-datepicker-popper"
              />
            )}
          </div>
          <div className="flex items-center">
            <span className="w-[108px] text-right mr-6">Unlisted</span>
            <input
              type="checkbox"
              className={`toggle w-[50px] h-[26px] mr-6
                ${
                  scheduleUnlisted ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
                } bg-base-white`}
              checked={scheduleUnlisted}
              onChange={(e) => {
                scheduleChangeHandler(
                  DigitalItemStatus.Unlisted,
                  e.target.checked,
                );
              }}
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
                  ${scheduleUnlisted ? "visible" : "invisible"}`}
              onClick={() => openTimePicker(DigitalItemStatus.Unlisted)}
              readOnly
            />
            {scheduleUnlisted && (
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
                popperClassName="custom-datepicker-popper"
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0 border border-[#AEAEAE]"></div>
      <div className="flex gap-2">
        <span className="w-[72px] text-secondary text-center">LOG</span>
        <div className="flex flex-col gap-2">
          {props.schedules.length == 0
            ? getDigitalItemStatusTitle(props.prevStatus)
            : props.schedules.map((schedule, index) => (
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
                  <span className="w-[108px] h-6 text-center">
                    {getDigitalItemStatusTitle(
                      index == 0
                        ? props.prevStatus
                        : props.schedules[index - 1].status,
                    )}
                  </span>
                  <span className="w-[24px] h-6 text-center">→</span>
                  <span className="w-[108px] h-6 text-center">
                    {getDigitalItemStatusTitle(schedule.status)}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScheduleEditor);
