import { useAcrylicBaseSettingsUnityHook } from "hooks/useCustomUnityHook";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Slider from "rc-slider";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import { SecondaryUnity } from "ui/molecules/CustomUnity";
import ResetConfirmDialog from "./ResetConfirmDialog";
import Spinner from "./Spinner";
interface AcrylicStandSettingDialogProps {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  data: any;
  scaleRatioSettingHandler: (itemId: number, newRatio: number) => void;
  selectedItem: number;
  loading: boolean;
}

const AcrylicStandSettingDialog = ({
  dialogRef,
  data,
  scaleRatioSettingHandler,
  selectedItem,
  loading,
}: AcrylicStandSettingDialogProps) => {
  const confirmDialogRef = useRef(null);
  const [scaleRatio, setScaleRatio] = useState(
    data?.acrylicBaseScaleRatio || 1,
  );
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Workspace");
  const tooltip = useTranslations("Tooltip");

  const resetConfirmHandler = () => {
    resetAcrylicBaseScaleRatio();
    setScaleRatio(1);
  };

  const {
    setLoadData,
    isSceneOpen,
    unityProvider,
    updateAcrylicBaseScaleRatio,
    resetAcrylicBaseScaleRatio,
  } = useAcrylicBaseSettingsUnityHook();

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
    if (isOpen && data?.type === 2) {
      setLoadData({
        itemId: selectedItem,
        modelUrl: data.modelUrl,
        acrylicBaseScaleRatio: data.acrylicBaseScaleRatio || 1,
      });
    }
  }, [data, selectedItem, isOpen, setLoadData]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const observer = new MutationObserver(() => setIsOpen(dialog.open));
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl px-10 py-8 flex flex-col gap-3 justify-between items-center bg-[#2E2E2EF2]">
        {loading && (
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-[#00000080] z-20">
            <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
          </div>
        )}
        <ResetConfirmDialog
          dialogRef={confirmDialogRef}
          confirmHandler={resetConfirmHandler}
        />
        <form method="dialog">
          <button className="absolute w-4 h-4 top-5 right-5">
            <span
              className="material-symbols-outlined text-base-white cursor-pointer"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </form>
        <div className="flex flex-col text-white items-center text-[30px] space-y-5">
          <span className="font-bold"> {tooltip("VisualSetting")}</span>
          <span className="text-base"> {t("AdjustAcrylicRatio")}</span>
        </div>
        <div className="h-[500px] flex justify-between gap-16 w-full mt-6">
          <div className="w-full shadow shadow-custom-light rounded-[16px]">
            <div className="h-[100%] rounded-[16px] overflow-hidden relative bg-white">
              {!isSceneOpen && isOpen && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              {isOpen && unityProvider && (
                <SecondaryUnity
                  unityProvider={unityProvider}
                  isSceneOpen={isSceneOpen}
                />
              )}
            </div>
          </div>
          <div className="text-white w-full flex flex-col justify-between">
            <div>
              <p className="font-bold text-[20px] pt-9 pb-6">
                {t("AdjustBase")}
              </p>
              <div className="flex items-center h-8">
                <div className="flex items-center gap-2">
                  <Image
                    width={20}
                    height={20}
                    src="/admin/images/icon/scale.svg"
                    alt="scale icon"
                  />
                  <span className="text-[16px] font-bold w-[100px]">
                    {t("Scale")}
                  </span>
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
              <Button
                className="text-[20px] font-bold rounded-[32px] px-8 py-3 bg-secondary uppercase"
                onClick={() => confirmDialogRef.current?.show()}
              >
                {t("Reset")}
              </Button>
              <Button
                className="text-[20px] font-bold rounded-[32px] px-8 py-3 bg-primary"
                onClick={() => {
                  scaleRatioSettingHandler(selectedItem, scaleRatio);
                }}
              >
                {t("Done")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AcrylicStandSettingDialog;
