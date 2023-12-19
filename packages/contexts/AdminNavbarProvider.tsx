import React, { ReactNode, createContext, useContext, useRef } from "react";
import { useToggle } from "react-use";

type Props = {
  children: ReactNode;
};

type ContextType = {
  clickedMenu: boolean; // A flag to prevent useEffect from running on the initial rendering."
  menuStatus: boolean;
  onClickMenu?: () => void;
};

const NavbarContext = createContext<ContextType>({} as ContextType);

export const NavbarProvider: React.FC<Props> = ({ children }) => {
  const clicked = useRef<boolean>(false);
  const [menuStatus, setMenuStatus] = useToggle(false);
  const handleClickMenu = () => {
    clicked.current = true;
    setMenuStatus();
  };

  return (
    <NavbarContext.Provider
      value={{
        clickedMenu: clicked.current,
        menuStatus,
        onClickMenu: handleClickMenu,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
