import "react-toastify/dist/ReactToastify.css";

const ShowcaseUnityUISetting = () => {
  return (
    <div className="flex flex-col h-[192px] bg-[#717171] w-full rounded-t-2xl shadow-xl pl-12 pr-12 pt-8 pb-8 gap-4">
      <div className="flex items-center h-8">
        <span className="text-xl font-bold w-[120px]">Position</span>
        <div className="flex gap-6">
          <input
            type="text"
            placeholder="x"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="y"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="z"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
        </div>
      </div>
      <div className="flex items-center h-8">
        <span className="text-xl font-bold w-[120px]">Rotation</span>
        <div className="flex gap-6">
          <input
            type="text"
            placeholder="x"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="y"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
          <input
            type="text"
            placeholder="z"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[10px] rounded-[5px]"
          />
        </div>
      </div>
      <div className="flex items-center h-8">
        <span className="text-xl font-bold w-[120px]">Scale</span>
        <div className="flex gap-6 items-center">
          <input
            type="text"
            placeholder="scale"
            className="input input-bordered max-w-xs w-20 h-8 bg-[#C2C2C2] text-[#FCFCFC] text-[16px] rounded-[5px] text-right pl-[7px] pr-[10px]"
            defaultValue={"1.0"}
          />
          <input
            type="range"
            min={0}
            max="100"
            defaultValue="40"
            className="range range-sm range-success bg-[#565656]"
          />
        </div>
      </div>
    </div>
  );
};

export default ShowcaseUnityUISetting;
