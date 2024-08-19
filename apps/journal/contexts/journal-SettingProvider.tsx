import { useAddingRedeemEmail } from "journal-pkg/hooks/useAddingRedeemEmail";
import { useRedeemEmails } from "journal-pkg/hooks/useRedeemEmails";
import { useRemovingRedeemEmail } from "journal-pkg/hooks/useRemovingRedeemEmail";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  addingRedeemEmail: boolean;
  isOpenConfirmEmailRemovalModal: boolean;
  isOpenEmailSentModal: boolean;
  isOpenRedeemEmailAddedModal: boolean;
  loadingRedeemEmails: boolean;
  redeemEmails: Record<string, boolean>;
  removingRedeemEmail: boolean;
  addRedeemEmail: (email: string) => Promise<boolean>;
  closeConfirmEmailRemovalModal: () => void;
  closeEmailSentModal: () => void;
  closeRedeemEmailAddedModal: () => void;
  loadRedeemEmails: () => void;
  openConfirmEmailRemovalModal: (email: string) => void;
  openRedeemEmailAddedModal: () => void;
  removeRedeemEmail: () => void;
};

const SettingContext = createContext<ContextType>({} as ContextType);

/**
 * A provider that manages the data for the settings.
 * @param param0
 * @returns
 */
export const SettingProvider: React.FC<Props> = ({ children }) => {
  const [addEmail, addingRedeemEmail, addingRedeemEmailError] =
    useAddingRedeemEmail();
  const [
    loadRedeemEmails,
    redeemEmails,
    loadingRedeemEmails,
    loadingRedeemEmailsError,
  ] = useRedeemEmails();
  const [removeEmail, removingRedeemEmail, removingRedeemEmailError] =
    useRemovingRedeemEmail();
  const [isOpenConfirmEmailRemovalModal, setIsOpenConfirmEmailRemovalModal] =
    useState<boolean>(false);
  const [isOpenEmailSentModal, setIsOpenEmailSentModal] =
    useState<boolean>(false);
  const [isOpenRedeemEmailAddedModal, setIsOpenRedeemEmailAddedModal] =
    useState<boolean>(false);
  const [redeemEmail, setRedeemEmail] = useState<string | null>(null);

  useEffect(() => {
    if (addingRedeemEmailError) {
      alert("Failed to add the email.");
      console.log(addingRedeemEmailError);
    }
  }, [addingRedeemEmailError]);

  useEffect(() => {
    if (loadingRedeemEmailsError) {
      alert("Failed to load the emails.");
      console.log(loadingRedeemEmailsError);
    }
  }, [loadingRedeemEmailsError]);

  useEffect(() => {
    if (removingRedeemEmailError) {
      alert("Failed to remove the email.");
      console.log(removingRedeemEmailError);
    }
  }, [removingRedeemEmailError]);

  const addRedeemEmail = async (email: string) => {
    const status = await addEmail(email);
    if (!status) {
      return false;
    }
    setIsOpenEmailSentModal(true);
    loadRedeemEmails();
    return true;
  };

  const closeConfirmEmailRemovalModal = () => {
    setIsOpenConfirmEmailRemovalModal(false);
  };

  const closeEmailSentModal = () => {
    setIsOpenEmailSentModal(false);
  };

  const closeRedeemEmailAddedModal = () => {
    setIsOpenRedeemEmailAddedModal(false);
  };

  const openConfirmEmailRemovalModal = (email: string) => {
    setRedeemEmail(email);
    setIsOpenConfirmEmailRemovalModal(true);
  };

  const openRedeemEmailAddedModal = () => {
    setIsOpenRedeemEmailAddedModal(true);
  };

  const removeRedeemEmail = async () => {
    if (!redeemEmail) return;

    await removeEmail(redeemEmail);
    setRedeemEmail(null);
    closeConfirmEmailRemovalModal();
    loadRedeemEmails();
  };

  return (
    <SettingContext.Provider
      value={{
        addingRedeemEmail,
        isOpenConfirmEmailRemovalModal,
        isOpenEmailSentModal,
        isOpenRedeemEmailAddedModal,
        loadingRedeemEmails,
        removingRedeemEmail,
        redeemEmails,
        addRedeemEmail,
        closeConfirmEmailRemovalModal,
        closeEmailSentModal,
        closeRedeemEmailAddedModal,
        loadRedeemEmails,
        openConfirmEmailRemovalModal,
        openRedeemEmailAddedModal,
        removeRedeemEmail,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSettingContext = () => useContext(SettingContext);
