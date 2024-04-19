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
        ? "mt-1 border-primary text-primary focus:outline-none focus:text-primary focus:border-primary"
        : "border-transparent text-secondary hover:text-primary hover:border-primary focus:text-secondary focus:border-secondary"
    } ${isFirst ? "ml-12" : ""}`}
    onClick={onClick}
  >
    {children}
    {isActive ? (
      <div className="relative top-0.5 -left-3 -mr-6 h-0 border-2 border-primary rounded" />
    ) : (
      <></>
    )}
  </button>
);
