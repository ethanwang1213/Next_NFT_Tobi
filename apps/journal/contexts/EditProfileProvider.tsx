import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  isCropWindowOpen: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
};

const EditProfileContext = createContext<ContextType>({} as ContextType);

/**
 * redeemページのデータを管理するコンテキスト
 * @param param0
 * @returns
 */
export const EditProfileProvider: React.FC<Props> = ({ children }) => {
  const [isCropWindowOpen, setIsCropWindowOpen] = useState<boolean>(false);

  const contextValue = useMemo<ContextType>(
    () => ({
      isCropWindowOpen: {
        current: isCropWindowOpen,
        set: setIsCropWindowOpen,
      },
    }),
    [isCropWindowOpen, setIsCropWindowOpen]
  );

  return (
    <EditProfileContext.Provider value={contextValue}>
      {children}
    </EditProfileContext.Provider>
  );
};

export const useEditProfile = () => useContext(EditProfileContext);
