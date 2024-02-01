import React, { createContext, ReactNode, useContext, useRef } from "react";
import { useToggle } from "react-use";

type Props = {
  children: ReactNode;
};

type ContextType = {
  clickedBefore: boolean; // A flag to prevent useEffect from running on the initial rendering."
  menuStatus: boolean;
  onClickMenu?: () => void;
};

const NavbarContext = createContext<ContextType>({} as ContextType);

export const NavbarProvider: React.FC<Props> = ({ children }) => {
  const clickedBefore = useRef<boolean>(false);
  const [menuStatus, setMenuStatus] = useToggle(false);
  const handleClickMenu = () => {
    clickedBefore.current = true;
    setMenuStatus();
  };

  return (
    <NavbarContext.Provider
      value={{
        clickedBefore: clickedBefore.current,
        menuStatus,
        onClickMenu: handleClickMenu,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
