import { hasAppleAccount, hasGoogleAccount } from "contexts/AdminAuthProvider";
import useSnsReauthentication from "hooks/useSnsReauthentication";
import { useEffect } from "react";
import { ProviderId } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import { AppleButton, GoogleButton } from "ui/templates/AuthTemplate";

const SnsReauthModal = ({
  onCancel,
  onComplete,
}: {
  onCancel: () => void;
  onComplete: () => void;
}) => {
  const [reauthenticate, reauthenticating, userCredential, reauthError] =
    useSnsReauthentication();

  useEffect(() => {
    if (!userCredential) {
      return;
    }

    onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredential]);

  return (
    <>
      <div className="flex flex-col items-start gap-[6px] self-stretch">
        <div className="flex justify-center items-center">
          <span className="text-base-black text-[24px] pt-[10px] pb-[14px] font-bold leading-[120%]">
            Social Account
          </span>
        </div>
      </div>
      <div className="flex mt-[36px] pt-0 pb-0 flex-col justify-center items-start gap-[16px] self-stretch">
        {reauthenticating ? (
          <div className="flex justify-center items-center w-full">
            <Loading className="w-6 h-6" />
          </div>
        ) : (
          <>
            <GoogleButton
              label={"Googleでログイン"}
              autosize={true}
              disabled={!hasGoogleAccount()}
              onClick={() => reauthenticate(ProviderId.GOOGLE)}
            />
            <AppleButton
              label={"Appleでログイン"}
              autosize={true}
              disabled={!hasAppleAccount()}
              onClick={() => reauthenticate(ProviderId.APPLE)}
            />
          </>
        )}
      </div>
      <div className="h-[24px]">
        <FirebaseAuthError error={reauthError} />
      </div>
      <div className="modal-action flex h-[64px] mt-[5px] pt-0 pr-0 pb-0 justify-center items-end gap-[16px] self-stretch">
        <Button
          type="button"
          className="btn btn-block w-[78px] h-[33px] min-h-[33px] px-[16px] py-[8px] bg-base-100 rounded-[64px] border-[2px] border-primary
              text-primary text-[14px] leading-[120%] font-medium hover:bg-base-100 hover:border-primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default SnsReauthModal;
