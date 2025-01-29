import { getMessages } from "admin/messages/messages";
import {
  hasPasswordAccount,
  VERIFIED_EMAIL_PATH,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import useUpdateEmail from "hooks/useUpdateEmail";
import useUpdatePassword from "hooks/useUpdatePassword";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";
import NewEmail from "ui/templates/admin/NewEmail";
import ReauthPassword from "ui/templates/admin/ReauthPassword";
import ReauthSns from "ui/templates/admin/ReauthSns";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const AuthStates = {
  Reauth: 0,
  NewEmail: 1,
  NewPassword: 2,
  Sent: 3,
} as const;
type AuthStates = (typeof AuthStates)[keyof typeof AuthStates];

const EmailUpdate = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Reauth);
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const [newEmail, setNewEmail] = useState("");
  const [updateEmail, updatingEmail, isEmailSuccessful, emailUpdateError] =
    useUpdateEmail();
  const [
    updatePassword,
    updatingPassword,
    isPasswordSuccessful,
    passwordUpdateError,
  ] = useUpdatePassword();
  const t = useTranslations();

  useEffect(() => {
    if (isPasswordSuccessful) {
      updateEmail(newEmail, VERIFIED_EMAIL_PATH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPasswordSuccessful]);

  useEffect(() => {
    if (isEmailSuccessful) {
      setAuthState(AuthStates.Sent);
    }
  }, [isEmailSuccessful]);

  useEffect(() => {
    if (emailUpdateError) {
      setAuthError(emailUpdateError);
    } else if (passwordUpdateError) {
      setAuthError(passwordUpdateError);
    }
  }, [emailUpdateError, passwordUpdateError]);

  const handleClickBack = () => {
    router.push("/account");
  };

  const handleclickSubmit = async (email: string, password: string) => {
    updatePassword(password);
  };

  const handleNewEmail = (email: string) => {
    setNewEmail(email);
    if (hasPasswordAccount()) {
      updateEmail(email, VERIFIED_EMAIL_PATH);
    } else {
      setAuthState(AuthStates.NewPassword);
    }
  };

  switch (authState) {
    case AuthStates.Reauth:
      return hasPasswordAccount() ? (
        <ReauthPassword
          onClickBack={handleClickBack}
          onClickNext={() => setAuthState(AuthStates.NewEmail)}
        />
      ) : (
        <ReauthSns
          onClickBack={handleClickBack}
          onClickNext={() => setAuthState(AuthStates.NewEmail)}
        />
      );
    case AuthStates.NewEmail:
      return (
        <NewEmail
          isProcessing={updatingEmail || isEmailSuccessful}
          authError={authError}
          onClickBack={handleClickBack}
          onClickNext={handleNewEmail}
        />
      );
    case AuthStates.NewPassword:
      return (
        <FlowAgreementWithEmailAndPassword
          title={t("AccountPassword.Title")}
          buttonText={t("Label.Next")}
          email={auth.currentUser.email}
          isSubmitting={
            updatingPassword ||
            updatingEmail ||
            isPasswordSuccessful ||
            isEmailSuccessful
          }
          pageType={PageType.PasswordUpdate}
          authError={authError}
          onClickBack={handleClickBack}
          onClickSubmit={handleclickSubmit}
        />
      );
    case AuthStates.Sent:
      return <EmailUpdated onClick={handleClickBack} />;
  }
};

const EmailUpdated = ({ onClick }: { onClick: () => void }) => {
  return <ConfirmationSent onClickBack={onClick} />;
};

export default EmailUpdate;
