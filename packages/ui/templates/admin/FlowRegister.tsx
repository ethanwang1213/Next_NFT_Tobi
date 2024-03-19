import { useAuth } from "contexts/AdminAuthProvider";
import Image from "next/image";
import Button from "ui/atoms/Button";

type Props = {
  registered: boolean;
};
const FlowRegister = ({ registered }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Image
        src={"/admin/images/flow-logo.svg"}
        alt={"flow logo"}
        width={160}
        height={160}
        className={"mt-[90px]"}
      />
      <div className={"mt-[50px]"}>
        <ProcesssingStatus registered={registered} />
      </div>
      <div className={"mt-[15px]"}>
        <RegisterButton registered={registered} />
      </div>
    </div>
  );
};

const ProcesssingStatus = ({ registered }: Props) => {
  if (registered) {
    return (
      <div className={"font-bold text-[32px]"}>
        Flow アカウントを作成しました
      </div>
    );
  }

  return (
    <>
      <div className={"flex flex-row items-end font-bold text-[32px]"}>
        Flow アカウント作成中
        <span className="loading loading-dots loading-md"></span>
      </div>
      <div className={"font-medium text-[14px] mt-[15px]"}>
        Flow アカウントの作成には時間がかかることがあります。
      </div>
      <div className={"font-medium text-[14px] text-center mt-[100px]"}>
        アカウントが作成されると通知されます
      </div>
    </>
  );
};

const RegisterButton = ({ registered }: Props) => {
  const { finishFlowAccountRegistration } = useAuth();
  if (registered) {
    return (
      <Button
        className="bg-primary text-primary-content w-[179px] h-[48px] rounded-2xl"
        onClick={finishFlowAccountRegistration}
      >
        <span className={"font-normal text-[20px]"}>完了</span>
      </Button>
    );
  }
  return <LoadingButton />;
};

export const LoadingButton = () => {
  return (
    <button
      type="button"
      className="bg-inactive text-inactive-content w-[179px] h-[48px] rounded-2xl"
      disabled
    >
      <div className={"flex flex-row items-center justify-center"}>
        <span className="loading loading-spinner loading-sm"></span>
        <span className="font-normal text-[20px] ml-[5px]">処理中</span>
      </div>
    </button>
  );
};

export default FlowRegister;
