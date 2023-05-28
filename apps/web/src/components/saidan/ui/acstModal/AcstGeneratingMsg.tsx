import useSaidanStore from "@/stores/saidanStore";
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  isShow: boolean;
};

/**
 * アクスタ生成中の旨を通知するモーダル
 * @param param0
 * @returns
 */
const AcstGeneratingMsg: React.FC<Props> = ({ isShow }) => {
  const closeAcstGeneratingMsg = useSaidanStore(
    (state) => state.closeAcstGeneratingMsg
  );

  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isShow) {
      gsap.to(msgRef.current, { top: "0px", duration: 0.3 });
    } else {
      gsap.to(msgRef.current, { top: "-200px", duration: 0.3 });
    }
  }, [isShow]);

  return (
    <div
      className="saidan-acst-msg-container-outer"
      ref={msgRef}
      style={{ top: "-200px" }}
    >
      <div className="saidan-acst-msg-container-inner">
        <div className="saidan-acst-msg-content-container">
          <FontAwesomeIcon icon={faCircleInfo} size="xl" />
          アクリルスタンドを生成中です。
          <br className="saidan-acst-msg-br" />
          完了したらSaidanに表示されます。
          <button
            type="button"
            className="saidan-acst-msg-close"
            onClick={closeAcstGeneratingMsg}
          >
            <FontAwesomeIcon icon={faXmark} size="2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcstGeneratingMsg;
