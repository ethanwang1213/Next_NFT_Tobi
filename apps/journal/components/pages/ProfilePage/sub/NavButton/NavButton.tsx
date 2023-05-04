import styles from "./NavButton.module.scss";

type Props = {
  label: string;
};

/**
 * プロフィールページのボタン
 * 今後の実装に使用する予定あり
 * 2023/05/04現在は未使用
 * @param param0
 * @returns
 */
const NavButton: React.FC<Props> = ({ label }) => {
  return (
    <div className={styles.button}>
      <button className={styles.icon}>ボタン</button>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default NavButton;
