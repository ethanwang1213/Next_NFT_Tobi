import { useCanvasDprContext } from "ui/contexts/canvasDprContext";
import { round } from "lodash";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SliderIcon from "../../../../../public/menu/resolution/slider_TOBIRAPOLIS.svg";
import { useShowBurger } from "ui/contexts/menu/showBurger";

/**
 * WebGLのdpr設定を表示するコンポーネント
 * @returns
 */
const DprController: React.FC = () => {
  const { setDpr, isAutoAdjustMode, setIsAutoAdjustMode, monitorFactor } =
    useCanvasDprContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckId, setIsCheckId] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);
  const { showBurger, isMenuOpen } = useShowBurger();
  // 外部クリックでdpr設定を閉じるためのref
  const containerRef = useRef<HTMLDivElement>(null);

  // 初期化
  useEffect(() => {
    // setDpr(1);
    setIsAutoAdjustMode(true);
    setIsCheckId(4);
  }, []);

  // autoモードでmonitorFactorによる調整値を設定
  useEffect(() => {
    if (!isAutoAdjustMode) return;
    const minDpr = 0.5;
    const maxDpr = 2.0;
    setDpr(round(minDpr + (maxDpr - minDpr) * monitorFactor, 1));
  }, [monitorFactor, isAutoAdjustMode]);

  useEffect(() => {
    if (!showBurger) {
      setIsOpen(false);
    }
  }, [showBurger]);

  // 固定値でdprを設定
  const setManual = (id: number, newDpr: number) => {
    setIsCheckId(id);
    setDpr(newDpr);
    setIsAutoAdjustMode(false);
    setIsOpen(false);
  };

  // パフォーマンスに応じて自動でdprを設定
  const setAuto = () => {
    setIsCheckId(4);
    setIsAutoAdjustMode(true);
    setIsOpen(false);
  };

  // 外部クリックでdpr設定を閉じる
  useEffect(() => {
    if (!containerRef.current) return;

    const handleOuterTagClick = (ev: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(ev.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOuterTagClick);
    return () => document.removeEventListener("click", handleOuterTagClick);
  }, [containerRef.current, isOpen]);

  return (
    <>
      {/** このdivは必要。無いとレイアウトが崩れる */}
      <div ref={containerRef}>
        {showBurger && !isMenuOpen && (
          <div className="dropdown dropdown-end dropdown-open font-tsukub-400">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle 
                  min-h-[48px] w-[48px] h-[48px] sm:w-[62px] sm:h-[62px] 
                  text-white px-3 sm:px-4 text-[20px] mix-blend-difference"
              onClick={(ev) => {
                ev.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <SliderIcon className="w-full h-full" />
            </button>
            <div
              ref={dropRef}
              tabIndex={0}
              className={
                "dropdown-content  p-2 shadow bg-base-100 rounded-box w-52 z-10" +
                (isOpen ? "" : " hidden")
              }
            >
              <p className="pl-2 text-sm">画質設定：</p>
              <ul className="menu">
                <li onClick={() => setManual(0, 0.5)}>
                  <div>
                    {isCheckId === 0 && <FontAwesomeIcon icon={faCheck} />}
                    <a>{"低"}</a>
                  </div>
                </li>
                <li onClick={() => setManual(1, 1.0)}>
                  <div>
                    {isCheckId === 1 && <FontAwesomeIcon icon={faCheck} />}
                    <a>{"中"}</a>
                  </div>
                </li>
                <li onClick={() => setManual(2, 1.5)}>
                  <div>
                    {isCheckId === 2 && <FontAwesomeIcon icon={faCheck} />}
                    <a>{"高"}</a>
                  </div>
                </li>
                <li onClick={() => setManual(3, 2.0)}>
                  <div>
                    {isCheckId === 3 && <FontAwesomeIcon icon={faCheck} />}
                    <a>{"最高"}</a>
                  </div>
                </li>
                <li onClick={() => setAuto()} className="flex">
                  <div>
                    {isCheckId === 4 && <FontAwesomeIcon icon={faCheck} />}
                    <a>{"自動調整"}</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DprController;
