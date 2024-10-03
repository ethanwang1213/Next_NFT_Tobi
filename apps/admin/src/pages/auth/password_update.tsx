import { hasPasswordAccount } from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { updatePassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";
import ReauthPassword from "ui/templates/admin/ReauthPassword";
import ReauthSns from "ui/templates/admin/ReauthSns";

const AuthStates = {
  Reauth: 0,
  NewPassword: 1,
  ResetPassword: 2,
} as const;
type AuthStates = (typeof AuthStates)[keyof typeof AuthStates];

const PasswordUpdate = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Reauth);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);

  const handleClickBack = () => {
    router.push("/account");
  };

  const resetPassword = async (email: string, password: string) => {
    setUpdatingPassword(true);
    setAuthError(null);
    try {
      await updatePassword(auth.currentUser, password);
      setUpdatedPassword(true);
    } catch (error) {
      console.error(error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingPassword(false);
    }
  };

  if (updatedPassword) {
    return <PasswordUpdated onClick={handleClickBack} />;
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
            email={""}
            isSubmitting={updatingPassword}
            pageType={PageType.PasswordUpdate}
            authError={authError}
            onClickBack={handleClickBack}
            onClickSubmit={resetPassword}
          />
        );
    }
  }
};

const PasswordUpdated = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Image
        src="/admin/images/icon/task-complete.svg"
        alt="Tobiratory logo"
        width={317}
        height={317}
        className="mt-[200px]"
      />
      <div className="mt-[40px]">Password has been reset!</div>
      <div>
        <Button
          type="button"
          className="w-[179px] h-[48px] rounded-2xl bg-primary font-normal text-[20px] text-primary-content mt-[20px]"
          onClick={onClick}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default PasswordUpdate;
