import { BookContext } from "@/contexts/BookContextProvider";
import { useSoundConfig } from "contexts/journal-SoundConfigProvider";
import { useContext } from "react";

/**
 * サウンドのオンオフを切り替えるトグルボタン
 * 付箋をめくる時に鳴る音などをオンオフする
 */
const SoundToggle: React.FC = () => {
  const { isMute } = useSoundConfig();

  return (
    <div className="text-amber-950 text-center">
      <label
        className="swap btn btn-ghost btn-circle 
          min-h-[48px] w-[48px] h-[48px] sm:w-[62px] sm:h-[62px] "
      >
        <input
          type="checkbox"
          checked={!isMute.current}
          onChange={() => isMute.set(!isMute.current)}
        />
        <svg
          className="swap-on fill-current w-[30px] sm:w-[40px] aspect-square"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
        </svg>

        <svg
          className="swap-off fill-current w-[30px] sm:w-[40px] aspect-square"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
        </svg>
      </label>
    </div>
  );
};

export default SoundToggle;
