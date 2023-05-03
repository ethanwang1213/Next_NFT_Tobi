import styles from "./PageTitle.module.scss";

type Props = {
  isShown: boolean;
  title: string;
};

const PageTitle: React.FC<Props> = ({ isShown, title }) => {
  return (
    <div className={styles.titleContainer}>
      {isShown && <h1 className={styles.title}>{title}</h1>}
    </div>
  );
};

export default PageTitle;
