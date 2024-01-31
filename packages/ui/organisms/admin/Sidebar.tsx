"use client";

import config from "admin/tailwind.config";
import clsx from "clsx";
import { useNavbar } from "contexts/AdminNavbarProvider";
import { useWindowSize } from "hooks/useWindowSize/useWindowSize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const menuMinWidth = 90;
  const menuMaxWidth = 256;
  const screensMd = parseInt(config.theme.screens.md);

  const [expand, setExpand] = useState(true);

  const { displayWidth } = useWindowSize();
  const { clickedMenu, menuStatus } = useNavbar();

  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth < screensMd) setExpand(false);
    else setExpand(true);
  }, [displayWidth]);

  const normalIconColor = "non-active";
  const normalTextColor = "base-content";
  const selectedColor = "primary";

  const items = [
    {
      name: "Tobiratory Creator Programに参加",
      icon: "/admin/images/icon/tobiratory.svg",
      href: "/apply",
    },
    {
      name: "ワークスペース",
      icon: "/admin/images/icon/workspace.svg",
      href: "/workspace",
    },
    {
      name: "アイテム管理",
      icon: "/admin/images/icon/tag.svg",
      href: "/items",
    },
    {
      name: "コンテンツ管理",
      icon: "/admin/images/icon/contents.svg",
      href: "/contents",
    },
    {
      name: "ギフト受け取り設定",
      icon: "/admin/images/icon/gift.svg",
      href: "/gift",
    },
    {
      name: "SAIDAN/SHOWCASE",
      icon: "/admin/images/icon/saidan.svg",
      href: "/saidan",
    },
    {
      name: "アカウントの設定",
      icon: "/admin/images/icon/account.svg",
      href: "/account",
    },
  ];

  console.log("sidebar is rendered, menuStatus:", menuStatus, "expand", expand);
  return (
    <div className="drawer drawer-open flex-1">
      <div className="bg-primary bg-non-active hidden"></div>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side border-r-base-content border-r-[0.5px] h-full">
        <ul className="pt-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="mb-1 text-base-content"
              style={{
                width: menuStatus && expand ? menuMaxWidth : menuMinWidth,
              }}
            >
              <Link
                href={item.href}
                className={clsx(
                  "btn-block btn-square bg-base-100 hover:bg-base-100 pl-6 gap-4 flex flex-row items-center",
                  "rounded-none border-0 border-l-[12px]",
                  pathname === item.href
                    ? `border-l-active hover:border-l-active text-${selectedColor}`
                    : `border-l-base-100 hover:border-l-base-100 text-${normalTextColor}`,
                )}
              >
                <div
                  className={clsx(
                    "w-6 h-6 aspect-square",
                    pathname === item.href
                      ? `bg-${selectedColor}`
                      : `bg-${normalIconColor}`,
                  )}
                  style={{
                    WebkitMaskImage: `url(${item.icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    WebkitMaskSize: "contain",
                  }}
                ></div>
                <div
                  className={clsx(
                    "text-[15px] font-normal",
                    menuStatus && expand ? "inline" : "hidden",
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
