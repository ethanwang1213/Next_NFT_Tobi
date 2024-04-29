import Image from "next/image";
import { useRouter } from "next/router";
import BackLinkBlock from "../../molecules/BackLinkBlock";

const PasswordResetFinished = () => {
  const router = useRouter();
  return (
    <>
      <div className="w-full">
        <BackLinkBlock
          title={"Password has been reset!"}
          fontSize={"medium"}
          visible={false}
        />
      </div>
      <Image
        src={"/journal/images/login/journal_book.svg"}
        alt={"Tobiratory logo"}
        width={296}
        height={230}
        className={"mt-[60px]"}
      />
      <div>
        <button
          className={`btn btn-block border-0 rounded-[66px] w-[176px] bg-primary-main hover:bg-primary-main text-neutral
                text-[20px] font-bold drop-shadow-[0_6px_8px_rgba(0,0,0,0.2)] mt-[77px]`}
          onClick={() => router.push("/login")}
        >
          Sign in
        </button>
      </div>
    </>
  );
};

export default PasswordResetFinished;
