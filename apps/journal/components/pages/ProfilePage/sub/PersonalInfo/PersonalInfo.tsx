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
      <div className={styles.type}>
        {dataType}
      </div>
      <div className={styles.value}>
        {dataValue}
      </div>
    </div>
  </>;
};

export default PersonalInfo;