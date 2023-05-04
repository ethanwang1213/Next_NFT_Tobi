import styles from "./NavButton.module.scss";

type Props = {
  label: string;
};

const NavButton: React.FC<Props> = ({ label }) => {
  return (
    <div className={styles.button}>
      <button className={styles.icon}>ボタン</button>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default NavButton;
