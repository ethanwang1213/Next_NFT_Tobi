import { useState } from "react";

const useMenuClassName = (
  minWidth: number,
  maxWidth: number,
  breakPoint: number,
) => {
  const [menuClassName, setMenuClassName] = useState<string>("");
  const [menuItemClassName, setMenuItemClassName] = useState<string>("hidden");

  const toggleMenuWidth = (classList: DOMTokenList) => {
    if (classList.contains(`w-[${minWidth}px]`)) {
      setMenuClassName(`w-[${maxWidth}px]`);
      setMenuItemClassName("inline");
    } else {
      setMenuClassName(`w-[${minWidth}px]`);
      setMenuItemClassName("hidden");
    }
  };
  const setMenuWidth = (classList?: DOMTokenList) => {
    if (classList) {
      toggleMenuWidth(classList);
    } else {
      setMenuWidthByWindowWidth();
    }
  };

  const setMenuWidthByWindowWidth = () => {
    if (window.innerWidth < breakPoint) {
      setMenuClassName(`w-[${minWidth}px]`);
      setMenuItemClassName("hidden");
    } else {
      setMenuClassName(`w-[${maxWidth}px]`);
      setMenuItemClassName("inline");
    }
  };

  return [menuClassName, menuItemClassName, setMenuWidth] as const;
};

export default useMenuClassName;
