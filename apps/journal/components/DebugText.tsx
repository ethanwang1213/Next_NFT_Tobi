import { useDebug } from "@/contexts/DebugProvider";

// Debug用：画面上部に表示するテキスト
// デバッグモードの時のみ表示される
// クリックするとデバッグ用のmockデータを更新する
const DebugText: React.FC = () => {
  const { shouldRefresh } = useDebug();

  return (
    <>
      {process.env["NEXT_PUBLIC_DEBUG_MODE"] === "true" && (
        <div
          onClick={() => shouldRefresh.set(true)}
          className="absolute top-[3%] w-full flex justify-center pointer-events-none"
        >
          <p className="text-error font-bold text-3xl pointer-events-auto">
            ※DEBUG MODE※
          </p>
        </div>
      )}
    </>
  );
};

export default DebugText;
