import Image from "next/image";

const menuItems = [
  {
    type: "menu",
    icon: "public-icon.svg",
    text: "Public",
    color: "secondary",
  },
  {
    type: "menu",
    icon: "private-icon.svg",
    text: "Private",
    color: "secondary",
  },
  {
    type: "menu",
    icon: "schedule-icon.svg",
    text: "Schedule",
    color: "secondary",
  },
  { type: "divider", icon: "", text: "", color: "secondary-200" },
  { type: "menu", icon: "delete-icon.svg", text: "Delete", color: "error" },
];

const ShowcaseEditMenu = ({
  clickHandler,
  status,
}: {
  clickHandler: (index: number) => void;
  status: number;
}) => {
  const getIndexFromStatus = (status: number) => {
    switch (status) {
      case 0:
        return 1;
      case 1:
        return 0;
      case 2:
        return 2;
      default:
        return -1;
    }
  };

  return (
    <ul
      className="w-52 rounded bg-white"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      {menuItems.map((item, index) => {
        return item.type == "menu" ? (
          <li
            key={`item-menu-${index}`}
            className={`flex justify-between items-center px-2 py-3 cursor-pointer ${
              getIndexFromStatus(status) === index ? "bg-secondary-100" : ""
            }`}
            onClick={() => clickHandler(index)}
          >
            <div className="flex justify-start gap-2">
              <Image
                src={`/admin/images/icon/${item.icon}`}
                width={16}
                height={16}
                alt="icon"
              />
              <span
                className={`text-${item.color} text-[17px] leading-4 font-normal`}
              >
                {item.text}
              </span>
            </div>

            {getIndexFromStatus(status) === index && (
              <div className="flex justify-end">
                <Image
                  src={`/admin/images/icon/check.svg`}
                  width={16}
                  height={16}
                  alt="icon"
                />
              </div>
            )}
          </li>
        ) : (
          <div
            key={`item-menu-${index}`}
            className={`w-full h-0 border-0 border-t-[0.5px] border-${item.color}`}
          ></div>
        );
      })}
    </ul>
  );
};

export default ShowcaseEditMenu;
