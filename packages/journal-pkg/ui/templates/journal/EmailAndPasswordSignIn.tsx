import { ErrorMessage } from "journal-pkg/types/journal-types";
import FirebaseAuthError from "journal-pkg/ui/atoms/FirebaseAuthError";
import { LoadingButton } from "journal-pkg/ui/templates/AuthTemplate";
import { useState } from "react";
import BackLinkBlock from "../../molecules/BackLinkBlock";

type Props = {
  email: string;
  loading: boolean;
  error?: ErrorMessage;
  onClickBack: () => void;
  onClickPasswordReset: (email: string) => void;
  withMailSignIn: (email: string, password: string) => void;
};

const EmailAndPasswordSignIn = ({
  email,
  loading,
  error,
  onClickBack,
  onClickPasswordReset,
  withMailSignIn,
}: Props) => {
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <div className={"w-full"}>
        <BackLinkBlock
          title={"Password"}
          fontSize={"medium"}
          visible={true}
          onClickBack={onClickBack}
        />
      </div>
      <div className="w-full">
        <input
          type={"text"}
          value={email}
          disabled={true}
          className="input rounded-[56px] mt-[107px] disabled:bg-disabled-input w-[408px]
          text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
          text-neutral-main disabled:text-disabled-input-content placeholder:text-neutral-main font-bold placeholder:font-bold h-[48px] px-6"
        />
        <input
          type={"password"}
          value={password}
          placeholder={"Password"}
          className="input rounded-[56px] bg-slate-100 mt-[32px] w-[408px]
          text-sm sm:text-[16px] placeholder:text-sm sm:placeholder:text-[16px]
          text-neutral-main font-bold placeholder:font-bold h-[48px] px-6"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={"w-full text-right"}>
        <button
          type={"button"}
          className={
            "btn-link font-semibold text-[12px] no-underline text-secondary-main"
          }
          onClick={() => onClickPasswordReset(email)}
        >
          I forgot my password!
        </button>
      </div>
      <div className={"w-full mt-[10px]"}>
        <FirebaseAuthError error={error} />
      </div>
      <div className={"mt-[90px]"}>
        <LoadingButton
          label={"Sign in"}
          isPasswordReset={false}
          disabled={!!!password}
          loading={loading}
          onClick={() => withMailSignIn(email, password)}
        />
      </div>
    </>
  );
};

export default EmailAndPasswordSignIn;
