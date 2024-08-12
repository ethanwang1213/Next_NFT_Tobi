import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";

const ShowcaseUnityUISetting = () => {
  const [scale, setScale] = useState<number>(0.5);

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
    <div className="flex flex-col h-[192px] bg-[#565656] bg-opacity-75 backdrop-blur-[25px] w-full rounded-3xl shadow-xl pl-12 pr-12 pt-8 pb-8 gap-4">
      <div className="flex items-center h-8">
        <span className="text-[16px] font-bold w-[100px]">Position</span>
        <div className="flex gap-6">
          <input
            type="text"
            placeholder="x"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="y"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="z"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
        </div>
      </div>
      <div className="flex items-center h-8">
        <span className="text-[16px] font-bold w-[100px]">Rotation</span>
        <div className="flex gap-6">
          <input
            type="text"
            placeholder="x"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="y"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="z"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
        </div>
      </div>
      <div className="flex items-center h-8">
        <span className="text-[16px] font-bold w-[100px]">Scale</span>
        <div className="flex gap-6 items-center">
          <input
            type="text"
            placeholder="scale"
            className="input input-bordered max-w-xs w-14 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[16px] rounded-[5px] text-right pl-[7px] pr-[10px]"
            defaultValue={"1.0"} 
          />
        </div>
        <Slider
          min={0}
          max={100}
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
  );
};

export default ShowcaseUnityUISetting;
