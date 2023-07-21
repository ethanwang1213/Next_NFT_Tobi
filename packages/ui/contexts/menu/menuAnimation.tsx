import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type MenuAnimationContextType = {
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
  imageRef: React.RefObject<HTMLDivElement>;
  // 目的地ページが開いたときにフェードアウトさせるための要求フラグ
  requireFadeOut: string;
  setRequireFadeOut: Dispatch<SetStateAction<string>>;
};

// メニューからの画面遷移時の画像設定用のContext
const MenuAnimationContext = createContext<MenuAnimationContextType>(
  {} as MenuAnimationContextType
);

type Props = {
  children: ReactNode;
};

// メニューからの画面遷移時の画像設定用のContext Provider
export const MenuAnimationProvider: React.FC<Props> = ({ children }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [requireFadeOut, setRequireFadeOut] = useState<string>("");

  const menuAnimationContextValue = useMemo(
    () => ({
      imageUrl,
      setImageUrl,
      imageRef,
      requireFadeOut,
      setRequireFadeOut,
    }),
    [imageUrl, setImageUrl, imageRef, requireFadeOut, setRequireFadeOut]
  );

  return (
    <MenuAnimationContext.Provider value={menuAnimationContextValue}>
      {children}
    </MenuAnimationContext.Provider>
  );
};

export const useMenuAnimation = () => useContext(MenuAnimationContext);
