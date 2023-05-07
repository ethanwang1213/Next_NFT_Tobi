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
      <p className={styles.text}>{text}</p>
      <p className={styles.date}>{date}</p>
    </div>
  );
};

export default RecordLine;
