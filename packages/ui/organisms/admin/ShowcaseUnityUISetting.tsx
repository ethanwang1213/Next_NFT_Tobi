import ShowcaseEditUnityContext from "contexts/ShowcaseEditUnityContext";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useContext, useEffect, useState } from "react";
import { ItemTransformUpdatePhase } from "types/unityTypes";

const ShowcaseUnityUISetting = ({ menuShow }: { menuShow: boolean }) => {
  const [scale, setScale] = useState<number>(1.0);
  const [px, setpx] = useState<number>(0);
  const [py, setpy] = useState<number>(0);
  const [rx, setrx] = useState<number>(0);

  const unityContext = useContext(ShowcaseEditUnityContext);

  const { selectedItem, updateItemTransform } = unityContext;

  useEffect(() => {
    if (selectedItem) {
      setpx(selectedItem.positionOnPlane.x);
      setpy(selectedItem.positionOnPlane.y);
      setrx(selectedItem.rotationAngle);
      setScale(selectedItem.scale);
    }
  }, [selectedItem]);

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
            <span className="text-[16px] font-bold w-[100px]">Position</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <input
              type="number"
              placeholder="x"
              step={0.1}
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px] text-center"
              value={px === 0 ? "" : px.toFixed(3)}
              onChange={(e) => {
                const newX = parseFloat(e.target.value) || 0;
                setpx(newX);
                updatePosition(newX, py);
              }}
              onBlur={updateFinish}
            />
            <input
              type="number"
              placeholder="y"
              step={0.1}
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px] text-center"
              value={py === 0 ? "" : py.toFixed(3)}
              onChange={(e) => {
                const newY = parseFloat(e.target.value) || 0;
                setpy(newY);
                updatePosition(px, newY);
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
            <span className="text-[16px] font-bold w-[100px]">Rotation</span>
          </div>
          <div className="flex items-center w-full">
            <input
              type="number"
              min={0}
              max={359}
              placeholder="x"
              step={1}
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px] text-center"
              value={rx.toFixed(1)}
              onChange={(e) => {
                const newRotation = parseFloat(e.target.value) || 0;
                updateRotation(newRotation);
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
            <span className="text-[16px] font-bold w-[80px]">Scale</span>
          </div>
          <div className="flex">
            <input
              min={0}
              max={5}
              type="number"
              step={0.1}
              placeholder="scale"
              className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px] text-center pl-[7px] pr-[10px]"
              value={scale.toFixed(1)}
              onChange={(e) => {
                const newScale = parseFloat(e.target.value) || 0;
                updateScale(newScale);
              }}
              onBlur={updateFinish}
            />
          </div>
          <Slider
            min={0}
            max={5}
            styles={{
              handle: handleStyle,
              track: trackStyle,
              rail: railStyle,
            }}
            style={{ width: "130px" }}
            className="ml-6"
            value={scale}
            onChange={updateScale}
          />
        </div>
      </div>
    )
  );
};

export default ShowcaseUnityUISetting;
