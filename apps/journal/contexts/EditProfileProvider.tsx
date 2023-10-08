import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { Area } from "react-easy-crop";

type Props = {
  children: ReactNode;
};

type ContextType = {
  isCropModalOpen: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
  iconForCrop: {
    current: string;
    set: Dispatch<SetStateAction<string>>;
  };
  cropData: {
    current: Area | null;
    set: Dispatch<SetStateAction<Area | null>>;
  };
};

const EditProfileContext = createContext<ContextType>({} as ContextType);

/**
 * プロフィール編集のデータを管理するコンテキストプロバイダー
 * 画像のクロップに関するデータを管理する
 * @param param0
 * @returns
 */
export const EditProfileProvider: React.FC<Props> = ({ children }) => {
  const [isCropModalOpen, setIsCropWindowOpen] = useState<boolean>(false);

  const [iconForCrop, setIconForCrop] = useState<string>("");
  const [cropData, setCropData] = useState<Area>(null);

  const contextValue = useMemo<ContextType>(
    () => ({
      isCropModalOpen: {
        current: isCropModalOpen,
        set: setIsCropWindowOpen,
      },
      iconForCrop: {
        current: iconForCrop,
        set: setIconForCrop,
      },
      cropData: {
        current: cropData,
        set: setCropData,
      },
    }),
    [
      isCropModalOpen,
      setIsCropWindowOpen,
      iconForCrop,
      setIconForCrop,
      cropData,
      setCropData,
    ]
  );

  return (
    <EditProfileContext.Provider value={contextValue}>
      {children}
    </EditProfileContext.Provider>
  );
};

export const useEditProfile = () => useContext(EditProfileContext);
