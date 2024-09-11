import { useShowcaseEditUnityContext } from "hooks/useCustomUnityContext";
import { UndoneRedoneResult } from "hooks/useCustomUnityContext/types";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import { ActionType } from "types/unityTypes";

const ShowcaseUnityUISetting = ({ menuShow }: { menuShow: boolean }) => {
  const [scale, setScale] = useState<number>(1.0);
  const [px, setpx] = useState<number>(0);
  const [py, setpy] = useState<number>(0);
  const [rx, setrx] = useState<number>(0);

  const handleAction = (
    actionType: ActionType,
    text: string,
    result: UndoneRedoneResult,
  ) => {
    switch (actionType) {
      case 2:
        setpx(result.item.position.x);
        setpy(result.item.position.y);
        break;
      case 3:
        setrx(result.item.rotation.x);
        break;
      case 4:
        setScale(result.item.scale);
        break;
      default:
    }
  };

  const {} = useShowcaseEditUnityContext({
    onActionRedone: handleAction,
    onActionUndone: handleAction,
  });

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
              type="text"
              placeholder="x"
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
              value={px === 0 ? "" : px.toFixed(1)}
            />
            <input
              type="text"
              placeholder="y"
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
              value={py === 0 ? "" : py.toFixed(1)}
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
              type="text"
              placeholder="x"
              className="input input-bordered max-w-xs w-24 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
              value={rx === 0 ? "" : rx.toFixed(1)}
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
              type="text"
              placeholder="scale"
              className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[16px] rounded-[5px] text-right pl-[7px] pr-[10px]"
              value={scale.toFixed(1)}
            />
          </div>
          <Slider
            min={0}
            max={10}
            styles={{
              handle: handleStyle,
              track: trackStyle,
              rail: railStyle,
            }}
            style={{ width: "130px" }}
            className="ml-6"
            value={scale}
            onChange={(value: number) => {
              setScale(value);
            }}
          />
        </div>
      </div>
    )
  );
};

export default ShowcaseUnityUISetting;
