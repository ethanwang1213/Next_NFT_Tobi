import ModalContainer from "@/components/global/ModalContainer";
import useSaidanStore from "@/stores/saidanStore";

/**
 * アクスタ生成中の旨を通知するモーダル
 * @param param0
 * @returns
 */
const AcstAlreadyRequestedModal: React.FC = () => {
  const closeAcstAlreadyRequestedModal = useSaidanStore(
    (state) => state.closeAcstAlreadyRequestedModal
  );

  return (
    <ModalContainer closeMethod={closeAcstAlreadyRequestedModal}>
      <h3 className="acst-modal-title">アクリルスタンドを生成中です</h3>
      <p className="acst-modal-text">完了したらSaidanに表示されます。</p>
      <p className="acst-modal-text">
        複数個の配置は、生成完了後に可能となります。
      </p>
      <div className="acst-modal-btn-container">
        <button
          onClick={closeAcstAlreadyRequestedModal}
          className="acst-modal-ok"
        >
          OK
        </button>
      </div>
    </ModalContainer>
  );
};

export default AcstAlreadyRequestedModal;
