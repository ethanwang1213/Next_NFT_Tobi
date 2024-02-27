import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * メニューのSNSやcopyrightを表示するコンポーネント
 * @param param0
 * @returns
 */
export const MenuFooter: React.FC = () => (
  <div
    className="flex flex-col gap-2 sm:gap-3 sm:absolute bottom-0 right-0 
      pl-4 mt-2 sm:p-5 sm:items-end "
  >
    <div
      className="btn btn-circle btn-md p-0 w-8 h-8 sm:w-12 sm:h-12 min-h-[30px] 
        bg-white hover:bg-white/70 rounded-full text-slate-800 text-xl sm:text-3xl "
    >
      <FontAwesomeIcon
        icon={faTwitter}
        onClick={() => window.open("https://twitter.com/tobiratory", "_ blank")}
      />
    </div>
    <small className="text-sm">©Tobiratory</small>
  </div>
);
