import styles from "./Redeem0PC.module.scss";

const Redeem0PC: React.FC = () => {
  return (
    <div className="bg-blue-100">
      <div>
        <input
          type="text"
          placeholder="Enter Redemption Code"
          className={styles.redeemInput}
        />
        <p className={styles.description}>
          NFT受け取りコードを入力してください。
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default Redeem0PC;
