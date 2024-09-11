import SettingPageTitle from "@/components/PageTitle/SettingPageTitle";
import { useSettingContext } from "@/contexts/journal-SettingProvider";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { EMAIL_REGEX } from "journal-pkg/types/journal-types";
import Loading from "journal-pkg/ui/atoms/Loading";
import Image from "next/image";
import { useEffect, useState } from "react";

const MAX_REDEEM_EMAILS_COUNT = 12;

/**
 * The component on the left side of the settings page
 * @returns
 */
const SettingPc0: React.FC = () => {
  const { user } = useAuth();
  const { loadRedeemEmails } = useSettingContext();
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadRedeemEmails();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      <SettingPageTitle isShown={true} />
      <div className="relative h-full flex flex-col">
        <div>
          <div className="w-[1181px] h-[109px] flex items-start shrink-0 gap-[20px]">
            <Image
              alt="mail"
              src="/journal/images/icon/Mail_journal.svg"
              width={80}
              height={80}
            />
            <div className="flex flex-col items-start shrink-0 text-[40px] text-text-1000 font-bold">
              <div>Redemption Address</div>
              <div className="w-[534px] text-[16px] text-primary font-bold">
                The default address cannot be changed. Add an additional address
                here to redeem.
              </div>
            </div>
          </div>
        </div>
        <div className="inline-flex flex-col items-start gap-[43px] mt-[30px]">
          <div className="flex items-start gap-[16px]">
            <div className="w-[121px] flex flex-col justify-center text-text-1000 text-[20px] font-bold">
              New address
            </div>
            <div className="flex items-start gap-[4px]">
              <input
                type="text"
                className="w-[280px] h-[32px] bg-transparent rounded-[48px] shrink-0 border-[2px] border-button focus:outline-none focus-within:outline-none md:focus-within:border-button sm:focus-within:border-button pl-[10px] text-accent text-[20px] font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <AddButton email={email} cleanEmail={() => setEmail("")} />
          </div>
        </div>
        <div className="mt-[40px] flex items-start gap-[16px]">
          <div className={"w-[121px] h-[32px] flex flex-col items-start"}>
            <div className="w-[121px] h-[32px] flex flex-col justify-center shrink-0 text-text-1000 text-[20px] font-bold">
              Default
            </div>
          </div>
          <div className="flex flex-col items-start gap-[16px]">
            <MailAddressData email={user.email} verified={true} />
            <RedeemEmailList />
          </div>
        </div>
      </div>
    </>
  );
};

const AddButton: React.FC<{
  email: string;
  cleanEmail: () => void;
}> = ({ email, cleanEmail }) => {
  const { redeemEmails, addingRedeemEmail, addRedeemEmail } =
    useSettingContext();

  const handleClick = async () => {
    if (Object.keys(redeemEmails).length >= MAX_REDEEM_EMAILS_COUNT) {
      // Since there is one email address not included in the list,
      // the displayed email address count will be MAX_REDEEM_EMAILS_COUNT+1.
      alert(
        `You can add up to ${MAX_REDEEM_EMAILS_COUNT + 1} email addresses.`,
      );
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      alert("Invalid email format.");
      return;
    }

    const result = await addRedeemEmail(email);
    if (result) {
      cleanEmail();
    }
  };

  if (addingRedeemEmail) {
    return (
      <div className="w-[105px] h-[32px] px-[8px] py-[4px] flex justify-center">
        <Loading className="text-accent"></Loading>
      </div>
    );
  }

  return (
    <button
      disabled={email === ""}
      className="w-[105px] h-[32px] px-[8px] py-[4px] flex justify-center items-center gap-[4px] rounded-[64px] bg-button text-[20px] text-neutral-base-white font-bold disabled:bg-disabled-input disabled:text-disabled-input-content"
      onClick={handleClick}
    >
      add
    </button>
  );
};

const RedeemEmailList: React.FC = () => {
  const { loadingRedeemEmails, redeemEmails, openConfirmEmailRemovalModal } =
    useSettingContext();
  if (loadingRedeemEmails) {
    return (
      <div className="flex justify-center w-[280px] h-[30px] mt-[30px]">
        <Loading className="text-text" />
      </div>
    );
  }

  return (
    <>
      {Object.keys(redeemEmails).map((email) => {
        return (
          <MailAddressData
            key={email}
            email={email}
            verified={redeemEmails[email]}
            onClick={openConfirmEmailRemovalModal}
          />
        );
      })}
    </>
  );
};

const MailAddressData: React.FC<{
  email: string;
  verified: boolean;
  onClick?: (email: string) => void;
}> = ({ email, verified, onClick }) => {
  return (
    <div className="flex items-center gap-[24px]">
      <div className="flex items-start gap-[2px]">
        <div className="w-[280px] h-[32px] flex flex-col justify-center shrink-0 text-text text-[20px] font-bold">
          <div className="text-nowrap text-ellipsis overflow-hidden">
            {email}
          </div>
        </div>
        {verifiedMark(verified)}
      </div>
      {onClick && (
        <button
          onClick={() => onClick(email)}
          className="btn btn-ghost shrink-0 hover:bg-none hover:bg-opacity-0 border-0 p-0"
        >
          <Image
            alt="cancel"
            src="/journal/images/icon/Cancel_journal.svg"
            width={16}
            height={16}
          />
        </button>
      )}
    </div>
  );
};

const verifiedMark = (verified: boolean) => {
  const key = verified ? "true" : "false";
  const markCss = {
    true: "bg-primary-main-1000",
    false: "bg-transparent border-[2px] border-text-1000",
  };
  const textColor = {
    true: "text-neutral-base-white",
    false: "text-primary-main-1000",
  };
  const text = { true: "verified", false: "not verified" };

  return (
    <div
      className={`w-[120px] h-[32px] px-[16px] py-[8px] flex justify-center items-center gap-x-[8px] shrink-0 rounded-[64px] ${markCss[key]}`}
    >
      <div
        className={`text-[16px] font-bold ${textColor[key]} whitespace-nowrap`}
      >
        {text[key]}
      </div>
    </div>
  );
};

export default SettingPc0;
