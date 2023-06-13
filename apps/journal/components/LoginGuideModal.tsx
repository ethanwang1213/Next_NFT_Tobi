import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/router";

const LoginGuideModal: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user && user.email) {
    return <></>;
  }

  return (
    <>
      <input type="checkbox" className="modal-toggle" id="login-guide-modal" />
      <div className="modal">
        <div className="modal-box p-8 pb-4">
          <h3 className="pb-8 font-bold text-sm sm:text-base text-center text-accent">
            全ての機能を利用するには、
            <br />
            メールアドレスでのアカウント登録が
            <br className="block sm:hidden" />
            必要です。
          </h3>
          <div className="flex flex-col gap-3">
            <label
              className="btn btn-block btn-accent"
              onClick={() => router.replace("/login")}
              htmlFor="login-guide-modal"
            >
              アカウント登録ページへ
            </label>
            <label
              className="btn btn-block btn-ghost text-accent"
              htmlFor="login-guide-modal"
            >
              キャンセル
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginGuideModal;
