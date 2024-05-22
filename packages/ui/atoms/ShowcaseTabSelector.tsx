import * as React from "react";

export const ShowcaseTabSelector = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`flex-1 flex items-center justify-center cursor-pointer bg-opacity-50 mr-[1px] mb-[1px] ${
      isActive ? "bg-gray-800" : "bg-[#B3B3B3]"
    }`}
    style={{
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);
