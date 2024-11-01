import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useMemo, useState } from "react";
import { ItemTransformUpdatePhase } from "types/unityTypes";

const ShowcaseUnityUISetting = ({ menuShow }: { menuShow: boolean }) => {
  const [px, setpx] = useState<string>(null);
  const [py, setpy] = useState<string>(null);
  const [rx, setrx] = useState<string>(null);
  const [scale, setScale] = useState<string>(null);

  const floatPx = useMemo(() => parseFloat(px), [px]);
  const floatPy = useMemo(() => parseFloat(py), [py]);
  const floatScale = useMemo(() => parseFloat(scale), [scale]);

  const t = useTranslations("Showcase");
  const { selectedItem, updateItemTransform } = useShowcaseEditUnity();

  const notNumberReg = useMemo(() => /[^-\d.]/g, []);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setpx(selectedItem.positionOnPlane.x);
    }
  }, [selectedItem?.positionOnPlane?.x]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setpy(selectedItem.positionOnPlane.y);
    }
  }, [selectedItem?.positionOnPlane?.y]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setrx(selectedItem.rotationAngle);
    }
  }, [selectedItem?.rotationAngle]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setScale(selectedItem.scale);
    }
  }, [selectedItem?.scale]);

  const updatePosition = (x: number, y: number) => {
    if (!selectedItem || !updateItemTransform) return;
    const updatedData = {
      positionOnPlane: { x, y },
      rotationAngle: selectedItem?.rotationAngle ?? 0,
      scale: selectedItem?.scale ?? 1,
      phase: ItemTransformUpdatePhase.Updating,
    };
    updateItemTransform(updatedData);
  };

  const updateRotation = (rotation: number) => {
    if (!selectedItem || !updateItemTransform) return;
    const updatedData = {
      positionOnPlane: selectedItem?.positionOnPlane,
      rotationAngle: rotation,
      scale: selectedItem?.scale ?? 1,
      phase: ItemTransformUpdatePhase.Updating,
    };
    updateItemTransform(updatedData);
  };

  const updateScale = (scale: number) => {
    if (!selectedItem || !updateItemTransform) return;
    const updatedData = {
      positionOnPlane: selectedItem?.positionOnPlane,
      rotationAngle: selectedItem?.rotationAngle ?? 0,
      scale,
      phase: ItemTransformUpdatePhase.Updating,
    };
    updateItemTransform(updatedData);
  };

  const updateFinish = () => {
    if (!selectedItem || !updateItemTransform) return;
    const updatedData = {
      positionOnPlane: selectedItem?.positionOnPlane,
      rotationAngle: selectedItem?.rotationAngle ?? 0,
      scale: selectedItem?.scale ?? 1,
      phase: ItemTransformUpdatePhase.Ended,
    };
    updateItemTransform(updatedData);

    setpx(selectedItem.positionOnPlane.x.toFixed(3));
    setpy(selectedItem.positionOnPlane.y.toFixed(3));
    setrx(selectedItem.rotationAngle.toFixed(1));
    setScale(selectedItem.scale.toFixed(3));
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

  return (
    menuShow && (
      <div className="flex flex-col h-[192px] bg-[#565656] bg-opacity-75 backdrop-blur-[25px] w-full rounded-3xl shadow-xl pl-12 pr-12 pt-8 pb-8 gap-4">
        <div className="flex items-center h-8">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src="/admin/images/icon/position.svg"
              alt="position icon"
            />
            <span className="text-[16px] font-bold w-[100px]">
              {t("Position")}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <input
              type="text"
              placeholder="x"
              className="input input-bordered max-w-xs w-24 h-8 bg-secondary-300 text-[#FCFCFC] text-[10px] rounded-[5px] text-center no-spinner"
              value={py === null || py === undefined ? "" : px}
              onChange={(e) => {
                const newX = e.target.value.replace(notNumberReg, "");
                const floatNewX = parseFloat(newX);
                setpx(newX);
                if (!isNaN(floatNewX)) {
                  updatePosition(floatNewX, floatPy);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFinish();
              }}
              onBlur={updateFinish}
            />
            <input
              type="text"
              placeholder="y"
              className="input input-bordered max-w-xs w-24 h-8 bg-secondary-300 text-[#FCFCFC] text-[10px] rounded-[5px] text-center no-spinner"
              value={py === null || py === undefined ? "" : py}
              onChange={(e) => {
                const newY = e.target.value.replace(notNumberReg, "");
                const floatNewY = parseFloat(newY);
                setpy(newY);
                if (!isNaN(floatNewY)) {
                  updatePosition(floatPx, floatNewY);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFinish();
              }}
              onBlur={updateFinish}
            />
          </div>
        </div>
        <div className="flex items-center h-8">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src="/admin/images/icon/rotation.svg"
              alt="rotation icon"
            />
            <span className="text-[16px] font-bold w-[100px]">
              {t("Rotation")}
            </span>
          </div>
          <div className="flex items-center w-full">
            <input
              type="text"
              placeholder="rotation"
              className="input input-bordered max-w-xs w-24 h-8 bg-secondary-300 text-[#FCFCFC] text-[10px] rounded-[5px] text-center no-spinner"
              value={rx === null || rx === undefined ? "" : rx}
              onChange={(e) => {
                const newR = e.target.value.replace(notNumberReg, "");
                const floatNewR = parseFloat(newR);
                setrx(newR);
                if (!isNaN(floatNewR)) {
                  updateRotation(floatNewR);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFinish();
              }}
              onBlur={updateFinish}
            />
          </div>
        </div>
        <div className="flex items-center h-8">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src="/admin/images/icon/scale.svg"
              alt="scale icon"
            />
            <span className="text-[16px] font-bold w-[80px]">{t("Scale")}</span>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="scale"
              className="input input-bordered max-w-xs w-14 h-8 bg-secondary-300 text-[#FCFCFC] text-[10px] rounded-[5px] text-center pl-[7px] pr-[10px] no-spinner"
              value={scale === null || scale === undefined ? "" : scale}
              onChange={(e) => {
                const newScale = e.target.value.replace(notNumberReg, "");
                const floatNewScale = parseFloat(newScale);
                setScale(newScale);
                if (!isNaN(floatNewScale)) {
                  updateScale(floatNewScale);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFinish();
              }}
              onBlur={() => {
                updateFinish();
              }}
            />
          </div>
          <Slider
            min={0}
            max={5}
            step={0.001}
            styles={{
              handle: handleStyle,
              track: trackStyle,
              rail: railStyle,
            }}
            style={{ width: "130px" }}
            className="ml-6"
            value={scale === null || scale === undefined ? 1.0 : floatScale}
            onChange={(newScale: number) => {
              setScale(newScale.toString());
              updateScale(newScale);
            }}
            onBlur={() => {
              updateFinish();
            }}
          />
        </div>
      </div>
    )
  );
};

export default ShowcaseUnityUISetting;
