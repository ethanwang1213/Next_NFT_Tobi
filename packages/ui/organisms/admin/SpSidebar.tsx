import clsx from "clsx";
import { useAuth } from "contexts/AdminAuthProvider";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MutableRefObject, useRef } from "react";
import { useUpdatedSidebarItems } from "ui/components/BurgerMenu/assets/SidebarItems";
import AccountConfirmDialog from "./AccountConfirmDialog";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SpSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const signOutModalRef = useRef<HTMLDialogElement>(null);
  const items = useUpdatedSidebarItems();
  const t = useTranslations("TCP");
  const normalIconColor = "inactive";
  const normalTextColor = "inactive";
  const selectedColor = "primary";

  return (
    <div
      className={`absolute z-10 top-[56px] h-full w-full ${
        sidebarOpen
          ? "translate-x-0 duration-300 ease-linear"
          : "-translate-x-full duration-300 ease-linear"
      }`}
      onClick={() => {
        setSidebarOpen(false);
      }}
    >
      <aside
        className={`absolute left-0 z-10 flex h-auto w-full flex-col drop-shadow-3 overflow-y-hidden border-r border-stroke bg-white rounded-tr-md rounded-br-md shadow-lg pb-2 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full duration-300 ease-linear"
        }`}
      >
        <div>
          <div className="flex flex-row items-center pl-[14px] py-6">
            <div>
              <Image
                src="/admin/images/icon/profile.svg"
                alt={"profile image"}
                width={36}
                height={36}
              />
            </div>
            <div className="flex flex-col ml-[12px] text-base-200-content w-[132px]">
              <div className={"text-[15px] font-normal"}>{user.name}</div>
              <div className={"text-[10px] font-normal"}>UID：@{user.uuid}</div>
            </div>
          </div>
          <ul className="border-solid border-[1px] border-gray-300">
            {items
              .filter((item) => item.visible)
              .map((item, index) => (
                <li key={index} className="mb-[3px] text-base-content">
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
                    <div className={clsx("text-[15px] font-medium")}>
                      {item.name}
                    </div>
                  </Link>
                </li>
              ))}
            <li className="mb-[3px] text-base-content">
              <button
                className={
                  "btn-block btn-square bg-base-100 hover:bg-hover-item pl-[14px] gap-4 flex flex-row items-center rounded-none border-0 border-l-[4px] border-l-active hover:border-l-active text-primary"
                }
                onClick={() => {
                  signOutModalRef.current.showModal();
                }}
              >
                <Image
                  src={"/admin/images/icon/signout.svg"}
                  alt={"Logout Button"}
                  width={24}
                  height={24}
                />

                <div className={"w-[132px]"}>
                  <div
                    className={
                      "text-start text-base-content text-[15px] font-normal"
                    }
                  >
                    {t("Logout")}
                  </div>
                </div>
              </button>
            </li>
          </ul>
          <ConfirmSignOutModal dialogRef={signOutModalRef} />
        </div>
      </aside>
    </div>
  );
};

const ConfirmSignOutModal = ({
  dialogRef,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const { signOut, user } = useAuth();
  const t = useTranslations("TCP");
  return (
    <AccountConfirmDialog
      title={t("LogoutPrompt")}
      account={user}
      firstButtonProp={{
        caption: t("Logout"),
        isPrimary: true,
        callback: signOut,
      }}
      secondButtonProp={{ caption: t("Cancel"), isPrimary: false }}
      dialogRef={dialogRef}
    />
  );
};

export default SpSidebar;
