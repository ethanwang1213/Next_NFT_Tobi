import { FC, useState } from "react";

type CollapseProps = {
  title: string;
  children: React.ReactNode;
};

const Collapse: FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-[#CCCBCB]">
      <div
        className="flex justify-between items-center py-4 cursor-pointer uppercase"
        onClick={toggleCollapse}
      >
        <h3 className="text-base font-medium">{title}</h3>
        <span
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
};

export default Collapse;
