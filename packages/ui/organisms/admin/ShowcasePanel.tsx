import { formatInTimeZone } from "date-fns-tz";
import ja from "date-fns/locale/ja";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { formatDateToLocal } from "ui/atoms/Formatters";
import CustomDatePicker from "./CustomDatePicker";
import ShowcaseConfirmDialog from "./ShowcaseConfirmDialog";
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
  onStatusChange: (id: number, newStatus: string) => void;
  onDeleteShowcase: () => void;
};

const ShowcaseComponent = (props: ShowcaseComponentProps) => {
  const [status, setStatus] = useState(props.status);
  const [prevStatus, setPrevStatus] = useState(ShowcaseStatus.Private);
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
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const handleHoverEnter = () => {
    setIsHovered(true);
  };
  const handleHoverLeave = () => {
    setIsHovered(false);
  };
  const apiUrl = "native/admin/showcases";
  const { error, putData } = useRestfulAPI(null);
  const t = useTranslations("ContentShowcase");

  const popupRef = useRef(null);
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
        setDatePickerVisible(true);
        break;
      case 4:
        props.onDeleteShowcase();
        break;

      default:
        break;
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
    props.onStatusChange(props.id, status);
    const jsonData = await putData(
      `${apiUrl}/${props.id}`,
      status == ShowcaseStatus.ScheduledPublic
        ? { status, scheduleTime: scheduleTime }
        : { status },
      [],
    );
    if (jsonData) {
      props.refreshHandler();
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
    const scheduleTimeJST = formatInTimeZone(
      scheduleTime,
      "Asia/Tokyo",
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    );

    const jsonData = await putData(
      `${apiUrl}/${props.id}`,
      { scheduleTime: scheduleTimeJST, status: 2 },
      [],
    );

    if (jsonData) {
      setScheduleTimeChanged(false);
      props.refreshHandler();
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

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
    setPrevStatus(status);
  };

  const getStatusLabel = () => {
    switch (status) {
      case ShowcaseStatus.Public:
        return t("Published");
      case ShowcaseStatus.Private:
        return t("Private");
      case ShowcaseStatus.ScheduledPublic:
        return t("Scheduled");
      default:
        return "";
    }
  };
  const handleClose = (done: boolean) => {
    setDatePickerVisible(false);
    done
      ? changeStatus(ShowcaseStatus.ScheduledPublic)
      : changeStatus(prevStatus);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-72 h-[430px] rounded-2xl relative
          ${
            status == ShowcaseStatus.Public
              ? "outline outline-4 outline-success-200"
              : ""
          }
        `}
        style={{
          backgroundImage: `url(${props.thumbImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        {isDatePickerVisible && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute backdrop-blur-[7px] inset-0"></div>
            </div>

            {/* CustomDatePicker */}
            <div className="absolute fixed inset-0 z-50 flex items-center justify-center">
              <CustomDatePicker
                onDateTimeChange={(date) => {
                  setScheduleTime(date);
                  setScheduleTimeChanged(true);
                }}
                onScheduleDone={() => {
                  changeScheduleTime();
                  handleClose(true);
                }}
                onClose={() => {
                  handleClose(false);
                }}
                initialDateTime={scheduleTime}
              />
            </div>
          </>
        )}
        {isHovered && (
          <Link href={`/contents/showcase?id=${props.id}`}>
            <div
              className={`absolute left-0 top-0 w-72 h-[430px] z-10 rounded-2xl
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
        {status === ShowcaseStatus.ScheduledPublic && (
          <div className="flex justify-center items-center cursor-pointer mt-6">
            <div
              className="flex gap-2 z-10 text-primary text-[17px] leading-4 font-normal"
              onClick={() => statusChangeHandler(2)}
            >
              <span className="bg-base-white rounded-[6px] h-9 flex items-center px-3">
                {scheduleTime.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="bg-base-white rounded-[6px] h-9 flex items-center px-3">
                {scheduleTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
          </div>
        )}
        <div
          className="absolute bottom-[12px] right-[13px] flex flex-row-reverse justify-between z-20"
          ref={popupRef}
          onClick={status !== ShowcaseStatus.Public ? handleClick : undefined}
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
            <button
              className={`inline-block text-[15px] leading-4 font-medium text-center text-secondary-100 py-1
              ${
                status == ShowcaseStatus.Public
                  ? "w-34"
                  : "border-r border-white w-26"
              }`}
            >
              {getStatusLabel()}
            </button>
            {status != ShowcaseStatus.Public && (
              <button className="w-8 flex justify-center items-center relative py-1">
                <Image
                  src="/admin/images/icon/down-arrow-icon.svg"
                  width={13}
                  height={13}
                  alt="drop"
                  className={`transition-transform duration-300 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {isMenuOpen && (
            <div className="absolute left-0 top-10 z-50">
              <ShowcaseEditMenu
                clickHandler={statusChangeHandler}
                status={status}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 w-72">
        <span className="flex-1 text-secondary-700 text-[16px] leading-4 font-medium truncate">
          {title}
        </span>
        <Image
          src="/admin/images/icon/pencil.svg"
          width={18}
          height={18}
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
      <div className="text-secondary-700 text-[12px] leading-4 font-light">
        {t("LastUpdatedDate")} {formatDateToLocal(modifiedTime, true)}
      </div>
    </div>
  );
};

const ShowcasePanel = ({ reload }) => {
  const apiUrl = "native/admin/showcases";
  const { error, data, getData, setData, deleteData } = useRestfulAPI(apiUrl);
  const [localReload, setLocalReload] = useState(0);
  const showcaseConfirmDialogRef = useRef(null);
  const [deleteShowcaseId, setDeleteShowcaseId] = useState(null);

  const sortData = (data) => {
    return data?.slice().sort((a, b) => {
      // Move "PUBLISH" status (1) items to the front
      if (a.status === 1 && b.status !== 1) return -1;
      if (b.status === 1 && a.status !== 1) return 1;

      // For all other statuses, preserve original order (no sorting)
      return 0;
    });
  };

  const sortedData = sortData(data);

  const showcaseDeleteHandler = async () => {
    if (
      deleteShowcaseId &&
      (await deleteData(`${apiUrl}/${deleteShowcaseId}`))
    ) {
      setLocalReload(localReload + 1);
      setDeleteShowcaseId(null);
    } else {
      if (error) {
        if (typeof error === "string") {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedShowcases = data.map((showcase) => {
      if (showcase.id === id) {
        return { ...showcase, status: newStatus };
      }
      if (
        newStatus === ShowcaseStatus.Public &&
        showcase.status === ShowcaseStatus.Public
      ) {
        return { ...showcase, status: ShowcaseStatus.Private };
      }
      return showcase;
    });
    setData(updatedShowcases);
  };

  useEffect(() => {
    if (localReload > 0 || reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, localReload]);

  return (
    <div className="flex flex-wrap gap-x-24 gap-y-12 select-none">
      {sortedData &&
        sortedData.length > 0 &&
        sortedData.map((showcase) => (
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
            onStatusChange={handleStatusChange}
            onDeleteShowcase={() => {
              setDeleteShowcaseId(showcase.id);
              showcaseConfirmDialogRef.current.showModal();
            }}
          />
        ))}
      <ShowcaseConfirmDialog
        dialogRef={showcaseConfirmDialogRef}
        deleteHandler={showcaseDeleteHandler}
      />
    </div>
  );
};

export { ShowcasePanel };
