import { useAcrylicBaseSettingsUnityContext } from "hooks/useCustomUnityContext";
import Image from "next/image";
import Slider from "rc-slider";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { AcrylicBaseSettingsUnity } from "ui/molecules/CustomUnity";
import ResetConfirmDialog from "./ResetConfirmDialog";
import Spinner from "./Spinner";
interface AcrylicStandSettingDialogProps {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  data: any;
  closeHandler: () => void;
  scaleRatioSettingHandler: (itemId: number, newRatio: number) => void;
}

const AcrylicStandSettingDialog = ({
  dialogRef,
  data,
  closeHandler,
  scaleRatioSettingHandler,
}: AcrylicStandSettingDialogProps) => {
  const confirmDialogRef = useRef(null);
  const [scaleRatio, setScaleRatio] = useState(
    data?.acrylicBaseScaleRatio || 1,
  );

  const resetConfirmHandler = () => {
    resetAcrylicBaseScaleRatio();
    setScaleRatio(1);
  };

  const {
    setLoadData,
    isLoaded,
    unityProvider,
    updateAcrylicBaseScaleRatio,
    resetAcrylicBaseScaleRatio,
  } = useAcrylicBaseSettingsUnityContext();

  const onChangeHandler = (value: number) => {
    updateAcrylicBaseScaleRatio(value);
    setScaleRatio(value);
  };

  const handleStyle = {
    borderColor: "#FAFAFA",
    height: 20,
    width: 20,
    marginLeft: 0,
    backgroundColor: "#FAFAFA",
  };

  const trackStyle = {
    backgroundColor: "#9F9C9C",
    height: 8,
  };

  const railStyle = {
    backgroundColor: "#9F9C9C",
    height: 8,
  };

  useEffect(() => {
    if (data?.type === 2) {
      setLoadData({
        itemId: data.digitalItemId,
        modelUrl: data.modelUrl,
        acrylicBaseScaleRatio: data.acrylicBaseScaleRatio || 1,
      });
    }
  }, [data, setLoadData]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl p-6 flex flex-col gap-3 justify-between items-center bg-[#2E2E2EF2]">
        <ResetConfirmDialog
          dialogRef={confirmDialogRef}
          confirmHandler={resetConfirmHandler}
        />
        <form method="dialog">
          <button
            className="absolute w-4 h-4 top-5 right-5"
            onClick={closeHandler}
          >
            <span
              className="material-symbols-outlined text-base-white cursor-pointer"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </form>
        <div className="flex justify-center text-[30px] text-white font-bold items-center gap-2">
          <Image
            width={32}
            height={32}
            alt="setting button"
            src="/admin/images/icon/setting-icon.svg"
            className="h-[27px]"
          />
          <span>Ratio Settings</span>
        </div>
        <div className="h-[500px] mt-8 flex justify-between gap-16 w-full p-8">
          <div className="w-full shadow shadow-custom-light rounded-[16px]">
            <div className="h-[75%] rounded-t-[16px] overflow-hidden relative bg-white">
              {!isLoaded && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              <AcrylicBaseSettingsUnity
                unityProvider={unityProvider}
                isLoaded={isLoaded}
              />
            </div>
            <div className="px-8 text-white text-[16px] py-7">
              <div className="flex justify-between">
                <span className="font-bold">Adjust Body Scale</span>
                <span>0000</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Adjust Base Scale</span>
                <span>0000</span>
              </div>
            </div>
          </div>
          <div className="text-white w-full flex flex-col justify-between">
            <div>
              <p className="font-bold text-[20px] pt-9 pb-6">Adjust Base</p>
              <div className="flex items-center h-8">
                <div className="flex items-center gap-2">
                  <Image
                    width={20}
                    height={20}
                    src="/admin/images/icon/scale.svg"
                    alt="scale icon"
                  />
                  <span className="text-[16px] font-bold w-[80px]">Scale</span>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={scaleRatio}
                    onChange={(e) => onChangeHandler(Number(e.target.value))}
                    step={0.1}
                    placeholder="scale"
                    className="input input-bordered max-w-xs w-18 h-8 bg-secondary-700 text-white text-[16px] rounded-[5px] text-center no-spinner"
                  />
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
                  value={scaleRatio}
                  styles={{
                    handle: handleStyle,
                    track: trackStyle,
                    rail: railStyle,
                  }}
                  className="ml-6"
                  onChange={(value: number) => onChangeHandler(value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-8">
              <button
                className="text-[20px] font-bold rounded-[32px] px-8 py-3 bg-secondary"
                onClick={() => confirmDialogRef.current?.show()}
              >
                RESET
              </button>
              <button
                className="text-[20px] font-bold rounded-[32px] px-8 py-3 bg-primary"
                onClick={() => {
                  scaleRatioSettingHandler(data.digitalItemId, scaleRatio);
                }}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AcrylicStandSettingDialog;
