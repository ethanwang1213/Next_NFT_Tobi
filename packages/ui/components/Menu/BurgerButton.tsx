import { useShowBurger } from "../../contexts/menu/showBurger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

/**
 * バーガーボタンを表示するコンポーネント
 * @returns
 */
const BurgerButton: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useShowBurger();

  const toggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <button
      className="min-h-[48px] w-[48px] sm:w-[62px] h-[48px] sm:h-[62px] 
        btn btn-circle btn-ghost bg-black 
        text-[26px] text-white sm:text-[32px] 
        mix-blend-difference"
      onClick={toggle}
    >
      <FontAwesomeIcon
        icon={faBars}
        className="w-full max-h-full h-[100px] w-[32px] h-[32px]"
      />
    </button>
  );
};

export default BurgerButton;
