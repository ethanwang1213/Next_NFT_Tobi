import { hasAppleAccount, hasGoogleAccount } from "contexts/AdminAuthProvider";
import useSnsReauthentication from "hooks/useSnsReauthentication";
import { useEffect } from "react";
import { ErrorMessage, ProviderId } from "types/adminTypes";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import Loading from "ui/atoms/Loading";
import ReauthTemplate, { Position } from "ui/templates/admin/ReauthTemplate";
import { AppleButton, GoogleButton } from "ui/templates/AuthTemplate";

const ReauthSns = ({
  providerId,
  error,
  onClickBack,
  onClickNext,
}: {
  providerId?: ProviderId;
  error?: ErrorMessage;
  onClickBack: () => void;
  onClickNext: () => void;
}) => {
  const [reauthenticate, reauthenticating, userCredential, reauthError] =
    useSnsReauthentication();

  useEffect(() => {
    if (!userCredential) {
      return;
    }

    onClickNext();
  }, [userCredential]);

  return (
    <ReauthTemplate position={Position.Middle} onClickBack={onClickBack}>
      <div className="h-[52px] mt-[40px]">
        <FirebaseAuthError error={error || reauthError} />
      </div>
      <div className="flex justify-end gap-4">
        {reauthenticating ? (
          <Loading className="w-6 h-6" />
        ) : (
          <>
            {hasGoogleAccount() &&
              (!providerId || providerId === ProviderId.GOOGLE) && (
                <GoogleButton
                  label={"Googleでログイン"}
                  onClick={() => reauthenticate(ProviderId.GOOGLE)}
                />
              )}
            {hasAppleAccount() &&
              (!providerId || providerId === ProviderId.APPLE) && (
                <AppleButton
                  label={"Appleでログイン"}
                  onClick={() => reauthenticate(ProviderId.APPLE)}
                />
              )}
          </>
        )}
      </div>
    </ReauthTemplate>
  );
};

export default ReauthSns;
