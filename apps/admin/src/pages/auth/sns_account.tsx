import {
  getProviderName,
  hasAppleAccount,
  hasGoogleAccount,
  hasPasswordAccount,
  useAuth,
} from "contexts/AdminAuthProvider";
import useUnlinkProvider from "hooks/useUnlinkProvider";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProviderId } from "types/adminTypes";
import AppleIcon from "ui/atoms/AppleIcon";
import Button from "ui/atoms/Button";
import GoogleIcon from "ui/atoms/GoogleIcon";
import Loading from "ui/atoms/Loading";
import BackLink from "ui/molecules/BackLink";
import { getMessages } from "admin/messages/messages";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const PageStates = {
  List: 0,
  ReauthSns: 1,
  ReauthPassword: 2,
  ConfirmDisconnect: 3,
} as const;
type PageStates = (typeof PageStates)[keyof typeof PageStates];

const SnsAccount = () => {
  const { reauthStatus, setReauthStatus } = useAuth();
  const [providerState, setProviderState] = useState<PageStates>(
    PageStates.List,
  );
  const [reauthedProviderId, setReauthedProviderId] =
    useState<ProviderId | null>(null);

  useEffect(() => {
    const providerId = Object.keys(reauthStatus).find(
      (key) => reauthStatus[key],
    );
    if (providerId) {
      setReauthedProviderId(providerId as ProviderId);
      setProviderState(PageStates.ConfirmDisconnect);
    }
    setReauthStatus({
      [ProviderId.GOOGLE]: false,
      [ProviderId.APPLE]: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (providerState) {
    case PageStates.List:
      return <AccountList />;
    case PageStates.ReauthSns:
      return <div>ReauthSns</div>;
    case PageStates.ConfirmDisconnect:
      return (
        <ConfirmDisconnect
          providerId={reauthedProviderId}
          onClickBack={() => setProviderState(PageStates.List)}
        />
      );
  }
};

const ConfirmDisconnect = ({
  providerId,
  onClickBack,
}: {
  providerId;
  onClickBack: () => void;
}) => {
  const [unlinkProvider, processing, result, error] = useUnlinkProvider();
  const t = useTranslations("AccountSocialLogin");

  useEffect(() => {
    if (result) {
      onClickBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    if (error) {
      if (error instanceof String) {
        toast(error);
      } else {
        toast(error.toString());
      }
    }
  }, [error]);

  return (
    <div className="pt-9 pr-5 pl-12 pb-5 flex flex-col gap-5">
      <div className="w-[1109px] h-[47px] flex shrink-0">
        <div className="inline-flex items-center gap-[24px]">
          <div className="flex w-[174px] h-[47px] flex-col justify-center">
            <span className="text-secondary-600 text-center text-[32px] font-semibold leading-normal">
              ACCOUNT
            </span>
          </div>
          <RightArrow />
          <div className="flex w-[240px] h-[47px] flex-col justify-center">
            <span className="h-[47px] text-secondary-600 text-center text-[32px] font-semibold leading-normal">
              SOCIAL LOGIN
            </span>
          </div>
          <RightArrow />
          <div className="flex w-[583px] h-[47px] flex-col justify-center">
            <span className="h-[47px] text-secondary-600 text-center text-[32px] font-semibold leading-normal">
              {t("DisconnectTitle")}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full">
        <BackLink hideText={true} onClickBack={onClickBack} />
      </div>
      <div className="flex w-full justify-center shrink-0">
        <div className="flex w-[661px] flex-col items-start gap-[16px]">
          <div className="w-[661px] h-[340px]">
            <div className="w-[644px] h-[80px] shrink-0">
              <span className="text-secondary text-[20px] font-normal">
                {t("DisconnectWarning")}
              </span>
            </div>
            <div className="w-[661px] h-[144px] shrink-0 mt-[116px]">
              <div className="w-[661px] h-[144px] shrink-0">
                <div className="flex justify-center items-center w-[661px] h-[144px] shrink-0 rounded-[5px] border-[1px] border-base-200-content">
                  <div className="flex w-[505px] items-start gap-[16px]">
                    {providerId === ProviderId.GOOGLE ? (
                      <GoogleIcon
                        width={48}
                        height={48}
                        className="flex w-[48px] justify-center items-center shrink-0"
                      />
                    ) : (
                      <AppleIcon
                        size={"3x"}
                        className="flex w-[48px] justify-center items-center shrink-0"
                      />
                    )}
                    <div className="flex w-[136px] h-[48px] flex-col justify-center shrink-0">
                      <span className="text-secondary text-[20px] font-normal">
                        {getProviderName(providerId)}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center shrink-0 w-[321px] h-[48px]">
                      <span className="text-secondary text-[20px] font-normal text-center">
                        {t("Connected")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-[661px] h-[144px] shrink-0 mt-[131px]">
              {processing ? (
                <div className="flex self-start w-[48px] h-[48px]">
                  <Loading className="items-center" />
                </div>
              ) : (
                <Button
                  type="button"
                  className="btn btn-block w-[160px] h-[48px] min-h-[48px] bg-base-100 rounded-[64px] border-2 border-primary
              text-primary text-[20px] leading-[24px] font-bold hover:bg-base-100 hover:border-primary"
                  onClick={() => unlinkProvider(providerId)}
                >
                  {t("Disconnect")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RightArrow = () => {
  return (
    <div className="flex h-[47px] items-center">
      <Image
        src="/admin/images/right-arrow.svg"
        alt="right arrow"
        width={8}
        height={15}
        className="pt-[7px]"
      />
    </div>
  );
};

const AccountList = () => {
  const router = useRouter();

  return (
    <div className="pt-9 pr-5 pl-12 pb-5 flex flex-col gap-5">
      <div className="w-[470px] h-[47px] flex shrink-0">
        <div className="inline-flex items-center gap-[24px]">
          <div className="flex w-[174px] h-[47px] flex-col justify-center">
            <span className="text-secondary-600 text-center text-[32px] font-semibold leading-normal">
              ACCOUNT
            </span>
          </div>
          <RightArrow />
          <div className="flex w-[240px] h-[47px] flex-col justify-center">
            <span className="h-[47px] text-secondary-600 text-center text-[32px] font-semibold leading-normal">
              SOCIAL LOGIN
            </span>
          </div>
        </div>
      </div>
      <div className="w-full">
        <BackLink hideText={true} onClickBack={() => router.push("/account")} />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-row w-[908px] h-[128px] shrink-0">
          <div className="flex w-[748px] flex-col items-start gap-[16px]">
            <AccountItem
              providerId={ProviderId.GOOGLE}
              hasAccount={hasGoogleAccount()}
            >
              <GoogleIcon
                width={48}
                height={48}
                disabled={!hasGoogleAccount()}
              />
            </AccountItem>
            <div className="border-b-[0.5px] border-secondary w-[915px]" />
            <AccountItem
              providerId={ProviderId.APPLE}
              hasAccount={hasAppleAccount()}
            >
              <AppleIcon size={"3x"} disabled={!hasAppleAccount()} />
            </AccountItem>
          </div>
          <div className="grid grid-cols-1 justify-items-end gap-[16px]">
            <LinkButton
              providerId={ProviderId.GOOGLE}
              hasAccount={hasGoogleAccount()}
            />
            <div className="border-b-[0.5px]" />
            <LinkButton
              providerId={ProviderId.APPLE}
              hasAccount={hasAppleAccount()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountItem = ({
  providerId,
  hasAccount,
  children,
}: {
  providerId: ProviderId;
  hasAccount: boolean;
  children: React.ReactNode;
}) => {
  const t = useTranslations("AccountSocialLogin");
  return (
    <div className="flex items-end gap-[40px]">
      <div className="flex w-[48px] justify-center items-center">
        {children}
      </div>
      <div className="flex flex-col justify-center w-[136px] h-[48px]">
        <span className="text-secondary text-[20px] font-normal">
          {getProviderName(providerId)}
        </span>
      </div>
      <div className="flex flex-col justify-center w-[321px] h-[48px]">
        <span className="text-secondary text-[20px] font-normal">
          {hasAccount ? t("Connected") : t("NotConnected")}
        </span>
      </div>
    </div>
  );
};

const LinkButton = ({
  providerId,
  hasAccount,
}: {
  providerId: ProviderId;
  hasAccount: boolean;
}) => {
  const router = useRouter();
  const t = useTranslations("AccountSocialLogin");
  if (hasAccount) {
    return (
      <Button
        type="button"
        disabled={
          !hasPasswordAccount() && (!hasGoogleAccount() || !hasAppleAccount())
        }
        className="btn btn-block w-[160px] h-[48px] min-h-[48px] bg-base-100 rounded-[64px] border-2 border-primary
              text-primary text-[20px] leading-[24px] font-bold hover:bg-base-100 hover:border-primary"
        onClick={() =>
          router.push({
            pathname: `/auth/reauth_sns`,
            query: { providerId },
          })
        }
      >
        {t("Disconnect")}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      disabled={!hasPasswordAccount()}
      className="btn btn-block w-[127px] h-[48px] min-h-[48px] bg-primary rounded-[64px]
              text-base-white text-[20px] leading-[24px] font-bold hover:bg-primary hover:border-primary"
      onClick={() =>
        router.push({
          pathname: `/auth/reauth_password`,
          query: { providerId },
        })
      }
    >
      {t("Connect")}
    </Button>
  );
};

export default SnsAccount;
