import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ShowcaseEditMenu from "./ShowcaseEditMenu";
import ShowcaseNameEditDialog from "./ShowcaseNameEditDialog";
import {
  fetchShowcases,
  deleteShowcase,
  updateShowcase,
} from "fetchers/ShowcaseActions";
import { formatDateToLocal } from "../../atoms/Formatters";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

registerLocale("ja", ja);

enum ShowcaseStatus {
  Private = 0,
  Public,
  ScheduledPublic,
}

type ShowcaseComponentProps = {
  id: number;
  thumbImage: string;
  status: ShowcaseStatus;
  title: string;
  scheduleTime?: string;
  updateTime: string;
  refreshHandler: () => void;
  errorHandler: (value: string) => void;
};

const ShowcaseComponent = (props: ShowcaseComponentProps) => {
  const [status, setStatus] = useState(ShowcaseStatus.Private);
  const [title, setTitle] = useState(props.title);
  const [scheduleTime, setScheduleTime] = useState(
    props.scheduleTime && props.scheduleTime.length
      ? new Date(props.scheduleTime)
      : new Date(),
  );
  const [modifiedTime, setModifiedTime] = useState("");
  const [scheduleTimeChanged, setScheduleTimeChanged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const popupRef = useRef(null);
  const datePickerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  useEffect(() => {
    setModifiedTime(props.updateTime);
  }, [props.updateTime]);

  const statusChangeHandler = (index: number) => {
    setIsMenuOpen(false);
    switch (index) {
      case 0:
        changeStatus(ShowcaseStatus.Public);
        break;
      case 1:
        changeStatus(ShowcaseStatus.Private);
        break;
      case 2:
        changeStatus(ShowcaseStatus.ScheduledPublic);
        break;
      case 4:
        deleteData();
        break;

      default:
        break;
    }
  };

  const deleteData = async () => {
    const result = await deleteShowcase(props.id);
    if (result) {
      props.refreshHandler();
    } else {
      // show error message
      props.errorHandler("Failed to delete the showcase");
    }
  };

  const changeTitle = async (title: string) => {
    const result = await updateShowcase(props.id, { title });
    if (result != null) {
      setTitle(title);
      setModifiedTime(result.updateTime);
    } else {
      // show error message
      props.errorHandler("Failed to change the title of the showcase");
    }
  };

  const changeStatus = async (status) => {
    setStatus(status);
    const result = await updateShowcase(
      props.id,
      status == ShowcaseStatus.ScheduledPublic
        ? { status, scheduleTime: scheduleTime }
        : { status },
    );
    if (result != null) {
      setModifiedTime(result.updateTime);
      if (status == ShowcaseStatus.Public) {
        props.refreshHandler();
      }
    } else {
      // show error message
      props.errorHandler("Failed to change the status of the showcase");
    }
  };

  const changeScheduleTime = async () => {
    if (!scheduleTimeChanged) {
      return;
    }

    const result = await updateShowcase(props.id, {
      scheduleTime: scheduleTime,
    });
    if (result != null) {
      setModifiedTime(result.updateTime);
      setScheduleTimeChanged(false);
    } else {
      // show error message
      props.errorHandler("Failed to change the schedule time of the showcase");
    }
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
        style={{
          backgroundImage: `url(${props.thumbImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover", // Ensure the image covers the entire div
          backgroundRepeat: "no-repeat", // Prevent image repetition
        }}
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
                onClick={() => {
                  if (status == ShowcaseStatus.Public) return;
                  setIsMenuOpen(!isMenuOpen);
                }}
              />
              {isMenuOpen && (
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
                {format(scheduleTime, "yyyy/MM/dd")}&nbsp;
                {scheduleTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
              <DatePicker
                ref={datePickerRef}
                selected={scheduleTime}
                onChange={(date) => {
                  setScheduleTime(date);
                  setScheduleTimeChanged(true);
                }}
                onCalendarClose={changeScheduleTime}
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
          {title}
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
          initialValue={title}
          dialogRef={dialogRef}
          changeHandler={changeTitle}
        />
      </div>
      <div className="text-secondary-700 text-[10px] leading-4 font-light">
        Last Updated Date： {formatDateToLocal(modifiedTime, true)}
      </div>
    </div>
  );
};

const ShowcasePanel = () => {
  // showcase data
  const [showcases, setShowcases] = useState([]);
  const [reload, setReload] = useState(0);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShowcases();
        if (data != null) {
          setShowcases(data);
        } else {
          toastErrorMessage("Failed to load showcase. Please check the error.");
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        toastErrorMessage(error.toString());
      }
    };

    fetchData();
  }, [reload]);

  const toastErrorMessage = (value: string) => {
    toast(value, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-x-36 gap-y-12 select-none">
        {showcases &&
          showcases.length > 0 &&
          showcases.map((showcase, index) => {
            return (
              <ShowcaseComponent
                key={`showcase-${showcase.id}`}
                id={showcase.id}
                title={showcase.title}
                status={showcase.status}
                thumbImage={showcase.thumbImage}
                scheduleTime={showcase.scheduleTime}
                updateTime={showcase.updateTime}
                refreshHandler={() => setReload(reload + 1)}
                errorHandler={toastErrorMessage}
              />
            );
          })}
      </div>
      <ToastContainer />
    </>
  );
};

export { ShowcasePanel };
