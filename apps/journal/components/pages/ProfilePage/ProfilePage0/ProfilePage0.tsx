import { useCallback, useState } from "react";
import PersonalIcon from "../sub/PersonalIcon/PersonalIcon";
import PersonalInfo from "../sub/PersonalInfo/PersonalInfo";
import styles from "./ProfilePage0.module.scss";
import NavButton from "../sub/NavButton/NavButton";
import AttributeLine from "../sub/AttributeLine/AttributeLine";
import RecordLine from "../sub/RecordLine/RecordLine";

type Props = {};

type Record = {
  text: string;
  date: string;
};

/**
 * プロフィールページの1ページ目
 * @param param0
 * @returns
 */
const ProfilePage0: React.FC<Props> = ({}) => {
  const [name, setName] = useState<string>("KEISUKE");
  const [birthday, setBirthday] = useState<string>("2004/06/21");
  const [mail, setMail] = useState<string>("aiueo.kakiku.123@gmail.com");
  const [recordList, setRecordList] = useState<Record[]>([
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOをジャーナルに追加した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRAPOLISのメンバーになった",
      date: "2023/05/01",
    },
    {
      text: "TOBIRAPOLISのハウスバッジを入手した",
      date: "2023/05/01",
    },
    {
      text: "メッセージカードがとるとから届きました",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOをジャーナルに追加した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRAPOLISのメンバーになった",
      date: "2023/05/01",
    },
    {
      text: "TOBIRAPOLISのハウスバッジを入手した",
      date: "2023/05/01",
    },
    {
      text: "メッセージカードがとるとから届きました",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
    {
      text: "TOBIRA NEKOを購入した",
      date: "2023/05/01",
    },
  ]);

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
              profileSrc="/mock/images/profile.png"
              badgeSrc="/mock/images/badge.png"
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
          <RecordLine text={v.text} date={v.date} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage0;
