import { useMemo } from "react";
import { menuItem } from "./assets/menuItems";
import { useLocatingAcrossBasePath } from "../../hooks/useLocatingAcrossBasePath";
import { useShowBurger } from "../../contexts/menu/showBurger";

type Props = {
  initHomeStates?: () => void;
};

/**
 * テキストのメニュー項目を表示するコンポーネント
 * @param param0
 * @returns
 */
const TextMenuItems: React.FC<Props> = ({ initHomeStates }) => {
  const { setIsMenuOpen } = useShowBurger();
  const { pushLocation } = useLocatingAcrossBasePath();

  const menu = useMemo(
    () =>
      menuItem.map((item) => {
        if (item.menu) {
          return (
            <div key={item.name} className="pointer-events-none">
              {item.click ? (
                <button
                  onClick={async () => {
                    await pushLocation(item.link);
                    setIsMenuOpen(false);
                    if (item.name !== "HOME" && !!initHomeStates) {
                      initHomeStates();
                    }
                  }}
                  className="btn btn-ghost hover:bg-black/20 justify-start px-4 
                    font-['tachyon'] text-[16px] sm:text-2xl font-normal 
                    min-h-[2px] h-[30px] sm:h-[48px] pointer-events-auto"
                >
                  {item.name}
                </button>
              ) : (
                <p
                  className="btn btn-ghost btn-disabled bg-transparent justify-start px-4 
                    font-['tachyon'] text-[16px] sm:text-2xl font-normal text-slate-500 
                    min-h-[2px] h-[30px] sm:h-[48px] pointer-events-auto "
                >
                  {item.name}
                </p>
              )}
            </div>
          );
        }
        return null;
      }),
    [menuItem]
  );

  return <>{menu}</>;
};

export default TextMenuItems;
