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
    className={`text-sm flex-1 flex items-center justify-center cursor-pointer ${
      isActive
        ? "bg-gray-600 bg-opacity-50 backdrop-blur-[25px]"
        : "bg-[#FAFAFA]/50 backdrop-blur-[25px]"
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
