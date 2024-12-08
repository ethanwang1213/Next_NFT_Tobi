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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.positionOnPlane?.x]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setpy(selectedItem.positionOnPlane.y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.positionOnPlane?.y]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setrx(selectedItem.rotationAngle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.rotationAngle]);

  useEffect(() => {
    if (selectedItem && !selectedItem.isUpdatedFromFrontend) {
      setScale(selectedItem.scale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setpx(selectedItem.positionOnPlane.x.toFixed(1));
    setpy(selectedItem.positionOnPlane.y.toFixed(1));
    setrx(selectedItem.rotationAngle.toFixed(1));
    setScale(selectedItem.scale.toFixed(1));
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
            <div className="w-24">
              <TransformTextField
                placeholder="x"
                value={px}
                onChange={(e) => {
                  const newX = e.target.value.replace(notNumberReg, "");
                  let floatNewX = parseFloat(newX);
                  if (!isNaN(floatNewX)) {
                    floatNewX = parseFloat(floatNewX.toFixed(1));
                    setpx(floatNewX.toString());
                    updatePosition(floatNewX, floatPy);
                  }
                }}
                updateFinish={updateFinish}
              />
            </div>
            <div className="w-24">
              <TransformTextField
                placeholder="y"
                value={py}
                onChange={(e) => {
                  const newY = e.target.value.replace(notNumberReg, "");
                  let floatNewY = parseFloat(newY);
                  if (!isNaN(floatNewY)) {
                    floatNewY = parseFloat(floatNewY.toFixed(1));
                    setpy(floatNewY.toString());
                    updatePosition(floatPx, floatNewY);
                  }
                }}
                updateFinish={updateFinish}
              />
            </div>
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
            <div className="w-24">
              <TransformTextField
                placeholder="rotation"
                value={rx}
                onChange={(e) => {
                  const newR = e.target.value.replace(notNumberReg, "");
                  let floatNewR = parseFloat(newR);
                  if (!isNaN(floatNewR)) {
                    floatNewR = parseFloat(floatNewR.toFixed(1));
                    setrx(floatNewR.toString());
                    updateRotation(floatNewR);
                  }
                }}
                updateFinish={updateFinish}
              />
            </div>
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
            <div className="w-14">
              <TransformTextField
                placeholder="scale"
                value={scale}
                onChange={(e) => {
                  const newScale = e.target.value.replace(notNumberReg, "");
                  let floatNewScale = parseFloat(newScale);
                  if (!isNaN(floatNewScale)) {
                    floatNewScale = parseFloat(floatNewScale.toFixed(1));
                    setScale(floatNewScale.toString());
                    updateScale(floatNewScale);
                  }
                }}
                updateFinish={updateFinish}
              />
            </div>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.1}
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

const TransformTextField = ({
  placeholder,
  value,
  onChange,
  updateFinish,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFinish: () => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = parseFloat(value) || 0;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = (currentValue + 0.1).toFixed(1);
      onChange({
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = (currentValue - 0.1).toFixed(1);
      onChange({
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      className="input input-bordered max-w-xs w-full h-8 bg-secondary-300 text-[#FCFCFC] text-[10px] rounded-[5px] text-center pl-[7px] pr-[10px]"
      value={
        value === null || value === undefined
          ? ""
          : parseFloat(value).toFixed(1)
      }
      onChange={onChange}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        updateFinish();
      }}
    />
  );
};

export default ShowcaseUnityUISetting;
