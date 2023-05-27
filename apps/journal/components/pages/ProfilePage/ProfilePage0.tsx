import { useEffect, useState } from "react";
import PersonalIcon from "./sub/PersonalIcon";
import PersonalInfo from "./sub/PersonalInfo";
import { mockRecordList } from "../../../libs/mocks/mockProfile0";
import ActivityRecordLine from "../../TypeValueLine/ActivityRecordLine";
import { useAuth } from "@/contexts/AuthProvider";
import AuthDiscordButton from "./sub/AuthDiscordButton";

export type ActivityRecord = {
  id: number;
  text: string;
  date: string;
};

/**
 * プロフィールページの1ページ目
 * @param param0
 * @returns
 */
const ProfilePage0: React.FC = () => {
  const { user } = useAuth();
  const [birthday, setBirthday] = useState<string>("");
  const [recordList, setRecordList] = useState<ActivityRecord[]>([]);

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
        const month = user.birthday.month.toString().padStart(2, "0");
        const day = user.birthday.day.toString().padStart(2, "0");
        setBirthday(`${user.birthday.year}/${month}/${day}`);
      }
    }
    setRecordList(mockRecordList);
  }, [user]);

  return (
    <>
      <div className="w-full sm:flex relative">
        <div className="w-full sm:w-[60%] mb-6 flex justify-center">
          <div className="w-[60%] sm:w-[60%] min-w-[200px] sm:min-w-[200px] max-w-[300px] sm:w-full aspect-square grid content-center">
            <PersonalIcon
              profileSrc={user ? user.icon : ""}
              badgeSrc="/mocks/images/badge.png"
            />
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
                dataValue={user.email === "" ? "-" : user.email}
              />
              {/* EditProfileModalに紐づく */}
              <div className="hidden sm:block w-full relative sm:flex sm:justify-end shrink">
                <label
                  htmlFor="edit-profile-modal"
                  className="btn btn-outline btn-lg btn-primary rounded-3xl sm:w-[60%] sm:min-h-[10px] h-[40px] text-sm sm:text-[16px] px-0 border-2 rounded-full drop-shadow-[0px_4px_2px_rgba(0,0,0,0.1)]"
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
        {recordList.map((v) => (
          <ActivityRecordLine key={v.id} lineType={v.text} lineValue={v.date} />
        ))}
      </div>
      <div className="w-full grow min-h-[12%] sm:min-h-[80px] flex justify-center">
        <AuthDiscordButton />
      </div>
    </>
  );
};

export default ProfilePage0;
