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
  <div
    className={`flex-1 tab tab-lg tab-lifted ${
      isActive ? "tab-active bg-opacity-50 backdrop-blur-[25px]" : ""
    }`}
    onClick={onClick}
    style={{
      backgroundColor: "rgb(75 85 99 / var(--tw-bg-opacity))",
      border: "none",
    }}
  >
    {children}
  </div>
);
