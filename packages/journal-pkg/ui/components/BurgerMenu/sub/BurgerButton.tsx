import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShowBurger } from "journal-pkg/contexts/menu/ShowBurger";
import { ServiceName } from "journal-pkg/types";

type Props = {
  serviceName: ServiceName;
  isMenuVisible: boolean;
};

/**
 * バーガーボタンを表示するコンポーネント
 * @returns
 */
export const BurgerButton: React.FC<Props> = ({
  serviceName,
  isMenuVisible,
}) => {
  const { showBurger, isMenuOpen, setIsMenuOpen } = useShowBurger();

  const handleClick = () => {
    if (!isMenuVisible) {
      setIsMenuOpen(true);
    }
  };

  const textColor = () => {
    switch (serviceName) {
      case "journal":
        return " text-amber-950";
      case "web":
        return " text-white mix-blend-difference";
    }
  };

  return (
    <>
      {showBurger && !isMenuOpen && (
        <button
          className={`min-h-[48px] w-[48px] sm:w-[62px] h-[48px] sm:h-[62px] 
            btn btn-circle btn-ghost 
            text-[26px] sm:text-[32px] ${textColor()}`}
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={faBars}
            className="w-full max-h-full h-[100px] w-[32px] h-[32px]"
          />
        </button>
      )}
    </>
  );
};
