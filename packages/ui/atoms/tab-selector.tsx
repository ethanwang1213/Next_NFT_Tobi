import * as React from "react";

export const TabSelector = ({
  isFirst,
  isActive,
  children,
  onClick,
}: {
  isFirst: boolean,
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`mr-10 group inline-flex items-center px-2 py-3 border-b-4 font-semibold text-lg/[48px] leading-5 cursor-pointer whitespace-nowrap ${
      isActive
        ? "border-[#1779DE] text-[#1779DE] focus:outline-none focus:text-[#1779DE] focus:border-[#1779DE]"
        : "border-transparent text-[#717171] hover:text-[#1779DE] hover:border-[#1779DE] focus:text-[#717171] focus:border-[#717171]"
    } ${
      isFirst
      ? "ml-12"
      : ""
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);