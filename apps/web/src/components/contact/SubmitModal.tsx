type Props = {
  isSuccess: boolean;
};

const SubmitModal = ({ isSuccess }: Props) => (
  <>
    {/* Put this part before </body> tag */}
    <div className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isSuccess ? "送信が完了しました。" : "送信に失敗しました。"}{" "}
        </h3>
        {/* <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p> */}
        <div className="modal-action">
          <label htmlFor="contact-submit-modal" className="btn">
            閉じる
          </label>
        </div>
      </div>
    </div>
  </>
);

export default SubmitModal;
