import styles from "./AttributeLine.module.scss";

type Props = {
  type: string;
  value: string;
};

/**
 * プロフィールの各種情報の行のコンポーネント
 * @param param0 
 * @returns 
 */
const AttributeLine: React.FC<Props> = ({ type, value }) => {
  return <div className={styles.container}>
    <div className={styles.attributeType}>{type}</div>
    <div className={styles.attributeValue}>{value}</div>
  </div>;
};

export default AttributeLine;