import config from "admin/tailwind.config";
import { useNavbar } from "contexts/AdminNavbarProvider";
import useMenuClassName from "hooks/useMenuClassName";
import { useWindowSize } from "hooks/useWindowSize/useWindowSize";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "react-use";
import Button from "ui/atoms/Button";

type Props = {
  children: ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const menuMinWidth = 89;
  const menuMaxWidth = 255;
  const screensMd = parseInt(config.theme.screens.md);

  const [menuClassName, menuItemClassName, setMenuWidth] = useMenuClassName(
    menuMinWidth,
    menuMaxWidth,
    screensMd,
  );
  const [selected, setSelected] = useState<number>(0);
  const { displayWidth } = useWindowSize();
  const [,] = useDebounce(
    () => {
      setMenuWidth();
    },
    50,
    [displayWidth],
  );
  const menuRef = useRef<HTMLUListElement>(null);
  const { clickedMenu, menuStatus } = useNavbar();

  useEffect(() => {
    setMenuWidth();
  }, []);

  useEffect(() => {
    // Prevent execution on initial rendering
    if (!clickedMenu) {
      return;
    }
    setMenuWidth(menuRef.current.classList);
  }, [clickedMenu, menuStatus]);

  const buttonBaseClassName =
    "btn-block btn-square bg-neutral hover:bg-neutral pl-2 gap-3 flex flex-row place-content-start content-center rounded-none border-0 border-neutral border-l-8";

  const normalIconColor = "[#B3B3B3]"; // TODO: replace color name
  const normalTextColor = "[#717171]"; // TODO: replace color name
  const selectedColor = "primary";

  // FIXME: Because specifying with className doesn't take effect, use inline styles instead.
  const normalTextColorCode = "#717171";
  const normalIconColorCode = "#B3B3B3";
  const selectedColorCode = "#1779DE";

  const items = [
    { name: "ワークスペース", icon: "/admin/images/icon/workspace.svg" },
    { name: "アイテム管理", icon: "/admin/images/icon/tag.svg" },
    { name: "コンテンツ管理", icon: "/admin/images/icon/contents.svg" },
    { name: "ギフト受け取り設定", icon: "/admin/images/icon/gift.svg" },
    { name: "SAIDAN/SHOWCASE", icon: "/admin/images/icon/saidan.svg" },
    { name: "アカウントの設定", icon: "/admin/images/icon/account.svg" },
  ];

  const getButtonClassName = (index: number) => {
    const className = `${buttonBaseClassName} text-${getTextColor(
      index,
    )} hover:border-neutral`;
    if (selected === index) {
      return `${className} border-l-accent-focus hover:border-l-accent-focus`;
    }
    return className;
  };

  const getIconColor = (index: number) => {
    if (selected === index) {
      return selectedColor;
    }
    return normalIconColor;
  };

  const getIconColorCode = (index: number) => {
    if (selected === index) {
      return selectedColorCode;
    }
    return normalIconColorCode;
  };

  const getTextColor = (index: number) => {
    if (selected === index) {
      return selectedColor;
    }
    return normalTextColor;
  };

  const getTextColorCode = (index: number) => {
    if (selected === index) {
      return selectedColor;
    }
    return normalTextColorCode;
  };

  const getIconClassName = (index: number) => {
    return `relative h-[70%] aspect-square bg-${getIconColor(index)}`;
  };

  return (
    <div className="drawer drawer-open bg-neutral shadow-inner">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side border-r-2">
        <ul
          className={`p-4 ${menuClassName} min-h-full text-base-content flex flex-col`}
          ref={menuRef}
        >
          {items.map((item, index) => (
            <li key={index}>
              <Button
                label={""}
                type={"button"}
                className={getButtonClassName(index)}
                onClick={() => setSelected(index)}
              >
                <div
                  className={getIconClassName(index)}
                  style={{
                    WebkitMaskImage: `url(${item.icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    WebkitMaskSize: "contain",
                    backgroundColor: getIconColorCode(index),
                  }}
                ></div>
                <div
                  className={`${menuItemClassName}`}
                  style={{ color: getTextColorCode(index) }}
                >
                  {item.name}
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
