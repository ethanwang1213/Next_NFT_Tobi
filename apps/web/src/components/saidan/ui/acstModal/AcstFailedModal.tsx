import ModalContainer from "@/components/global/ModalContainer";
import useSaidanStore from "@/stores/saidanStore";

/**
 * アクスタ生成中の旨を通知するモーダル
 * @param param0
 * @returns
 */
const AcstFailedModal: React.FC = () => {
  const acstFailedTitle = useSaidanStore((state) => state.acstFailedTitle);
  const acstFailedText = useSaidanStore((state) => state.acstFailedText);
  const closeAcstFailedModal = useSaidanStore(
    (state) => state.closeAcstFailedModal
  );

  return (
    <ModalContainer closeMethod={closeAcstFailedModal}>
      <h3 className="acst-modal-title">{acstFailedTitle}</h3>
      <p className="acst-modal-text">{acstFailedText}</p>
      <div className="acst-modal-btn-container">
        <button onClick={closeAcstFailedModal} className="acst-modal-close">
          閉じる
        </button>
      </div>
    </ModalContainer>
  );
};

export default AcstFailedModal;
