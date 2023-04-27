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
  return <>
    <div className={styles.info}>
      <div className={styles.dataType}>
        {dataType}
      </div>
      <div className={styles.dataValue}>
        {dataValue}
      </div>
    </div>
  </>;
};

export default PersonalInfo;