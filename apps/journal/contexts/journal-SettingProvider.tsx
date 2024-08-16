import { httpsCallable } from "firebase/functions";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type ContextType = {
  isOpenConfirmEmailRemovalModal: boolean;
  isOpenEmailSentModal: boolean;
  isOpenRedeemEmailAddedModal: boolean;
  redeemEmails: Record<string, boolean>;
  closeEmailSentModal: () => void;
  closeConfirmEmailRemovalModal: () => void;
  closeRedeemEmailAddedModal: () => void;
  loadRedeemEmails: () => void;
  openConfirmEmailRemovalModal: (email: string) => void;
  openEmailSentModal: (email: string) => void;
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
  const [isOpenConfirmEmailRemovalModal, setIsOpenConfirmEmailRemovalModal] =
    useState<boolean>(false);
  const [isOpenEmailSentModal, setIsOpenEmailSentModal] =
    useState<boolean>(false);
  const [isOpenRedeemEmailAddedModal, setIsOpenRedeemEmailAddedModal] =
    useState<boolean>(false);
  const [redeemEmail, setRedeemEmail] = useState<string | null>(null);
  const [redeemEmails, setRedeemEmails] = useState<Record<string, boolean>>({});

  const addRedeemEmail = async (email: string) => {
    const callable = httpsCallable(
      functions,
      "journalNfts-sendConfirmationRedeemEmail",
    );
    try {
      await callable({ email });
    } catch (error) {
      console.log(error);
    }
    await loadRedeemEmails();
  };

  const loadRedeemEmails = async () => {
    const callable = httpsCallable<
      { email: string },
      Record<string, boolean> | null
    >(functions, "journalNfts-getRedeemEmails");
    const emails = await callable()
      .then((result) => {
        setRedeemEmails(result.data ?? {});
        console.log("redeemEmails: ", result.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
    console.log("open with: ", email);
    setRedeemEmail(email);
    setIsOpenConfirmEmailRemovalModal(true);
  };

  const openEmailSentModal = (email: string) => {
    addRedeemEmail(email);
    setIsOpenEmailSentModal(true);
  };

  const openRedeemEmailAddedModal = () => {
    setIsOpenRedeemEmailAddedModal(true);
  };

  const removeRedeemEmail = async () => {
    console.log("redeem email: ", redeemEmail);
    if (!redeemEmail) return;

    const callable = httpsCallable(functions, "journalNfts-removeRedeemEmail");
    try {
      await callable({ email: redeemEmail });
    } catch (error) {
      console.log(error);
    }
    setRedeemEmail(null);
    closeConfirmEmailRemovalModal();
    await loadRedeemEmails();
  };

  return (
    <SettingContext.Provider
      value={{
        isOpenConfirmEmailRemovalModal,
        isOpenEmailSentModal,
        isOpenRedeemEmailAddedModal,
        redeemEmails,
        closeConfirmEmailRemovalModal,
        closeEmailSentModal,
        closeRedeemEmailAddedModal,
        loadRedeemEmails,
        openConfirmEmailRemovalModal,
        openEmailSentModal,
        openRedeemEmailAddedModal,
        removeRedeemEmail,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSettingContext = () => useContext(SettingContext);
