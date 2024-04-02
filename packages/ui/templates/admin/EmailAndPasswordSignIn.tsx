import Image from "next/image";
import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";
import BackLink from "ui/organisms/admin/BackLink";
import { LoadingSpinnerButton } from "ui/templates/AuthTemplate";

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
      <div className="flex flex-col items-center justify-center p-8">
        <div className={"w-full"}>
          <BackLink onClickBack={onClickBack} />
        </div>
        <Image
          src={"/admin/images/tobiratory-name-logo.svg"}
          alt={"link tobiratory account with flow account"}
          width={450}
          height={96}
        />
        <div className={"text-[32px] h-[80px] mt-[50px] font-bold"}>
          パスワードを入力
        </div>
        <div className="w-[408px] mt-[80px]">
          <input
            type={"text"}
            value={email}
            disabled={true}
            className="rounded-lg bg-disabled-field base-200-content font-normal w-[408px] h-[52px] mt-[10px] pl-[15px] placeholder:text-center input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
          />
          <input
            type={"password"}
            value={password}
            placeholder={"パスワード"}
            className="rounded-lg base-content font-normal w-[408px] h-[52px] mt-[40px] pl-[15px] placeholder:text-base-content placeholder:text-left input-bordered shadow-[inset_0_2px_4px_0_rgb(0,0,0,0.3)]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={"w-[408px] mt-[10px] text-right"}>
          <button
            type={"button"}
            className={
              "btn-link font-semibold text-[12px] no-underline text-primary"
            }
            onClick={() => onClickPasswordReset(email)}
          >
            パスワードを再設定する
          </button>
        </div>
        <div className={"mt-[150px]"}>
          <FirebaseAuthError error={error} />
        </div>
        <div className={"mt-[10px]"}>
          <LoadingSpinnerButton
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
