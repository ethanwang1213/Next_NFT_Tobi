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
  title : String;
  activeTitle : String
}) => (
  <div
    className={`flex-1 tab flex justify-center border-none rounded-t-[24px]  ${
      isActive ? "active bg-[#828282] backdrop-blur-[25px] h-[56px] rounded-tr-[24px] rounded-tl-[24px] z-20" : "h-[56px] bg-[#B3B3B3]" 
    }`}
    onClick={onClick}
    style={
      activeTitle === "Sample Items" && title === "Inventory" ? {
        boxShadow: "2px 2px 4px 0px",
        zIndex: 30
      } : activeTitle === "Settings" && title === "Inventory" ?{
        boxShadow: "-2px 2px 4px 0px",
        zIndex: 30
      } : activeTitle === "Inventory" && title === "Inventory" ?
      {
        boxShadow: "0px 5px 10px 2px #00000087",
      } :{}
    }
  >
  {children}
  </div>
);
