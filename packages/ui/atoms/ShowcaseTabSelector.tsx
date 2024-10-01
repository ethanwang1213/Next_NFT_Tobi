import * as React from "react";

export const ShowcaseTabSelector = ({
  isActive,
  children,
  onClick,
  title,
  activeTitle,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  activeTitle: string;
}) => {
  const effectiveActiveTitle = activeTitle || "Sample Items";

  const getBoxShadowStyle = () => {
    if (effectiveActiveTitle === "Sample Items" && title === "Inventory") {
      return { boxShadow: "2px 2px 4px 0px", zIndex: 30 };
    }
    if (effectiveActiveTitle === "Settings" && title === "Inventory") {
      return { boxShadow: "-2px 2px 4px 0px", zIndex: 30 };
    }
    if (effectiveActiveTitle === "Inventory" && title === "Inventory") {
      return { boxShadow: "0px 5px 10px 2px #00000087" };
    }
    return {};
  };

  return (
    <div
      className={`flex-1 tab flex justify-center border-none rounded-t-[24px] ${
        isActive
          ? "active bg-[#828282] backdrop-blur-[25px] h-[56px] rounded-tr-[24px] rounded-tl-[24px] z-20"
          : "h-[56px] bg-[#B3B3B3]"
      }`}
      onClick={onClick}
      style={getBoxShadowStyle()}
    >
      {children}
    </div>
  );
};
