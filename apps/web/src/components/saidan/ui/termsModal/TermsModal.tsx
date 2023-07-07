import { useEffect, useRef, useState } from "react";

/**
 * 利用規約を表示するモーダル
 * @returns
 */
const TermsModal: React.FC = () => {
  const termsModalRef = useRef<HTMLDialogElement>(null);
  // iOSにおいて、iframeが一度高さを変更しないとスクロールできない謎バグ
  // が発生したので、高さを変更するためのstateを用意
  const [height, setHeight] = useState<string>("90%");

  const handleClick = () => {
    if (!termsModalRef.current) return;
    termsModalRef.current.showModal();
    setHeight("100%");
  };

  return (
    <div>
      {/* Open the modal using ID.showModal() method */}
      <div className="absolute text-xs sm:text-sm text-black/60 font-bold right-6 bottom-1 sm:bottom-2 divide-solid flex">
        <button onClick={handleClick}>利用規約</button>
        <hr className="w-[1px] h-[18px] mx-[10px] bg-black/40 border-none" />
        <a target="_blank" href="https://tbrnk.tobiratory.com/pages/contact">
          お問い合わせ
        </a>
      </div>
      <dialog
        id="terms-modal"
        className="modal"
        ref={termsModalRef}
        onClose={() => setHeight("90%")}
      >
        <form
          method="dialog"
          className="modal-box max-w-[800px] w-full max-h-full h-full flex flex-col px-3 sm:px-8"
        >
          <div
            className="grow"
            style={{
              WebkitOverflowScrolling: "touch",
              overflowY: "auto",
            }}
          >
            <iframe
              id="policy-modal-iframe"
              src="/saidan/policy/policy.html"
              className="policy-document"
              data-allowscroll="true"
              style={{
                height: height,
              }}
            />
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-neutral">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default TermsModal;
