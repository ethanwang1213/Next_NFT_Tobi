import {
  hasPasswordAccount,
  VERIFIED_EMAIL_PATH,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import useUpdateEmail from "hooks/useUpdateEmail";
import useUpdatePassword from "hooks/useUpdatePassword";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";
import ReauthPassword from "ui/templates/admin/ReauthPassword";
import ReauthSns from "ui/templates/admin/ReauthSns";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

const AuthStates = {
  Reauth: 0,
  NewPassword: 1,
  ResetPassword: 2,
} as const;
type AuthStates = (typeof AuthStates)[keyof typeof AuthStates];

const PasswordUpdate = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Reauth);
  const [updatingEmailAndPassword, setUpdatingEmailAndPassword] =
    useState(false);
  const [updatedEmailAndPassword, setUpdatedEmailAndPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const [updateEmail, , isEmailUpdateSuccessful, emailUpdateError] =
    useUpdateEmail();
  const [updatePassword, , , passwordUpdateError] = useUpdatePassword();

  useEffect(() => {
    if (passwordUpdateError) {
      setAuthError(passwordUpdateError);
      setUpdatingEmailAndPassword(false);
    }
  }, [passwordUpdateError]);

  useEffect(() => {
    if (emailUpdateError) {
      setAuthError(emailUpdateError);
      setUpdatingEmailAndPassword(false);
    }
  }, [emailUpdateError]);

  const handleClickBack = () => {
    router.push("/account");
  };

  const resetEmailAndPassword = async (email: string, password: string) => {
    setUpdatingEmailAndPassword(true);
    setAuthError(null);
    try {
      let result = await updatePassword(password);
      if (auth.currentUser.email !== email && result) {
        result = await updateEmail(email, VERIFIED_EMAIL_PATH);
      }
      if (result) {
        setUpdatedEmailAndPassword(true);
      }
    } catch (error) {
      console.error(error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingEmailAndPassword(false);
    }
  };

  if (updatedEmailAndPassword) {
    return isEmailUpdateSuccessful ? (
      <EmailUpdated onClick={handleClickBack} />
    ) : (
      <PasswordUpdated onClick={handleClickBack} />
    );
  } else {
    switch (authState) {
      case AuthStates.Reauth:
        return hasPasswordAccount() ? (
          <ReauthPassword
            onClickBack={handleClickBack}
            onClickNext={() => setAuthState(AuthStates.NewPassword)}
          />
        ) : (
          <ReauthSns
            onClickBack={handleClickBack}
            onClickNext={() => setAuthState(AuthStates.NewPassword)}
          />
        );
      case AuthStates.NewPassword:
        return (
          <FlowAgreementWithEmailAndPassword
            title={"パスワードリセット"}
            buttonText={"リセット"}
            email={auth.currentUser.email}
            isSubmitting={updatingEmailAndPassword}
            pageType={PageType.PasswordUpdate}
            authError={authError}
            onClickBack={handleClickBack}
            onClickSubmit={resetEmailAndPassword}
          />
        );
    }
  }
};

const PasswordUpdated = ({ onClick }: { onClick: () => void }) => {
  const t = useTranslations("LogInSignUp");
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Image
        src="/admin/images/icon/task-complete.svg"
        alt="Tobiratory logo"
        width={317}
        height={317}
        className="mt-[200px]"
      />
      <div className="mt-[40px]">{t("PasswordResetNotify")}</div>
      <div>
        <Button
          type="button"
          className="w-[179px] h-[48px] rounded-2xl bg-primary font-normal text-[20px] text-primary-content mt-[20px]"
          onClick={onClick}
        >
          {t("Done")}
        </Button>
      </div>
    </div>
  );
};

const EmailUpdated = ({ onClick }: { onClick: () => void }) => {
  return <ConfirmationSent onClickBack={onClick} />;
};

export default PasswordUpdate;
