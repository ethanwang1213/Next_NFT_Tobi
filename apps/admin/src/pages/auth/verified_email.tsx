import Image from "next/image";
import { useRouter } from "next/router";
import Button from "ui/atoms/Button";
import BackLink from "ui/organisms/admin/BackLink";

const VerifiedEmail = () => {
  const router = useRouter();
  return (
    <div className="pt-9 pr-5 pl-12 pb-5 flex flex-col gap-5">
      <div className="h-14 flex justify-between items-start">
        <span className="text-3xl text-secondary-600 font-semibold">
          ACCOUNT
        </span>
      </div>
      <div className={"w-full"}>
        <BackLink onClickBack={() => router.push("/account")} />
      </div>
      <div className="flex flex-col items-center justify-center shrink-0">
        <span className="text-base-content text-center text-[48px] font-bold">
          Verified new email address
        </span>
        <Image
          src="/admin/images/icon/task-complete.svg"
          alt="Tobiratory logo"
          width={317}
          height={317}
          className="mt-[40px]"
        />
        <Button
          className="btn btn-block w-[125px] h-[33px] min-h-[33px] px-[14px] py-[8px] bg-primary rounded-[64px]
              text-base-white text-[14px] leading-3 font-semibold hover:bg-primary hover:border-primary"
          onClick={() => router.push("/account")}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default VerifiedEmail;
