import ja from "date-fns/locale/ja";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { formatDateToLocal } from "ui/atoms/Formatters";
import ShowcaseEditMenu from "./ShowcaseEditMenu";
import ShowcaseNameEditDialog from "./ShowcaseNameEditDialog";

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
  description: string;
  scheduleTime?: string;
  updateTime: string;
  refreshHandler: () => void;
};

const ShowcaseComponent = (props: ShowcaseComponentProps) => {
  const [status, setStatus] = useState(ShowcaseStatus.Private);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [scheduleTime, setScheduleTime] = useState(
    props.scheduleTime && props.scheduleTime.length
      ? new Date(props.scheduleTime)
      : new Date(),
  );
  const [modifiedTime, setModifiedTime] = useState("");
  const [scheduleTimeChanged, setScheduleTimeChanged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleHoverEnter = () => {
    setIsHovered(true);
  };
  const handleHoverLeave = () => {
    setIsHovered(false);
  };
  const apiUrl = "native/admin/showcases";
  const { error, putData, deleteData } = useRestfulAPI(null);

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
        deleteHandler();
        break;

      default:
        break;
    }
  };

  const deleteHandler = async () => {
    if (await deleteData(`${apiUrl}/${props.id}`)) {
      props.refreshHandler();
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const changeShowcaseDetail = async (title: string, description: string) => {
    const jsonData = await putData(
      `${apiUrl}/${props.id}`,
      { title, description },
      [],
    );
    if (jsonData) {
      setTitle(jsonData.title);
      setDescription(jsonData.description);
      setModifiedTime(jsonData.updateTime);
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const changeStatus = async (status) => {
    setStatus(status);

    const jsonData = await putData(
      `${apiUrl}/${props.id}`,
      status == ShowcaseStatus.ScheduledPublic
        ? { status, scheduleTime: scheduleTime }
        : { status },
      [],
    );
    if (jsonData) {
      if (status == ShowcaseStatus.Public) {
        props.refreshHandler();
      }
      setModifiedTime(jsonData.updateTime);
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const changeScheduleTime = async () => {
    if (!scheduleTimeChanged) {
      return;
    }

    const jsonData = await putData(
      `${apiUrl}/${props.id}`,
      { scheduleTime },
      [],
    );
    if (jsonData) {
      setScheduleTimeChanged(false);
      setModifiedTime(jsonData.updateTime);
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-60 h-[360px] rounded-2xl relative
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
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        {isHovered && (
          <Link href={`/contents/showcase?id=${props.id}`}>
            <div
              className={`absolute left-0 top-0 w-60 h-[360px] z-10 rounded-2xl
              bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-[450ms] ease-out opacity-0 hover:opacity-100`}
            >
              <span className="text-white text-[10px]">Click to Edit</span>
              <Image
                src="/admin/images/icon/magic-icon.svg"
                width={36}
                height={36}
                alt="magic-icon"
                className="cursor-pointer"
              />
            </div>
          </Link>
        )}
        <div
          className="absolute bottom-[12px] right-[13px]
            flex flex-row-reverse justify-between z-20"
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
              className={`inline-block text-[10px] leading-4 font-medium text-center text-secondary-100
              ${
                status == ShowcaseStatus.Public
                  ? "w-20"
                  : "w-16 border-r border-white"
              }`}
            >
              {status == ShowcaseStatus.Public
                ? "Public"
                : status == ShowcaseStatus.Private
                  ? "Private"
                  : status == ShowcaseStatus.ScheduledPublic
                    ? "Scheduled"
                    : ""}
            </span>
            {status != ShowcaseStatus.Public && (
              <div className="w-6 flex justify-center items-center relative">
                <Image
                  src="/admin/images/icon/down-arrow-icon.svg"
                  width={8}
                  height={8}
                  alt="drop"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                />
                {isMenuOpen && (
                  <div className="absolute left-0 top-3 z-10" ref={popupRef}>
                    <ShowcaseEditMenu clickHandler={statusChangeHandler} />
                  </div>
                )}
              </div>
            )}
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
                {scheduleTime.toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
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
          showcaseTitle={title}
          showcaseDescription={description}
          dialogRef={dialogRef}
          changeHandler={changeShowcaseDetail}
        />
      </div>
      <div className="text-secondary-700 text-[10px] leading-4 font-light">
        Last Updated Date： {formatDateToLocal(modifiedTime, true)}
      </div>
    </div>
  );
};

const ShowcasePanel = ({ reload }) => {
  const apiUrl = "native/admin/showcases";
  const { data, getData } = useRestfulAPI(apiUrl);
  const [localReload, setLocalReload] = useState(0);

  useEffect(() => {
    if (localReload > 0 || reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, localReload]);

  return (
    <>
      <div className="flex flex-wrap gap-x-24 gap-y-12 select-none">
        {data &&
          data.length > 0 &&
          data.map((showcase, index) => {
            return (
              <ShowcaseComponent
                key={`showcase-${showcase.id}`}
                id={showcase.id}
                title={showcase.title}
                description={showcase.description}
                status={showcase.status}
                thumbImage={showcase.thumbImage}
                scheduleTime={showcase.scheduleTime}
                updateTime={showcase.updateTime}
                refreshHandler={() => setLocalReload(localReload + 1)}
              />
            );
          })}
      </div>
    </>
  );
};

export { ShowcasePanel };
