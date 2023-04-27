import styles from "./ProfileInfo.module.scss";

type Props = {
  dataType: string;
  dataValue: string;
};

const ProfileInfo: React.FC<Props> = ({ dataType, dataValue }) => {
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

export default ProfileInfo;