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
}: {
  clickHandler: (index: number) => void;
}) => {
  return (
    <ul
      className="w-24 rounded bg-white"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      {menuItems.map((item, index) => {
        return item.type == "menu" ? (
          <li
            key={`item-menu-${index}`}
            className="h-4 flex items-center px-2 gap-2 cursor-pointer hover:bg-secondary-100"
            onClick={() => clickHandler(index)}
          >
            <Image
              src={`/admin/images/icon/${item.icon}`}
              width={8}
              height={8}
              alt="icon"
            />
            <span
              className={`text-${item.color} text-[8px] leading-4 font-normal`}
            >
              {item.text}
            </span>
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
