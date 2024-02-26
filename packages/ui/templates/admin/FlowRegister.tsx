import { useAuth } from "contexts/AdminAuthProvider";
import Image from "next/image";
import FloatingButton from "ui/atoms/FloatingButton";

type Props = {
  registered: boolean;
};
const FlowRegister = ({ registered }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-[100dvw] h-[100dvh] p-8">
      <Image
        src={"/admin/images/flow-logo.svg"}
        alt={"flow logo"}
        width={160}
        height={160}
      />
      <ProcesssingStatus registered={registered} />
      <RegisterButton registered={registered} />
    </div>
  );
};

const ProcesssingStatus = ({ registered }: Props) => {
  if (registered) {
    return <div>Flow アカウントを作成しました</div>;
  }

  return (
    <>
      <div>
        Flow アカウント作成中
        <span className="loading loading-dots loading-xs"></span>
      </div>
      <div>Flow アカウントの作成には時間がかかることがあります。</div>
      <div>アカウントが作成されると通知されます</div>
    </>
  );
};

const RegisterButton = ({ registered }: Props) => {
  const { confirmFlowAccountRegistration } = useAuth();
  const handleClick = () => {
    confirmFlowAccountRegistration();
  };
  if (registered) {
    return (
      <FloatingButton
        className="bg-primary text-primary-content w-[179px] h-[48px] rounded-2xl"
        onClick={confirmFlowAccountRegistration}
      >
        完了
      </FloatingButton>
    );
  }
  return <LoadingButton />;
};

const LoadingButton = () => {
  return (
    <button
      type="button"
      className="bg-non-active text-non-active-content w-[179px] h-[48px] rounded-2xl"
      disabled
    >
      <span className="loading loading-spinner loading-sm"></span>
      <span className="text-sm">しばらくお待ちください</span>
    </button>
  );
};

export default FlowRegister;
