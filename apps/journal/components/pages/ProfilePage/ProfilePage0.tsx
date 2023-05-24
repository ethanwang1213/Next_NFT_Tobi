import { useCallback, useEffect, useState } from "react";
import PersonalIcon from "./sub/PersonalIcon";
import PersonalInfo from "./sub/PersonalInfo";
import { mockRecordList } from "../../../libs/mocks/mockProfile0";
import ActivityRecordLine from "../../TypeValueLine/ActivityRecordLine";
import { useAuth } from "@/contexts/AuthProvider";

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
  const {user} = useAuth();
  const [birthday, setBirthday] = useState<string>("");
  const [recordList, setRecordList] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    if (!user) return;

    if (!!user.birthday) {
      if (user.isBirthdayHidden) {
        setBirthday("-");
      } else {
        const month = user.birthday.month.toString().padStart(2, "0");
        const day = user.birthday.day.toString().padStart(2, "0");
        setBirthday(`${user.birthday.year}/${month}/${day}`);
      }
    }
    setRecordList(mockRecordList);
  }, [user]);

  // メールアドレスをマスクする関数
  const maskMailAddress = useCallback((mailAddress: string) => {
    const mailAddressArray = mailAddress.split("@");
    const maskedMailAddress =
      mailAddressArray[0].slice(0, 3) + "****" + "@" + mailAddressArray[1];
    return maskedMailAddress;
  }, []);

  return (
    <div className="page">
      <div className="w-full sm:flex relative">
        <div className="w-full sm:w-[50%] mb-6 flex justify-center">
          <div className="w-[50%] min-w-[200px] max-w-[300px] sm:w-full aspect-square grid content-center">
            <PersonalIcon
              profileSrc={
                user && user.icon !== ""
                  ? user.icon
                  : "/mocks/images/profile.png"
              }
              badgeSrc="/mocks/images/badge.png"
            />
          </div>
        </div>
        <div className="sm:w-[50%] mb-6 sm:ml-10 grid gap-2 sm:gap-8">
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
            </>
          )}
        </div>
        <div className="absolute top-0 right-0">
          {/* EditProfileModalに紐づく */}
          <label htmlFor="edit-profile-modal" className="btn">
            open modal
          </label>
        </div>
      </div>
      <div className="mb-4 sm:mb-10">
        {/* TODO: ゆくゆくはボタンを実装する */}
        {/* <NavButton label={"購入"} />
        <NavButton label={"受け取り"} />
        <NavButton label={"送信"} /> */}
      </div>
      <h3 className="text-center text-xl font-bold mb-6">Activity Record</h3>
      <div className="grid gap-2 overflow-y-auto">
        {recordList.map((v) => (
          <ActivityRecordLine key={v.id} lineType={v.text} lineValue={v.date} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage0;
