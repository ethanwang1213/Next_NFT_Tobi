import * as React from "react";

export const TabSelector = ({
  isFirst,
  isActive,
  children,
  onClick,
}: {
  isFirst: boolean;
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
    <button
      className={`relative mr-8 px-3 border-b-1 font-semibold text-lg/[48px] cursor-pointer whitespace-nowrap uppercase ${
        isActive
          ? "mt-1 border-[#1779DE] text-[#1779DE] focus:outline-none focus:text-[#1779DE] focus:border-[#1779DE]"
          : "border-transparent text-[#717171] hover:text-[#1779DE] hover:border-[#1779DE] focus:text-[#717171] focus:border-[#717171]"
      } ${isFirst ? "ml-12" : ""}`}
      onClick={onClick}
    >
      {children}
      {isActive ? <div className="relative top-0.5 -left-3 -mr-6 h-0 border-2 border-[#1779DE] rounded" /> : <></>}
    </button>
);
