import { auth } from "fetchers/firebase/client";
import useReauthenticate from "hooks/useReauthenticate";
import useUpdateEmail from "hooks/useUpdateEmail";
import Image from "next/image";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useState } from "react";
import { useToggle } from "react-use";
import { EMAIL_REGEX } from "types/adminTypes";
import Button from "ui/atoms/Button";
import ColorizedSvg from "ui/atoms/ColorizedSvg";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import GhostButton from "ui/atoms/GhostButton";
import Loading from "ui/atoms/Loading";

const AuthStates = {
  Reauth: 0,
  NewEmail: 1,
} as const;
type AuthStates = (typeof AuthStates)[keyof typeof AuthStates];

const EmailEditDialog = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const [authState, setAuthState] = useState<AuthStates>(AuthStates.Reauth);
  const router = useRouter();

  const onClickNextFromNewEmail = () => {
    setAuthState(AuthStates.Reauth);
    dialogRef.current.close();
    router.push("/auth/confirmation_email");
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[400px] rounded-3xl pt-4 flex flex-col gap-3 relative">
        <form method="dialog">
          <GhostButton
            className=" absolute w-4 h-4 min-h-4 top-4 right-4 over:bg-none hover:bg-opacity-0 border-0 p-0"
            onClick={() => setAuthState(AuthStates.Reauth)}
          >
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </GhostButton>
        </form>
        <Auth
          authState={authState}
          onClickCancel={() => {
            setAuthState(AuthStates.Reauth);
            dialogRef.current.close();
          }}
          onClickNextFromReauth={() => setAuthState(AuthStates.NewEmail)}
          onClickNextFromNewEmail={onClickNextFromNewEmail}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setAuthState(AuthStates.Reauth)}>close</button>
      </form>
    </dialog>
  );
};

const Auth = ({
  authState,
  onClickCancel,
  onClickNextFromReauth,
  onClickNextFromNewEmail,
}: {
  authState: AuthStates;
  onClickCancel: () => void;
  onClickNextFromReauth: () => void;
  onClickNextFromNewEmail: () => void;
}) => {
  switch (authState) {
    case AuthStates.Reauth:
      return (
        <Reauth
          onClickCancel={onClickCancel}
          onClickNext={onClickNextFromReauth}
        />
      );
    case AuthStates.NewEmail:
      return (
        <NewEmail
          onClickCancel={onClickCancel}
          onClickNext={onClickNextFromNewEmail}
        />
      );
  }
};

const Reauth = ({
  onClickCancel,
  onClickNext,
}: {
  onClickCancel: () => void;
  onClickNext: () => void;
}) => {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordVisible, togglePasswordVisible] = useToggle(false);
  const [reauthenticate, reauthenticating, userCredential, error] =
    useReauthenticate();

  useEffect(() => {
    if (!userCredential) {
      return;
    }
    onClickNext();
  }, [userCredential]);

  const getPasswordIconUrl = () => {
    return passwordVisible
      ? "/admin/images/icon/visibility-on-icon.svg"
      : "/admin/images/icon/visibility-off-icon.svg";
  };
  return (
    <>
      <div className="text-base-black text-lg font-semibold">Password</div>
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
          className="rounded-[64px] bg-disabled-field base-200-content font-normal w-[281px] h-[52px] mt-[10px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
        />
        <div
          className={"w-[412px] mt-[10px] font-medium text-[16px] text-left"}
        >
          Password
        </div>
        <label className="input input-bordered flex items-center gap-2 rounded-[64px] base-content font-normal w-[281px] h-[52px] mt-[10px] pl-[15px] placeholder:text-base-content placeholder:text-left shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]">
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            placeholder={"Password"}
            className="bg-base-100 bg-autofill:bg-yellow-200"
            onChange={(e) => setPassword(e.target.value)}
          />
          <GhostButton
            className="w-16 h-16 min-h-16 p-0"
            onClick={togglePasswordVisible}
          >
            <ColorizedSvg
              url={getPasswordIconUrl()}
              className="w-[16px] h-[16px] bg-secondary object-cover"
            />
          </GhostButton>
        </label>
      </div>
      <div>
        <FirebaseAuthError error={error} />
      </div>
      <div className="modal-action flex justify-end gap-4">
        <Button
          type="button"
          className="btn btn-block w-[78px] h-[33px] min-h-[33px] px-[16px] py-[8px] bg-base-100 rounded-[64px] border-2 border-primary
              text-primary text-[14px] leading-3 font-medium hover:bg-base-100 hover:border-primary"
          onClick={onClickCancel}
        >
          Cancel
        </Button>
        {reauthenticating ? (
          <div className="flex justify-center items-center w-[95px] h-[33px] min-h-[33px]">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <Button
            type="button"
            className="btn btn-block w-[95px] h-[33px] min-h-[33px] px-[16px] py-[8px] bg-primary rounded-[64px]
              text-base-white text-[14px] leading-3 font-bold hover:bg-primary hover:border-primary"
            onClick={() => reauthenticate(password)}
          >
            Continue
          </Button>
        )}
      </div>
    </>
  );
};

const NewEmail = ({
  onClickCancel,
  onClickNext,
}: {
  onClickCancel: () => void;
  onClickNext: () => void;
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [validEmail, setValidEmail] = useState(false);
  const [updateEmail, updating, isSuccessful, error] = useUpdateEmail();

  useEffect(() => {
    if (!isSuccessful) {
      return;
    }

    onClickNext();
  }, [isSuccessful]);

  useEffect(() => {
    if (EMAIL_REGEX.test(email)) {
      setValidEmail(true);
    }
  }, [email]);

  return (
    <>
      <div className="flex items-center w-[408px] mt-[80px]">
        <div className="w-[114px] mt-[10px] font-medium text-[16px] text-left">
          E-mail address
        </div>
        <input
          type="text"
          value={email}
          placeholder={"Email"}
          className="input input-bordered border-neutral-200 rounded-[64px] base-content font-normal w-[281px] h-[52px] mt-[10px] pl-[15px] placeholder:text-base-content placeholder:text-left"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <FirebaseAuthError error={error} />
      </div>
      <div className="modal-action flex justify-end gap-4">
        <Button
          type="button"
          className="btn btn-block w-[78px] h-[33px] min-h-[33px] px-[16px] py-[8px] bg-base-100 rounded-[64px] border-2 border-primary
              text-primary text-[14px] leading-3 font-medium hover:bg-base-100 hover:border-primary"
          onClick={onClickCancel}
        >
          Cancel
        </Button>
        {updating ? (
          <div className="flex justify-center items-center w-[95px] h-[33px] min-h-[33px]">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <Button
            type="button"
            disabled={!validEmail}
            className="btn btn-block w-[125px] h-[33px] min-h-[33px] px-[14px] py-[8px] bg-primary rounded-[64px]
              text-base-white text-[14px] leading-3 font-semibold hover:bg-primary hover:border-primary"
            onClick={() => updateEmail(email, "/admin/auth/verified_email")}
          >
            Save changes
          </Button>
        )}
      </div>
    </>
  );
};

export default EmailEditDialog;
