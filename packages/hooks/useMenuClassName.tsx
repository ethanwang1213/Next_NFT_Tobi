import { useState } from "react";

const useMenuClassName = (minWidth: number, maxWidth: number) => {
  const [menuClassName, setMenuClassName] = useState<string>("");
  const [menuItemClassName, setMenuItemClassName] = useState<string>("hidden");

  const setMenuWidth = (classList: DOMTokenList) => {
    if (classList.contains(`w-[${minWidth}px]`)) {
      setMenuClassName(`w-[${maxWidth}px]`);
      setMenuItemClassName("inline");
    } else {
      setMenuClassName(`w-[${minWidth}px]`);
      setMenuItemClassName("hidden");
    }
  };

  return [menuClassName, menuItemClassName, setMenuWidth] as const;
};

export default useMenuClassName;
