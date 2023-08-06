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
  // メニュー開閉以外でのバーガーボタン表示/非表示の制御用
  showBurger: boolean;
  // メニュー開閉状態の保存
  isMenuOpen: boolean;
  setShowBurger: Dispatch<SetStateAction<boolean>>;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const showBurgerContextValue = useMemo(
    () => ({ showBurger, isMenuOpen, setShowBurger, setIsMenuOpen }),
    [showBurger, isMenuOpen, setShowBurger, setIsMenuOpen]
  );

  return (
    <ShowBurgerContext.Provider value={showBurgerContextValue}>
      {children}
    </ShowBurgerContext.Provider>
  );
};

export const useShowBurger = () => useContext(ShowBurgerContext);
