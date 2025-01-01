import { auth } from "fetchers/firebase/client";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "types/adminTypes";
import FlowAgreementWithEmailAndPassword, {
  PageType,
} from "ui/templates/admin/FlowAgreementWithEmailAndPassword";
import { getMessages } from "admin/messages/messages";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const PasswordReset = () => {
  const router = useRouter();
  const [emailLink, setEmailLink] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
  const [authError, setAuthError] = useState<ErrorMessage>(null);
  const t = useTranslations("LogInSignUp");
  const w = useTranslations("Workspace");

  useEffect(() => {
    const curHref = window.location.href;
    if (!isSignInWithEmailLink(auth, curHref)) {
      router.push("/authentication");
      return;
    }
    setEmailLink(curHref);
  }, [router]);

  const resetPassword = async (email: string, password: string) => {
    setUpdatingPassword(true);
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailLink(auth, email, emailLink);
      await updatePassword(userCredential.user, password);
      setUpdatedPassword(true);
      await auth.signOut();
    } catch (error) {
      console.error(error);
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
            onClick={() => router.push("/authentication")}
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
        buttonText={w("Reset")}
        email={""}
        isSubmitting={updatingPassword}
        pageType={PageType.PasswordReset}
        authError={authError}
        onClickSubmit={resetPassword}
      />
    );
  }
};

export default PasswordReset;
