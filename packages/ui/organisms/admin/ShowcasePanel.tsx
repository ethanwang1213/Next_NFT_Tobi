import Image from "next/image";
import { useEffect, useRef, useState } from "react";

enum ShowcaseStatus {
  Private = 0,
  Public,
  ScheduledPublic,
}

type ShowcaseComponentProps = {
  status: ShowcaseStatus;
  title: string;
};

const ShowcaseComponent = (props: ShowcaseComponentProps) => {
  const [status, setStatus] = useState(props.status);
  const [title, setTitle] = useState(props.title);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const textInputRef = useRef(null);

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

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`w-60 h-[360px] rounded-2xl
          ${
            status == ShowcaseStatus.Public ? "border-4 border-success-200" : ""
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
                  <ShowcaseEditMenu />
                </div>
              )}
            </div>
          </div>
          {status == ShowcaseStatus.ScheduledPublic && (
            <div className="w-[120px] h-4 bg-base-white rounded-[27px] px-1 flex items-center gap-2">
              <Image
                src="/admin/images/icon/clock.svg"
                width={8}
                height={8}
                alt="clock icon"
              />
              <span className="text-secondary-700 text-[8px] leading-4 font-normal">
                2024/04/14　12：00
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <input
          ref={textInputRef}
          type="text"
          value={title}
          className="flex-1 text-secondary-700 text-[10px] leading-4 font-medium"
        />
        <Image
          src="/admin/images/icon/pencil.svg"
          width={16}
          height={16}
          alt="edit icon"
          className="cursor-pointer"
        />
      </div>
      <div className="text-secondary-700 text-[10px] leading-4 font-light">
        Last Updated Date： 2024/04/14 23:59
      </div>
    </div>
  );
};

const ShowcaseEditMenu = () => {
  const items = [
    {
      type: "menu",
      icon: "public-icon.svg",
      title: "Public",
      color: "secondary",
    },
    {
      type: "menu",
      icon: "private-icon.svg",
      title: "Private",
      color: "secondary",
    },
    {
      type: "menu",
      icon: "schedule-icon.svg",
      title: "Schedule",
      color: "secondary",
    },
    { type: "divider", icon: "", title: "", color: "secondary-200" },
    { type: "menu", icon: "delete-icon.svg", title: "Delete", color: "error" },
  ];

  return (
    <ul
      className="w-24 rounded bg-white"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      {items.map((item, index) => {
        return item.type == "menu" ? (
          <li className="h-4 flex items-center px-2 gap-2 cursor-pointer hover:bg-secondary-100">
            <Image
              src={`/admin/images/icon/${item.icon}`}
              width={8}
              height={8}
              alt="icon"
            />
            <span
              className={`text-${item.color} text-[8px] leading-4 font-normal`}
            >
              {item.title}
            </span>
          </li>
        ) : (
          <div
            className={`w-full h-0 border-0 border-t-[0.5px] border-${item.color}`}
          ></div>
        );
      })}
      <li></li>
    </ul>
  );
};

const ShowcasePanel = ({ refresh }: { refresh: number }) => {
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
  }, [refresh]);

  return (
    <div className="flow-root mx-[50px] my-[60px]">
      <div className="flex flex-wrap gap-x-36 gap-y-12 select-none">
        <ShowcaseComponent
          status={ShowcaseStatus.Public}
          title="THE TITLE OF SHOWCASE"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          title="THE TITLE OF SHOWCASE"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.ScheduledPublic}
          title="THE TITLE OF SHOWCASE"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          title="THE TITLE OF SHOWCASE"
        />
        <ShowcaseComponent
          status={ShowcaseStatus.Private}
          title="THE TITLE OF SHOWCASE"
        />
      </div>
    </div>
  );
};

export { ShowcasePanel };
