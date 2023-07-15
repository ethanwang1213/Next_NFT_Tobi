import { useEffect, useState } from "react";
import PersonalIcon from "./sub/PersonalIcon";
import PersonalInfo from "./sub/PersonalInfo";
import DiscordOAuthButton from "./sub/DiscordOAuthButton";
import { useAuth } from "@/contexts/AuthProvider";
import ActivityRecord from "./sub/ActivityRecord";
import useDateFormat from "@/hooks/useDateFormat";
import JournalStampIcon from "@/public/images/icon/stamp_journal.svg";

export type ActivityRecord = {
  id: number;
  text: string;
  date: string;
};

/**
 * プロフィールページの1ページ目。
 * @param param0
 * @returns
 */
const ProfilePage0: React.FC = () => {
  const { user } = useAuth();
  const [birthday, setBirthday] = useState<string>("");
  const { formattedFromYMD } = useDateFormat();

  useEffect(() => {
    if (!user) return;

    if (user.birthday) {
      if (
        user.birthday.year === 0 ||
        user.birthday.month === 0 ||
        user.birthday.day === 0
      ) {
        setBirthday("-");
      } else {
        const { year, month, day } = user.birthday;
        setBirthday(formattedFromYMD(year, month, day));
      }
    }
  }, [user]);

  return (
    <>
      <div className="w-full sm:flex relative">
        <div className="w-full sm:w-[50%] mb-6 flex justify-center">
          <div className="w-[60%] sm:w-[60%] min-w-[180px] sm:min-w-[200px] max-w-[300px] sm:w-full aspect-square grid content-center">
            <PersonalIcon />
          </div>
        </div>
        <div className="sm:w-[50%] mt-2 mb-6 sm:ml-10 grid gap-2 sm:gap-4">
          {user && (
            <>
              <PersonalInfo
                dataType={"Name"}
                dataValue={user.name === "" ? "-" : user.name}
              />
              <PersonalInfo
                dataType={"Birthday"}
                dataValue={birthday === "" ? "-" : birthday}
              />
              <PersonalInfo
                dataType={"Mail"}
                dataValue={
                  !user.email || user.email === ""
                    ? "-"
                    : `${
                        user.email.length < 21
                          ? user.email
                          : user.email.slice(0, 20) + "..."
                      }`
                }
                hidable={true}
              />
              {/* EditProfileModalに紐づく */}
              <div className="hidden sm:block w-full relative sm:flex sm:justify-end shrink">
                <label
                  htmlFor={`${
                    !user || !user.email
                      ? "login-guide-modal"
                      : "edit-profile-modal"
                  }`}
                  className="
                  btn btn-outline btn-lg btn-primary 
                  min-h-[40px] h-[45px] 
                  text-[18px] border-2 rounded-full 
                  drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)]"
                >
                  プロフィールを編集
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mb-0 sm:mb-10">
        {/* TODO: ゆくゆくはボタンを実装する */}
        {/* <NavButton label={"購入"} />
        <NavButton label={"受け取り"} />
        <NavButton label={"送信"} /> */}
      </div>
      <h3 className="text-center text-[18px] sm:text-[28px] text-primary font-bold mb-4 sm:mb-10">
        Activity Record
      </h3>
      <div className="max-h-[30%] sm:max-h-[42%] grid gap-2 overflow-y-auto">
        <ActivityRecord />
      </div>
      <div className="hidden sm:block absolute bottom-[1%] w-full grow min-h-[80px]">
        <div className="w-full h-full flex justify-center">
          <DiscordOAuthButton />
        </div>
      </div>
      <div className="absolute top-[-0] right-[0] -mr-4 w-2/5 aspect-square">
        <div className="sm:hidden relative overflow-hidden w-full h-full [&>svg_*]:!fill-[#9F5C00]">
          <JournalStampIcon className="absolute top-[-30%] right-[-20%] pointer-events-none select-none" />
        </div>
      </div>
    </>
  );
};

export default ProfilePage0;
