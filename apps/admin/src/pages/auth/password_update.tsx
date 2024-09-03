import { auth } from "fetchers/firebase/client";
import { updatePassword } from "firebase/auth";
import useReauthenticate from "hooks/useReauthenticate";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import BackLink from "ui/organisms/admin/BackLink";
import FlowAgreementWithEmailAndPassword from "ui/templates/admin/FlowAgreementWithEmailAndPassword";

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

  const back = () => {
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
    return <PasswordUpdated onClick={back} />;
  } else {
    switch (authState) {
      case AuthStates.Reauth:
        return (
          <Reauth
            error={authError}
            onClickBack={back}
            onClickNext={() => setAuthState(AuthStates.NewPassword)}
            setError={setAuthError}
          />
        );
      case AuthStates.NewPassword:
        return (
          <FlowAgreementWithEmailAndPassword
            title={"パスワードリセット"}
            buttonText={"リセット"}
            email={""}
            isSubmitting={updatingPassword}
            isPasswordReset={true}
            authError={authError}
            onClickSubmit={resetPassword}
          />
        );
    }
  }
};

const Reauth = ({
  error,
  onClickBack,
  onClickNext,
  setError,
}: {
  error?: ErrorMessage;
  onClickBack: () => void;
  onClickNext: () => void;
  setError: Dispatch<SetStateAction<ErrorMessage>>;
}) => {
  const [password, setPassword] = useState<string | null>("");
  const [reauthenticate, reauthenticating, userCredential, reauthError] =
    useReauthenticate();

  useEffect(() => {
    setError(reauthError);
  }, [reauthError]);

  useEffect(() => {
    if (!userCredential) {
      return;
    }

    onClickNext();
  }, [userCredential]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full">
        <BackLink onClickBack={onClickBack} />
      </div>
      <div className="text-base-black text-lg font-semibold">
        パスワードを入力
      </div>
      <div className="w-[408px] mt-[80px]">
        <div
          className={"w-[412px] mt-[10px] font-medium text-[16px] text-left"}
        >
          Name
        </div>
        <input
          type={"text"}
          value={auth.currentUser.email}
          disabled={true}
          className="rounded-lg bg-disabled-field base-200-content font-normal w-[408px] h-[52px] mt-[10px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
        />
        <div
          className={"w-[412px] mt-[10px] font-medium text-[16px] text-left"}
        >
          Password
        </div>
        <input
          type={"password"}
          value={password}
          placeholder={"Password"}
          className="rounded-lg base-content font-normal w-[408px] h-[52px] mt-[10px] pl-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <FirebaseAuthError error={error} />
      </div>
      <div className="flex justify-end gap-4 mt-[20px]">
        {reauthenticating ? (
          <Loading className="w-6 h-6" />
        ) : (
          <Button
            className="btn btn-block px-4 py-2 bg-primary rounded-[64px]
              text-base-white text-sm leading-4 font-semibold hover:bg-primary hover:border-primary"
            onClick={() => reauthenticate(password)}
          >
            次へ
          </Button>
        )}
      </div>
    </div>
  );
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
