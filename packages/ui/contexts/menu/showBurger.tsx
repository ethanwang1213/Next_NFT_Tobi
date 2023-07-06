import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

type showBurgerContextType = {
  showBurger: boolean;
  setShowBurger: Dispatch<SetStateAction<boolean>>;
};

// バーガーメニュー表示/非表示 設定用のContext
const ShowBurgerContext = createContext<showBurgerContextType>(
  {} as showBurgerContextType
);

type Props = {
  children: ReactNode;
};

/**
 * バーガーメニュー表示/非表示 設定用のContext Provider
 * @param param0
 * @returns
 */
export const ShowBurgerProvider: React.FC<Props> = ({ children }) => {
  const [showBurger, setShowBurger] = useState<boolean>(true);

  const showBurgerContextValue = useMemo(
    () => ({ showBurger, setShowBurger }),
    [showBurger, setShowBurger]
  );

  return (
    <ShowBurgerContext.Provider value={showBurgerContextValue}>
      {children}
    </ShowBurgerContext.Provider>
  );
};

export const useShowBurger = () => useContext(ShowBurgerContext);
