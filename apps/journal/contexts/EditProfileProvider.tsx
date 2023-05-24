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
  isEditModalOpen: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
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
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCropWindowOpen, setIsCropWindowOpen] = useState<boolean>(false);

  const contextValue = useMemo<ContextType>(
    () => ({
      isEditModalOpen: {
        current: isEditModalOpen,
        set: setIsEditModalOpen,
      },
      isCropWindowOpen: {
        current: isCropWindowOpen,
        set: setIsCropWindowOpen,
      },
    }),
    [isEditModalOpen, setIsEditModalOpen, isCropWindowOpen, setIsCropWindowOpen]
  );

  return (
    <EditProfileContext.Provider value={contextValue}>
      {children}
    </EditProfileContext.Provider>
  );
};

export const useEditProfile = () => useContext(EditProfileContext);
