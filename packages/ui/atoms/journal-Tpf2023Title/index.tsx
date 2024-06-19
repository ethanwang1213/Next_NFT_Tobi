import { TitleHr } from "./journal-TitleHr";

/**
 * スタンプラリーのタイトルを表示するコンポーネント
 * @returns {ReactElement} The `StampRallyTitle` component
 */
export const Tpf2023Title: React.FC = () => {
  return (
    <>
      <TitleHr />
      <div className="mt-3 sm:mt-4 mb-3 sm:mb-5">
        <p className="text-xs sm:text-xl font-bold">11.3 ~ 12.3</p>
        <h2
          className="text-[26px] sm:text-[48px] font-bold 
        drop-shadow-[0_4px_2px_rgba(117,58,0,0.4)]
        sm:drop-shadow-[0_6px_2px_rgba(117,58,0,0.4)]"
        >
          TOBIRAPOLIS FESTIVAL
        </h2>
        <p className="mt-0 sm:mt-0 text-[0.65rem] sm:text-base font-bold">
          TOBIRAPOLIS祭の各出展に参加して合言葉を集めよう
        </p>
      </div>
      <TitleHr />
    </>
  );
};
