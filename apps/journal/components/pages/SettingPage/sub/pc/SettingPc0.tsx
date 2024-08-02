import { httpsCallable } from "firebase/functions";
import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { functions } from "journal-pkg/fetchers/firebase/journal-client";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * settingページの左ページのPC表示用コンポーネント
 * @returns
 */
const SettingPc0: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [redeemEmails, setRedeemEmails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getRedeemEmails();
  }, []);

  const getRedeemEmails = async () => {
    const callable = httpsCallable<
      { email: string },
      Record<string, boolean> | null
    >(functions, "journalNfts-getRedeemEmails");
    const emails = await callable()
      .then((result) => {
        setRedeemEmails(result.data ?? {});
        console.log("redeemEmails: ", result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDelete = async (email: string) => {
    const callable = httpsCallable(functions, "journalNfts-removeRedeemEmail");
    try {
      await callable({ email });
      await getRedeemEmails();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (email: string) => {
    setEmail("");
    const callable = httpsCallable(
      functions,
      "journalNfts-sendConfirmationRedeemEmail",
    );
    try {
      await callable({ email });
      await getRedeemEmails();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative h-full pt-6 flex flex-col">
      <div>
        <div className="w-[1181px] h-[151px] flex items-start shrink-0 gap-[20px]">
          <Image
            alt="mail"
            src="/journal/images/icon/Mail_journal.svg"
            width={80}
            height={80}
          />
          <div className="flex flex-col items-start shrink-0 text-[32px] text-accent font-bold">
            <div>Redemption Address</div>
            <div className="text-[12px] text-primary font-bold">
              The default address cannot be changed. Add an additional address
              here to redeem.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[43px] inline-flex flex-col items-start gap-[43px]">
        <div className="flex items-start gap-[16px]">
          <div className="flex flex-col justify-center text-accent text-[16px] font-bold">
            new address
          </div>
          <div className="flex items-start gap-[4px]">
            <input
              type="text"
              className="w-[330px] h-[24px] bg-transparent rounded-[48px] shrink-0 border-[2px] border-accent focus:outline-none focus-within:outline-none md:focus-within:border-accent sm:focus-within:border-accent pl-[10px] text-accent text-[16px] font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="w-[72px] h-[24px] px-[8px] py-[4px] flex justify-center items-center gap-[4px] rounded-[64px] bg-accent text-[10px] text-accent-content font-bold"
            onClick={() => handleAdd(email)}
          >
            add
          </button>
        </div>
      </div>
      <div className="mt-[40px] flex items-start gap-[16px]">
        <div className={"w-[121px] h-[32px] flex flex-col items-start"}>
          <div className="w-[121px] h-[32px] flex flex-col justify-center shrink-0 text-text-1000 text-[16px] font-bold">
            Default
          </div>
        </div>
        <div className="flex flex-col items-start gap-[16px]">
          <VerifiedMailAddress email={user.email} />
          {Object.keys(redeemEmails).map((email) => {
            return redeemEmails[email] ? (
              <VerifiedMailAddress key={email} email={email} />
            ) : (
              <NotVerifiedMailAddress
                key={email}
                email={email}
                onClick={confirmDelete}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VerifiedMailAddress: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="flex justify-end items-start gap-[159px]">
      <div className="w-[413px] flex flex-col items-center gap-[32px]">
        <div className="w-[413px] flex items-center">
          <div className="w-[280px] h-[32px] flex flex-col justify-center shrink-0 text-[16px] text-text font-bold">
            {email}
          </div>
          <div className="w-[109px] h-[32px] px-[16px] py-[8px] flex justify-center items-center gap-x-[8px] shrink-0 rounded-[64px] bg-primary-main-1000">
            <div className="text-[12px] text-neutral-base-white font-bold">
              verified
            </div>
          </div>
        </div>
      </div>
      <div className="w-[16px] h-[16px]"></div>
    </div>
  );
};

const NotVerifiedMailAddress: React.FC<{
  email: string;
  onClick: (email: string) => void;
}> = ({ email, onClick }) => {
  return (
    <div className="flex items-center gap-[24px]">
      <div className="flex items-start gap-[2px]">
        <div className="w-[280px] h-[32px] flex flex-col justify-center shrink-0 text-text text-[16px] font-bold">
          {email}
        </div>
        <button className="w-[109px] h-[32px] px-[16px] py-[8px] flex justify-center items-center gap-x-[8px] rounded-[64px] bg-transparent border-[2px] border-text-1000">
          <div className="text-[12px] text-primary-main-1000 font-bold">
            not verified
          </div>
        </button>
      </div>
      <button onClick={() => onClick(email)}>
        <Image
          alt="cancel"
          src="/journal/images/icon/Cancel_journal.svg"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
};

export const ConfirmModal: React.FC<{ title: string; isOpen: boolean }> = ({
  title,
  isOpen,
}) => {
  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box w-[437px] rounded-[32px]">
        <div className="flex justify-end mr-[2px] mt-[-2px]">
          <form method={"dialog"}>
            <button className="btn w-[16px] h-[19px] min-h-fit border-0 p-0 bg-base-100 hover:bg-base-100">
              <Image
                src={"/admin/images/icon/close.svg"}
                alt={"close button"}
                width={16}
                height={19}
                className={"border-0 p-0"}
              />
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SettingPc0;
