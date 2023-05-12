import { useCallback, useEffect, useState } from "react";
import PersonalIcon from "./sub/PersonalIcon";
import PersonalInfo from "./sub/PersonalInfo";
import {
  mockName,
  mockBirthday,
  mockMail,
  mockRecordList,
} from "../../../libs/mocks/mockProfile0";
import ActivityRecordLine from "../../TypeValueLine/ActivityRecordLine";

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
  const [name, setName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [recordList, setRecordList] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    setName(mockName);
    setBirthday(mockBirthday);
    setMail(mockMail);
    setRecordList(mockRecordList);
  }, []);

  // メールアドレスをマスクする関数
  const maskMailAddress = useCallback((mailAddress: string) => {
    const mailAddressArray = mailAddress.split("@");
    const maskedMailAddress =
      mailAddressArray[0].slice(0, 3) + "****" + "@" + mailAddressArray[1];
    return maskedMailAddress;
  }, []);

  return (
    <div className="page">
      <div className="w-full sm:flex">
        <div className="w-full sm:w-[50%] mb-6 flex justify-center">
          <div className="w-[50%] min-w-[200px] max-w-[300px] sm:w-full aspect-square grid content-center">
            <PersonalIcon
              profileSrc="/mocks/images/profile.png"
              badgeSrc="/mocks/images/badge.png"
            />
          </div>
        </div>
        <div className="sm:w-[50%] mt-2 mb-10 sm:ml-10 grid gap-2 sm:gap-6">
          <PersonalInfo dataType={"Name"} dataValue={name} />
          <PersonalInfo dataType={"Birthday"} dataValue={birthday} />
          <PersonalInfo dataType={"Mail"} dataValue={maskMailAddress(mail)} />
        </div>
      </div>
      <div className="mb-4 sm:mb-14">
        {/* TODO: ゆくゆくはボタンを実装する */}
        {/* <NavButton label={"購入"} />
        <NavButton label={"受け取り"} />
        <NavButton label={"送信"} /> */}
      </div>
      <h3 className="text-center text-xl sm:text-[28px] text-primary font-bold mb-6 sm:mb-10">
        Activity Record
      </h3>
      <div className="grid gap-2 overflow-y-auto">
        {recordList.map((v) => (
          <ActivityRecordLine key={v.id} lineType={v.text} lineValue={v.date} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage0;
