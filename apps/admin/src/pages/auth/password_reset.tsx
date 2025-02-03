import { getMessages } from "admin/messages/messages";
import { auth } from "fetchers/firebase/client";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const PasswordReset = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const t = useTranslations("LogInSignUp");
  const l = useTranslations("Label");

  useEffect(() => {
    if (!router.isReady) return;

    const { oobCode } = router.query;
    if (typeof oobCode !== "string") {
      setAuthError({
        code: "invalid_code",
        message: "Invalid or missing reset code.",
      });
      return;
    }

    setOobCode(oobCode);

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
      })
      .catch((error) => {
        console.error("Error verifying reset code:", error);
        setAuthError({ code: error.code, message: error.message });
      });
  }, [router.isReady, router.query]);

  const resetPassword = async (email, password) => {
    if (!oobCode || !password) return;
    setUpdatingPassword(true);
    setAuthError(null);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setUpdatedPassword(true);
      await auth.signOut();
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setAuthError({ code: error.code, message: error.message });
      setUpdatingPassword(false);
    }
  };

  if (updatedPassword) {
    return (
      <div className="flex flex-col items-center justify-center w-[100dvw] p-8">
        <Image
          src={"/admin/images/tobiratory-logo.svg"}
          alt={"Tobiratory logo"}
          width={110}
          height={114}
          className={"mt-[200px]"}
        />
        <div className={"mt-[40px]"}>{t("PasswordResetNotify")}</div>
        <div>
          <button
            type={"button"}
            className={
              "btn-link font-medium text-[14px] text-primary mt-[20px]"
            }
            onClick={() => (window.location.href = "/auth/authentication")}
          >
            {t("GoToAuthScreen")}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <FlowAgreementWithEmailAndPassword
        title={t("PasswordReset")}
        buttonText={l("Reset")}
        email={email}
        isSubmitting={updatingPassword}
        pageType={PageType.PasswordReset}
        authError={authError}
        onClickSubmit={resetPassword}
      />
    );
  }
};

export default PasswordReset;
