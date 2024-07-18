"use client";

import config from "admin/tailwind.config";
import clsx from "clsx";
import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import { gsap, Power2 } from "gsap";
import { useWindowSize } from "hooks/useWindowSize/useWindowSize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const menuMinWidth = 60;
  const menuMaxWidth = 230;
  const screensMd = parseInt(config.theme.screens.md);

  const { user } = useAuth();
  const resizedBefore = useRef<boolean>(false);
  const [expand, setExpand] = useState(true);

  const { displayWidth } = useWindowSize();
  const { clickedBefore, menuStatus } = useNavbar();

  const pathname = usePathname();

  // set initial expand state
  useEffect(() => {
    if (window.innerWidth < screensMd) setExpand(false);
    else setExpand(true);
  }, [screensMd]);

  // animate menu width on expand state change
  useEffect(() => {
    if (!resizedBefore.current && !clickedBefore) {
      // prevent execution on the initial rendering.
      return;
    } else if (expand) {
      gsap.fromTo(
        ".drawer-side",
        { width: menuMinWidth },
        {
          width: menuMaxWidth,
          duration: 0.4,
          ease: Power2.easeOut,
        },
      );
    } else {
      gsap.fromTo(
        ".drawer-side",
        { width: menuMaxWidth },
        {
          width: menuMinWidth,
          duration: 0.4,
          ease: Power2.easeOut,
        },
      );
    }
  }, [clickedBefore, expand, resizedBefore]);

  // toggle expand state on menuStatus change
  useEffect(() => {
    // prevent execution on the initial rendering.
    if (!clickedBefore) {
      return;
    }

    setExpand((e) => !e);
  }, [clickedBefore, menuStatus]);

  // set expand state on window resize
  useEffect(() => {
    if (displayWidth === 0) {
      // prevent execution on the initial rendering.
      return;
    } else if (displayWidth < screensMd) {
      setExpand(false);
    } else {
      setExpand(true);
    }
    resizedBefore.current = true;
  }, [displayWidth, screensMd]);

  const normalIconColor = "inactive";
  const normalTextColor = "inactive";
  const selectedColor = "primary";

  const items = [
    {
      name: "Tobiratory Creator Program",
      icon: "/admin/images/icon/contents.svg",
      href: "/apply",
      visible: !user.hasBusinessAccount,
    },
    {
      name: "Workspace",
      icon: "/admin/images/icon/workspace.svg",
      href: "/workspace",
      visible: user.hasBusinessAccount,
    },
    {
      name: "Items",
      icon: "/admin/images/icon/tag.svg",
      href: "/items",
      visible: user.hasBusinessAccount,
    },
    {
      name: "Content",
      icon: "/admin/images/icon/contents.svg",
      href: "/contents",
      visible: user.hasBusinessAccount,
    },
    {
      name: "Gift",
      icon: "/admin/images/icon/gift.svg",
      href: "/gift",
      visible: user.hasBusinessAccount,
    },
    {
      name: "Account",
      icon: "/admin/images/icon/account.svg",
      href: "/account",
      visible: true,
    },
  ];

  return (
    <div className="drawer drawer-open flex-1">
      {/* The className not used during the initial rendering cannot be applied later. */}
      {/* Therefore, any className intended for later use should be added to this className. */}
      <div className="bg-primary bg-inactive text-inactive hidden"></div>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side border-r-base-content border-r-[0.5px] h-full">
        <ul className="pt-[17px]">
          {items
            .filter((item) => item.visible)
            .map((item, index) => (
              <li
                key={index}
                className="mb-[3px] text-base-content"
                style={{
                  width: expand ? menuMaxWidth : menuMinWidth,
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
                        "flex-shrink-0"
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
