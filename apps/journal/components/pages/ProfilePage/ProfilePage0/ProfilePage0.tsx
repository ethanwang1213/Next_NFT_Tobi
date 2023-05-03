import { useCallback, useEffect, useState } from "react";
import PersonalIcon from "../sub/PersonalIcon/PersonalIcon";
import PersonalInfo from "../sub/PersonalInfo/PersonalInfo";
import styles from "./ProfilePage0.module.scss";
import NavButton from "../sub/NavButton/NavButton";
import RecordLine from "../sub/RecordLine/RecordLine";
import {
  mockBirthday,
  mockMail,
  mockName,
  mockRecordList,
} from "@/libs/mocks/mockProfile0";
import { ActivityRecord } from "../../../../types/ActivityRecord";

type Props = {};

/**
 * プロフィールページの1ページ目
 * @param param0
 * @returns
 */
const ProfilePage0: React.FC<Props> = ({}) => {
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
      <div className={styles.personal}>
        <div className={styles.iconContainer}>
          <div className={styles.icon}>
            <PersonalIcon
              profileSrc="/mocks/images/profile.png"
              badgeSrc="/mocks/images/badge.png"
            />
          </div>
        </div>
        <div className={styles.infoContainer}>
          <PersonalInfo dataType={"Name"} dataValue={name} />
          <PersonalInfo dataType={"Birthday"} dataValue={birthday} />
          <PersonalInfo dataType={"Mail"} dataValue={maskMailAddress(mail)} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <NavButton label={"購入"} />
        <NavButton label={"受け取り"} />
        <NavButton label={"送信"} />
      </div>
      <h3 className={styles.recordTitle}>Activity Record</h3>
      <div className={styles.records}>
        {recordList.map((v) => (
          <RecordLine key={v.id} text={v.text} date={v.date} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage0;
