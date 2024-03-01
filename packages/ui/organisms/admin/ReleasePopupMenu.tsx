import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "ui/atoms/Button";

const ReleasePopupMenu = ({ pubStatus, pubDate }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date(pubDate.length ? pubDate.replace("-", "/") : undefined),
  );
  const [selectedTime, setSelectedTime] = useState(
    pubDate.length ? pubDate.split(" ")[1] : "",
  );

  const onChangeDatePicker = (date) => {
    setSelectedDate(date);
    setSelectedTime(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  };

  return (
    <div className={pubStatus === "予約公開" ? "w-67" : "w-28"}>
      <div className="">
        <input
          type="radio"
          id="radio1"
          name="radioGroup"
          className="tobiratory-radio"
          defaultChecked={pubStatus === "公開" || pubStatus === "公開中"}
        />
        <label htmlFor="radio1" className="ml-2 text-base/8">
          公開
        </label>
      </div>
      <div className="">
        <input
          type="radio"
          id="radio2"
          name="radioGroup"
          className="tobiratory-radio"
          defaultChecked={pubStatus === "非公開"}
        />
        <label htmlFor="radio2" className="ml-2 text-base/8">
          非公開
        </label>
      </div>
      <div className="">
        <input
          type="radio"
          id="radio3"
          name="radioGroup"
          className="tobiratory-radio"
          defaultChecked={pubStatus === "予約公開"}
        />
        <label htmlFor="radio3" className="ml-2 text-base/8">
          予約公開
        </label>
        {pubStatus === "予約公開" ? (
          <div>
            <div className="flex mt-2">
              <span className="w-18 text-xs bg-transparent border border-white rounded px-3 py-2 ml-3 text-center order-1">
                {selectedTime}
              </span>
              <DatePicker
                selected={selectedDate}
                onChange={onChangeDatePicker}
                dateFormat="yyyy/MM/dd"
                showPopperArrow={false}
                className="w-28 text-xs bg-transparent border border-white rounded px-3 py-2 ml-5 inline-block outline-none"
              />
            </div>
            <div className="mt-6">
              <Button className="w-26 text-xs bg-transparent border-0 px-3 py-2 ml-12">
                キャンセル
              </Button>
              <Button className="w-26 text-xs border-0 bg-[#1779DE] py-2 rounded">
                公開予約を設定
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ReleasePopupMenu;
