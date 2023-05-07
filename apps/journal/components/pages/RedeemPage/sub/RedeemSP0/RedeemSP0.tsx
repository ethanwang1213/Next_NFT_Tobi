import TypeValueLine from "../../../../TypeValueLine/TypeValueLine";
import RedeemStatusModal from "../RedeemStatusModal/RedeemStatusModal";
import styles from "./RedeemSP0.module.scss";

const RedeemSP0: React.FC = ({}) => {
  return (
    <div className={styles.redeemContainer}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Redemption Code"
          className={styles.redeemInput}
        />
        <p className={styles.description}>
          NFT受け取りコードを入力してください。
        </p>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.dataLineContainer}>
          <TypeValueLine
            lineType={"Receive Account"}
            lineValue={"KEISUKE"}
            styleMode={"REDEEM_DATA"}
          />
          <TypeValueLine
            lineType={"Receive Journal ID"}
            lineValue={"KEISUKE"}
            styleMode={"REDEEM_DATA"}
            hidable={true}
          />
        </div>
        <div className={styles.buttonContainer}>
          <label htmlFor="my-modal" className={styles.redeemButton}>
            Redeem
          </label>
        </div>
      </div>
      <p className={styles.howTo}>How to receive NFTs</p>

      <RedeemStatusModal redeemStatus={"SERVER_ERROR"} />
    </div>
  );
};

export default RedeemSP0;
