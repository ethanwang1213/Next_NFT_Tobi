import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";

/**
 * メールアドレス未登録の場合にアカウント登録へ誘導する下部のガイド
 * @returns
 */
const LoginGuide: React.FC = () => {
  const { user } = useAuth();

  if (user && user.email) {
    return <></>;
  }

  return (
    <div className="absolute bottom-0 bg-accent rounded-t-md w-full flex px-4 py-4 sm:p-4 justify-center gap-2 sm:gap-4 align-middle">
      <div className="grid content-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-white shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <span className="grid content-center font-bold text-white text-xs sm:text-base">
        全ての機能を利用するには、メールアドレスでのアカウント登録が必要です。
      </span>
      <div className="hidden sm:block sm:grid sm:content-center sm:min-w-[132px]">
        <Link href={"/login"} className="btn btn-sm btn-secondary text-sm px-4">
          アカウント登録
        </Link>
      </div>
      <div className="block sm:hidden grid content-center min-w-[70px]">
        <Link href={"/login"} className="btn btn-sm btn-secondary text-xs">
          登録
        </Link>
      </div>
    </div>
  );
};

export default LoginGuide;
