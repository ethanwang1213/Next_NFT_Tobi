import styles from "./RecordLine.module.scss";

type Props = {
  text: string;
  date: string;
};

/**
 * プロフィールのActivity Recordの一行
 * @param param0
 * @returns
 */
const RecordLine: React.FC<Props> = ({ text, date }) => {
  return (
    <div className={styles.recordLine}>
      <div className={styles.text}>{text}</div>
      <div className={styles.date}>{date}</div>
    </div>
  );
};

export default RecordLine;
