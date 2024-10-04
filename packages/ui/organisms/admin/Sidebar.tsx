"use client";

import config from "admin/tailwind.config";
import clsx from "clsx";
import { useNavbar } from "contexts/AdminNavbarProvider";
import { gsap, Power2 } from "gsap";
import { useWindowSize } from "hooks/useWindowSize/useWindowSize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useUpdatedSidebarItems } from "../../components/BurgerMenu/assets/SidebarItems";

type Props = {
  children: ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const menuMinWidth = 60;
  const menuMaxWidth = 230;
  const tabletMenuMaxWidth = 165;
  const screensMd = parseInt(config.theme.screens.md);

  const resizedBefore = useRef<boolean>(false);
  const prevDisplayWidth = useRef<number>(0);
  const [expand, setExpand] = useState(true);

  const { displayWidth } = useWindowSize();
  const { clickedBefore, menuStatus } = useNavbar();

  const itemWidth = displayWidth > 768 ? menuMaxWidth : tabletMenuMaxWidth;

  const pathname = usePathname();

  const shouldTriggerResize = useCallback(() => {
    const hasCrossedThreshold =
      (prevDisplayWidth.current < screensMd && displayWidth >= screensMd) ||
      (prevDisplayWidth.current >= screensMd && displayWidth < screensMd);

    prevDisplayWidth.current = displayWidth;
    return hasCrossedThreshold;
  }, [displayWidth, screensMd]);

  // Set initial expand state
  useEffect(() => {
    setExpand(window.innerWidth >= screensMd);
  }, [screensMd]);

  // Animate menu width on expand state change
  useEffect(() => {
    if (!resizedBefore.current && !clickedBefore) {
      return;
    }

    const drawerSide = ".drawer-side";
    const animationConfig = {
      duration: 0.4,
      ease: Power2.easeOut,
    };

    if (expand) {
      gsap.to(drawerSide, {
        width: displayWidth > 768 ? menuMaxWidth : tabletMenuMaxWidth,
        ...animationConfig,
      });
    } else {
      gsap.to(drawerSide, {
        width: menuMinWidth,
        ...animationConfig,
      });
    }
  }, [expand, displayWidth, clickedBefore]);

  // Toggle expand state on menuStatus change
  useEffect(() => {
    if (!clickedBefore) return;

    setExpand((e) => !e);
  }, [clickedBefore, menuStatus]);

  // Handle window resize with optimized checks
  useEffect(() => {
    if (displayWidth === 0 || !shouldTriggerResize()) return;

    if (displayWidth >= screensMd) {
      setExpand(true);
    } else {
      setExpand(false);
    }

    resizedBefore.current = true;
  }, [displayWidth, screensMd, shouldTriggerResize]);

  const normalIconColor = "inactive";
  const normalTextColor = "inactive";
  const selectedColor = "primary";

  const items = useUpdatedSidebarItems();

  return (
    <div className="drawer drawer-open flex-1">
      {/* The className not used during the initial rendering cannot be applied later. */}
      {/* Therefore, any className intended for later use should be added to this className. */}
      <div className="bg-primary bg-inactive text-inactive hidden"></div>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side border-r-base-content border-r-[0.5px] h-full sm:!block !hidden">
        <ul className="pt-[17px]">
          {items
            .filter((item) => item.visible)
            .map((item, index) => (
              <li
                key={index}
                className="mb-[3px] text-base-content"
                style={{
                  width: expand ? itemWidth : menuMinWidth,
                }}
              >
                <Link
                  href={item.href}
                  className={clsx(
                    "btn-block btn-square bg-base-100 hover:bg-hover-item pl-[14px] gap-4 flex flex-row items-center",
                    "rounded-none border-0 border-l-[4px]",
                    pathname.split("/")[1] === item.href.split("/")[1]
                      ? `border-l-active hover:border-l-active text-${selectedColor}`
                      : `border-l-base-100 hover:border-l-hover-item text-${normalTextColor}`,
                  )}
                >
                  <div
                    className={clsx(
                      "w-6 h-6 aspect-square",
                      pathname.split("/")[1] === item.href.split("/")[1]
                        ? `bg-${selectedColor}`
                        : `bg-${normalIconColor}`,
                      "flex-shrink-0",
                    )}
                    style={{
                      WebkitMaskImage: `url(${item.icon})`,
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  ></div>
                  <div
                    className={clsx(
                      "text-[15px] font-medium",
                      expand ? "inline" : "hidden",
                    )}
                  >
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
