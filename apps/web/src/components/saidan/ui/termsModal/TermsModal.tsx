import { useRef } from "react";

/**
 * 利用規約を表示するモーダル
 * @returns 
 */
const TermsModal: React.FC = () => {
  const termsModalRef = useRef<HTMLDialogElement>(null);

  const handleClick = () => {
    if (!termsModalRef.current) return;
    termsModalRef.current.showModal();
  }

  return <div>
    {/* Open the modal using ID.showModal() method */}
    <div className="absolute text-xs tab:text-sm text-black/60 font-bold right-6 bottom-1 tab:bottom-2 divide-solid flex">
      <button onClick={handleClick}>利用規約</button>
      <hr className="w-[1px] h-[18px] mx-[10px] bg-black/40 border-none" />
      <a target="_blank" href="https://tbrnk.tobiratory.com/pages/contact">お問い合わせ</a>
    </div>
    <dialog id="terms-modal" className="modal" ref={termsModalRef}>
      <form method="dialog" className="modal-box max-w-full w-full max-h-full h-full overflow-hidden">
        <iframe
          id="policy-iframe"
          src="/saidan/policy/policy.html"
          className="policy-document"
        />
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-neutral">Close</button>
        </div>
      </form>
    </dialog>
  </div>;
}

export default TermsModal;