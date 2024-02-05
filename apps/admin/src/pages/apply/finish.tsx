import Image from "next/image";

const Finish = () => {
  return (
    <div className="container h-full mx-auto py-20 text-center font-normal text-base text-[#5A5A5A] flex-1">
      <Image
        src="/admin/images/png/tobiratory.png"
        width={594}
        height={603}
        alt=""
        className="mx-auto"
      />
      <div className="text-[40px] mt-28">申請が完了しました！</div>
      <div className="text-xl mt-10 mb-3">
        承認されると登録メールアドレスへ通知され、コンテンツ管理などの機能が使用できます。
      </div>
    </div>
  );
};

export default Finish;
