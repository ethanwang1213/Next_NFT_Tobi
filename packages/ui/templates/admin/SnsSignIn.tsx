import { auth } from "fetchers/firebase/client";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProviderId } from "types/adminTypes";
import Loading from "ui/atoms/Loading";
import BackLink from "ui/molecules/BackLink";
import FullScreenLoading from "ui/molecules/FullScreenLoading";
import LanguageSwitch from "ui/organisms/admin/LanguageSwitch";
import { AppleButton, GoogleButton } from "ui/templates/AuthTemplate";

export type Props = {
  email: string;
  loading: boolean;
  googleLabel: string;
  appleLabel: string;
  withGoogle: () => Promise<void>;
  withApple: () => Promise<void>;
  onClickBack: () => void;
};

const SnsSignIn = ({
  email,
  loading,
  googleLabel,
  appleLabel,
  withGoogle,
  withApple,
  onClickBack,
}: Props) => {
  const [initializing, setInitializing] = useState(true);
  const [hasGoogleAccount, setHasGoogleAccount] = useState(false);
  const [hasAppleAccount, setHasAppleAccount] = useState(false);
  const t = useTranslations("LogInSignUp");

  useEffect(() => {
    const fetchProviders = async () => {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      setHasGoogleAccount(signInMethods.includes(ProviderId.GOOGLE));
      setHasAppleAccount(signInMethods.includes(ProviderId.APPLE));
      setInitializing(false);
    };
    fetchProviders();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center p-8 flex-col">
        <div className="w-full">
          <BackLink onClickBack={onClickBack} />
        </div>
        <div className="mt-[90px] rounded-[40px] flex flex-col gap-5 items-center z-10">
          <Image
            src={"/admin/images/tobiratory-name-logo.svg"}
            alt={"link tobiratory account with flow account"}
            width={450}
            height={96}
          />
          {initializing ? (
            <Loading className="h-[56px] text-info" />
          ) : (
            <>
              <div className="flex w-[525px] h-[133px] flex-col justify-center items-center flex-shrink-0 bg-[#F3F3F3] mt-[86px]">
                <div className="flex w-[525px] h-[56px] flex-col justify-center flex-shrink-0">
                  <div className="text-secondary text-center text-[24px] font-bold leading-normal">
                    {t("PasswordAccountExists")}
                  </div>
                </div>
                <div className="flex w-[381px] h-[52px] flex-col justify-center flex-shrink-0">
                  <div className="text-[#5A5A5A] text-center text-[16px] font-normal leading-normal">
                    {email}
                  </div>
                </div>
              </div>
              <div className="mt-[91px]" />
              {hasGoogleAccount && (
                <div className="">
                  <GoogleButton label={googleLabel} onClick={withGoogle} />
                </div>
              )}
              {hasAppleAccount && (
                <div className={"mt-[5px]"}>
                  <AppleButton label={appleLabel} onClick={withApple} />
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-[195px] z-10 border-[1px] border-solid border-input-color">
          <LanguageSwitch />
        </div>
      </div>
      <FullScreenLoading isOpen={loading} />
    </div>
  );
};

export default SnsSignIn;
