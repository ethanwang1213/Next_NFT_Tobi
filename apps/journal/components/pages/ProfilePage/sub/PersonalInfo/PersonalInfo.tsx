import styles from "./PersonalInfo.module.scss";

type Props = {
  dataType: string;
  dataValue: string;
};

/**
 * プロフィールの情報のコンポーネント
 * @param param0
 * @returns
 */
const PersonalInfo: React.FC<Props> = ({ dataType, dataValue }) => {
  return (
    <>
      <div className={styles.info}>
        <p className={styles.type}>{dataType}</p>
        <p className={styles.value}>{dataValue}</p>
      </div>
    </>
  );
};

export default PersonalInfo;
