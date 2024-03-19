import { useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import Button from "ui/atoms/Button";
import FirebaseAuthError from "ui/atoms/FirebaseAuthError";

export type Props = {
  email: string;
  loading: boolean;
  error?: ErrorMessage;
  onClickPasswordReset: (email: string) => void;
  withMailSignIn: (email: string, password: string) => void;
};

const EmailAndPasswordSignIn = ({
  email,
  loading,
  error,
  onClickPasswordReset,
  withMailSignIn,
}: Props) => {
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <div className="flex items-center justify-center w-[100dvw] h-[100dvh] p-8">
        <div className="p-7 rounded-[40px] flex flex-col gap-5 items-center max-w-[400px] z-10">
          <div className={"text-[32px]"}>パスワードを入力</div>
          <div className="w-[408px]">
            <input
              type={"text"}
              value={email}
              disabled={true}
              className="rounded-2xl bg-slate-100 w-[408px] h-[52px] text-center input-bordered"
            />
            <input
              type={"password"}
              value={password}
              placeholder={"パスワード"}
              className="rounded-2xl bg-slate-100 w-[408px] h-[52px] placeholder:text-center input-bordered mt-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type={"button"}
              className={"btn-link text-xs text-primary"}
              onClick={() => onClickPasswordReset(email)}
            >
              パスワードを再設定する
            </button>
          </div>
          <FirebaseAuthError error={error} />
          <LoadingButton
            disabled={!!!password}
            loading={loading}
            onClick={() => withMailSignIn(email, password)}
          />
        </div>
      </div>
    </>
  );
};

const LoadingButton = ({
  disabled,
  loading,
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) => {
  if (loading) {
    return <span className={"loading loading-spinner text-info loading-md"} />;
  }
  return (
    <Button
      disabled={disabled}
      className={
        "btn btn-block btn-primary w-[179px] rounded-2xl text-md text-xl font-normal text-primary-content"
      }
      onClick={onClick}
    >
      サインイン
    </Button>
  );
};

export default EmailAndPasswordSignIn;
