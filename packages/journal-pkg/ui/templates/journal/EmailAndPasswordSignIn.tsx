import { ErrorMessage } from "journal-pkg/types/journal-types";
import FirebaseAuthError from "journal-pkg/ui/atoms/FirebaseAuthError";
import BackLink from "journal-pkg/ui/molecules/BackLink";
import { LoadingButton } from "journal-pkg/ui/templates/AuthTemplate";
import { useState } from "react";

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
      <div className="bg-white p-7 sm:p-10 rounded-[40px] sm:rounded-[50px] flex flex-col gap-5 items-center md:translate-x-[250px] max-w-[400px] z-10">
        <div className={"w-full"}>
          <BackLink onClickBack={onClickBack} />
        </div>
        <div className={"text-[32px] h-[80px] font-bold"}>パスワードを入力</div>
        <div className="w-full">
          <input
            type={"text"}
            value={email}
            disabled={true}
            className="rounded-lg bg-disabled-field base-200-content font-normal w-full h-[52px] mt-[10px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
          />
          <input
            type={"password"}
            value={password}
            placeholder={"パスワード"}
            className="rounded-lg base-content font-normal w-full h-[52px] mt-[40px] pl-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={"w-full mt-[10px] text-right"}>
          <button
            type={"button"}
            className={
              "btn-link font-semibold text-[12px] no-underline text-primary"
            }
            onClick={() => onClickPasswordReset(email)}
          >
            I forgot my password!
          </button>
        </div>
        <div className={"mt-[10px]"}>
          <FirebaseAuthError error={error} />
        </div>
        <div className={"mt-[10px]"}>
          <LoadingButton
            label={"サインイン"}
            disabled={!!!password}
            loading={loading}
            onClick={() => withMailSignIn(email, password)}
          />
        </div>
      </div>
    </>
  );
};

export default EmailAndPasswordSignIn;
