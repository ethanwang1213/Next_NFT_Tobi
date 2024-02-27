import { useShowBurger } from "journal-pkg/contexts/menu/ShowBurger";

/**
 * メニューを閉じるボタン
 * @returns
 */
export const CloseButton: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useShowBurger();

  return (
    <button
      className={`fixed top-6 right-4 z-50 
        btn btn-ghost hover:bg-black/20 
        text-[20px] font-['tachyon'] font-normal text-white sm:text-2xl 
        ${isMenuOpen ? "" : `opacity-0 transition pointer-events-none`}`}
      onClick={() => setIsMenuOpen(false)}
      type="button"
    >
      CLOSE
    </button>
  );
};
