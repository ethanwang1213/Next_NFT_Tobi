import useWindowSize from "@/hooks/useWindowSize";
import isSpLandscape from "@/methods/home/isSpLandscape";
import { useEffect, useState } from "react";

type Props = {};

/**
 * スマホでの横向き表示禁止のメッセージを表示するコンポーネント
 * @param param0 
 * @returns 
 */
const ForbidLandcape: React.FC<Props> = ({ }) => {
  const { displayWidth, displayHeight } = useWindowSize();
  const [isForbiddenDeviceRot, setIsForbiddenDeviceRot] = useState(false);

  useEffect(() => {
    setIsForbiddenDeviceRot(isSpLandscape(window, displayWidth, displayHeight));
  }, [displayWidth, displayHeight]);

  return (
    <>
      {isForbiddenDeviceRot && (
        <div>
          <input
            type="checkbox"
            id="my-modal-6"
            className="modal-toggle"
            defaultChecked={isForbiddenDeviceRot}
          />
          <div className="modal modal-bottom tab:modal-middle">
            <div className="modal-box flex justify-center bg-[#414142]">
              <h3 className="font-bold text-lg text-white m-4">
                画面を縦向きにしてご覧ください
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForbidLandcape;
