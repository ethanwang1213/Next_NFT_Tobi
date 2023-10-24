import useSaidanStore from "@/stores/saidanStore";
import { RefObject, useEffect, useState } from "react";
import AcstGeneratingMsg from "./acstModal/AcstGeneratingMsg";
import SaidanTutorial from "./tutorial/SaidanTutorial";
import Bag from "./bag/Bag";
import ScreenShotResult from "./screenShotResult/ScreenShotResult";
import BagButton from "./uiButton/BagButton";
import CameraModeButton from "./uiButton/CameraModeButton";
import LogoutButton from "./uiButton/LogoutButton";
import OtherButton from "./uiButton/OtherButton";
import CropWindow from "./crop/CropWindow";
import AcstFailedModal from "./acstModal/AcstFailedModal";
import AcstAlreadyRequestedModal from "./acstModal/AcstAlreadyRequestedModal";
import { useWindowSize } from "hooks";
import isSpLandscape from "@/methods/home/isSpLandscape";
import TermsModal from "./termsModal/TermsModal";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement>;
};

/**
 * saidanページのUIをまとめたコンポーネント
 * @param param0
 * @returns
 */
const SaidanUI: React.FC<Props> = ({ canvasRef }) => {
  const isCropWindowVisible = useSaidanStore(
    (state) => state.isCropWindowVisible
  );
  const isScreenShotVisible = useSaidanStore(
    (state) => state.isScreenShotVisible
  );
  const isPolicyVisible = useSaidanStore((state) => state.isPolicyVisible);
  const isAcstGeneratingMsgShowing = useSaidanStore(
    (state) => state.isAcstGeneratingMsgShowing
  );
  const isAcstFailedModalOpen = useSaidanStore(
    (state) => state.isAcstFailedModalOpen
  );
  const isAcstAlreadyRequestedModalOpen = useSaidanStore(
    (state) => state.isAcstAlreadyRequestedModalOpen
  );

  // スマホでの横向き表示禁止
  const { displayWidth, displayHeight } = useWindowSize();
  const [isForbiddenDeviceRot, setIsForbiddenDeviceRot] = useState(false);

  useEffect(() => {
    setIsForbiddenDeviceRot(isSpLandscape(window, displayWidth, displayHeight));
  }, [displayWidth, displayHeight]);

  return (
    <>
      {!isForbiddenDeviceRot && (
        <>
          <LogoutButton />
          <OtherButton canvasRef={canvasRef} />
          <CameraModeButton />
          <BagButton />
          <TermsModal />
          <Bag />
          {isCropWindowVisible && <CropWindow />}
          {/* アクスタ関連 */}
          <AcstGeneratingMsg isShow={isAcstGeneratingMsgShowing} />
          {isAcstFailedModalOpen && <AcstFailedModal />}
          {isAcstAlreadyRequestedModalOpen && <AcstAlreadyRequestedModal />}
          {isScreenShotVisible && <ScreenShotResult canvasRef={canvasRef} />}
          <SaidanTutorial />
        </>
      )}
    </>
  );
};

export default SaidanUI;
