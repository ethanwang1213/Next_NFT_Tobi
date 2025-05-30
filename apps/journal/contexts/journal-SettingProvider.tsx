import { useBookContext } from "@/contexts/journal-BookProvider";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import { useAddingRedeemEmail } from "journal-pkg/hooks/useAddingRedeemEmail";
import { useRedeemEmails } from "journal-pkg/hooks/useRedeemEmails";
import { useRemovingRedeemEmail } from "journal-pkg/hooks/useRemovingRedeemEmail";
import { useRouter } from "next/router";
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
  const { pageNo, bookIndex } = useBookContext();
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
  const { user, redeemLinkCode, removeRedeemLinkCode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    // Do not execute if the login is anonymous or if there is no link code.
    if (!user?.email || !redeemLinkCode) return;

    const validateRedeemLinkCode = async () => {
      const callable = httpsCallable<{ linkCode: String }, boolean>(
        functions,
        "journalNfts-validateRedeemEmailLink",
      );
      try {
        await callable({ linkCode: redeemLinkCode });
        // An error should occur if this is called twice
        openRedeemEmailAddedModal();
        pageNo.set(bookIndex.settingPage.start);
      } catch (error) {
        // If it is called twice and an error occurs, it will be ignored.
        if (!ignore) {
          console.log(error);
          if (
            error.code === "functions/not-found" ||
            error.code === "functions/already-exists" ||
            error.code === "functions/out-of-range"
          ) {
            alert("無効なリンクです");
          } else {
            alert("エラーが発生しました");
          }
        }
      }
      removeRedeemLinkCode();
      removeRedeemLinkCodeFromURL();
    };

    validateRedeemLinkCode();

    // Prevents the asynchronous process from being executed twice while it is already running.
    // https://react.dev/learn/synchronizing-with-effects#fetching-data
    return () => {
      ignore = true;
    };
  }, [user, redeemLinkCode]);

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

  /*
   * When accessing a URL with redeemLinkCode while logged in,
   * the URL will remain with the redeemLinkCode attached,
   * so we remove the redeemLinkCode.
   */
  const removeRedeemLinkCodeFromURL = () => {
    const { pathname, query } = router;
    const { redeemLinkCode, ...newQuery } = query;

    if (!redeemLinkCode) return;

    const newUrl = {
      pathname,
      query: newQuery,
    };
    router.replace(newUrl, undefined, { shallow: true });
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
