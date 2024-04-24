import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ShowcaseEditMenu from "./ShowcaseEditMenu";
import ShowcaseNameEditDialog from "./ShowcaseNameEditDialog";

registerLocale("ja", ja);

enum ShowcaseStatus {
  Private = 0,
  Public,
  ScheduledPublic,
}

type ShowcaseComponentProps = {
  status: ShowcaseStatus;
  name: string;
  schedule?: string;
  lastModifiedDate: string;
};

const ShowcaseComponent = (props: ShowcaseComponentProps) => {
  const [status, setStatus] = useState(props.status);
  const [name, setName] = useState(props.name);
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(
    props.schedule && props.schedule.length
      ? new Date(props.schedule)
      : new Date(),
  );

  const popupRef = useRef(null);
  const datePickerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const statusChangeHandler = (index: number) => {
    setIsOpen(false);
    switch (index) {
      case 0:
        setStatus(ShowcaseStatus.Public);
        break;
      case 1:
        setStatus(ShowcaseStatus.Private);
        break;
      case 2:
        setStatus(ShowcaseStatus.ScheduledPublic);
        break;
      case 3:
        // delete showcase
        break;

      default:
        break;
    }
  };

  const datepickerChangeHandler = (date) => {
    setScheduleDate(date);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-60 h-[360px] rounded-2xl
          ${
            status == ShowcaseStatus.Public
              ? "outline outline-4 outline-success-200"
              : ""
          }
        `}
        style={{ backgroundImage: `url(/admin/images/showcase.png)` }}
      >
        <div
          className="w-full mt-[331px] px-3 
            flex flex-row-reverse justify-between"
        >
          <div
            className={`rounded-[27px] p-0 flex justify-between items-center
            ${
              status == ShowcaseStatus.Public
                ? "bg-success"
                : status == ShowcaseStatus.Private
                  ? "bg-secondary-900"
                  : status == ShowcaseStatus.ScheduledPublic
                    ? "bg-primary"
                    : ""
            }
            `}
          >
            <span
              className="inline-block w-16 text-[10px] leading-4 font-medium text-center text-secondary-100
                border-r border-white"
            >
              {status == ShowcaseStatus.Public
                ? "Public"
                : status == ShowcaseStatus.Private
                  ? "Private"
                  : status == ShowcaseStatus.ScheduledPublic
                    ? "Scheduled"
                    : ""}
            </span>
            <div className="w-6 flex justify-center items-center relative">
              <Image
                src="/admin/images/icon/down-arrow-icon.svg"
                width={8}
                height={8}
                alt="drop"
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <div className="absolute left-0 top-3 z-10" ref={popupRef}>
                  <ShowcaseEditMenu clickHandler={statusChangeHandler} />
                </div>
              )}
            </div>
          </div>
          {status == ShowcaseStatus.ScheduledPublic && (
            <div
              className="w-[120px] h-4 bg-base-white rounded-[27px] px-1 flex items-center gap-2"
              onClick={() => {
                if (datePickerRef.current && datePickerRef.current.input) {
                  datePickerRef.current.input.click();
                }
              }}
            >
              <Image
                src="/admin/images/icon/clock.svg"
                width={8}
                height={8}
                alt="clock icon"
              />
              <span className="text-secondary-700 text-[8px] leading-4 font-normal">
                {format(scheduleDate, "yyyy/MM/dd")}&nbsp;
                {scheduleDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
              <DatePicker
                ref={datePickerRef}
                selected={scheduleDate}
                onChange={datepickerChangeHandler}
                dateFormat="yyyy/MM/dd HH:mm"
                showTimeSelect
                showPopperArrow={false}
                className="hidden"
                popperPlacement="bottom"
                popperClassName=""
                locale="ja"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <span className="flex-1 text-secondary-700 text-[10px] leading-4 font-medium">
          {name}
        </span>
        <Image
          src="/admin/images/icon/pencil.svg"
          width={16}
          height={16}
          alt="edit icon"
          className="cursor-pointer"
          onClick={(e) => {
            dialogRef.current.showModal();
          }}
        />
        <ShowcaseNameEditDialog
          initialValue={name}
          dialogRef={dialogRef}
          changeHandler={setName}
        />
      </div>
      <div className="text-secondary-700 text-[10px] leading-4 font-light">
        Last Updated Date： {props.lastModifiedDate}
      </div>
    </div>
  );
};

const ShowcasePanel = () => {
  // showcase data
  const [showcases, setShowcases] = useState([]);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetch showcase data");
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flow-root mx-[50px] my-[60px]">
      <div className="flex flex-wrap gap-x-36 gap-y-12 select-none">
        <ShowcaseComponent
          status={ShowcaseStatus.Public}
          name="THE TITLE OF SHOWCASE"
          lastModifiedDate="2024/04/14 22:50"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          name="THE TITLE OF SHOWCASE"
          lastModifiedDate="2024/04/14 22:50"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.ScheduledPublic}
          name="THE TITLE OF SHOWCASE"
          lastModifiedDate="2024/04/14 22:50"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          name="THE TITLE OF SHOWCASE"
          lastModifiedDate="2024/04/14 22:50"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          name="THE TITLE OF SHOWCASE"
          lastModifiedDate="2024/04/14 22:50"
        />
      </div>
    </div>
  );
};

export { ShowcasePanel };
