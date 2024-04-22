import clsx from "clsx";
import { useAuth } from "contexts/AdminAuthProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "ui/atoms/Button";

const Finish = () => {
  const { finishBusinessAccountRegistration } = useAuth();
  const router = useRouter();
  return (
    <div className="container h-full mx-auto py-20 text-center font-normal text-base text-[#5A5A5A] flex-1">
      <Image
        src="/admin/images/png/tobiratory.png"
        width={594}
        height={603}
        alt="Tobiratory"
        className="mx-auto"
      />
      <div className="text-[40px] mt-28">申請が完了しました！</div>
      <div className="text-xl mt-10 mb-3">
        承認されると登録メールアドレスへ通知され、コンテンツ管理などの機能が使用できます。
      </div>
      <Button
        className={clsx(
          `w-[268px] h-14 text-xl leading-[56px] text-center text-white rounded-[30px] bg-primary`,
        )}
        onClick={() => {
          finishBusinessAccountRegistration();
          router.push("/items");
        }}
      >
        次へ
      </Button>
    </div>
  );
};

export default Finish;
