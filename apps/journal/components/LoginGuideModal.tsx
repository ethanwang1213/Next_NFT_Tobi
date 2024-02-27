import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useRouter } from "next/router";

/**
 * メールアドレスでのアカウント登録へ誘導するモーダル
 * @returns
 */
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
          <h3 className="pb-6 font-bold text-sm sm:text-base text-center text-accent sm:leading-8">
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
