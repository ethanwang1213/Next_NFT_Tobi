import { useDebug } from "@/contexts/DebugProvider";

// Debug用：画面上部に表示するテキスト
// デバッグモードの時のみ表示される
const DebugText: React.FC = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_DEBUG_MODE! && (
        <div
          className="absolute top-[3%] w-full flex justify-center"
        >
          <p className="text-error font-bold text-3xl">※DEBUG MODE※</p>
        </div>
      )}
    </>
  );
};

export default DebugText;
