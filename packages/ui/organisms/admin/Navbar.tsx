import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";
import AccountConfirmDialog from "./AccountConfirmDialog";
import LanguageSwitch from "./LanguageSwitch";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  return (
    <NavbarContainer
      className={
        "shadow-[0px_1px_10px_0px_rgba(0,0,0,0.20)] min-h-[56px] h-[56px] p-0 z-20"
      }
    >
      <NavbarStart className={"min-h-[56px] h-[56px]"}>
        <NavbarStartBlock
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </NavbarStart>
      <NavbarEnd>
        <LanguageSwitch />
        <UserMenu />
      </NavbarEnd>
    </NavbarContainer>
  );
};

const NavbarStartBlock = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { onClickMenu } = useNavbar();
  return (
    <>
      <button
        className={
          "btn btn-block bg-inactive hover:bg-inactive border-0 w-[24px] min-h-[24px] h-[24px] ml-[18px] p-0 sm:block hidden"
        }
        onClick={onClickMenu}
        style={{
          WebkitMaskImage: `url(/admin/images/icon/hamburger.svg)`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
        }}
      ></button>
      <button
        aria-controls="sidebar"
        onClick={(e) => {
          e.stopPropagation();
          props.setSidebarOpen(!props.sidebarOpen);
        }}
        className="border-0 w-[20px] h-[20px] ml-[18px] p-0 sm:hidden block z-10"
      >
        <span className="relative block h-full w-full cursor-pointer">
          <span className="du-block absolute right-0 h-full w-full">
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#7A7474] delay-[0] duration-200 ease-in-out ${
                !props.sidebarOpen && "!w-full delay-300"
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#7A7474] delay-150 duration-200 ease-in-out ${
                !props.sidebarOpen && "delay-400 !w-full"
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#7A7474] delay-200 duration-200 ease-in-out ${
                !props.sidebarOpen && "!w-full delay-500"
              }`}
            ></span>
          </span>
          <span className="absolute right-0 h-full w-full rotate-45">
            <span
              className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-[#7A7474] delay-300 duration-200 ease-in-out ${
                !props.sidebarOpen && "!h-0 !delay-[0]"
              }`}
            ></span>
            <span
              className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-[#7A7474] duration-200 ease-in-out ${
                !props.sidebarOpen && "!h-0 !delay-200"
              }`}
            ></span>
          </span>
        </span>
      </button>
      <div className="sm:relative absolute sm:block flex justify-center sm:w-auto w-full">
        <Image
          src={"/admin/images/logo.svg"}
          alt={"logo"}
          priority={true}
          width={135.68}
          height={32}
          className={"sm:ml-[36px]"}
        />
      </div>
    </>
  );
};

const UserMenu = () => {
  const userProfileIconRef = useRef<HTMLDetailsElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const signOutModalRef = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();
  const t = useTranslations("TCP");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        !userProfileIconRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        userProfileIconRef.current.removeAttribute("open");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
      <details
        ref={userProfileIconRef}
        className="dropdown dropdown-end w-[40px] h-[40px] mx-[30px]"
      >
        <summary
          className={
            "btn bg-base-100 hover:bg-base-100 w-[40px] min-h-[40px] h-[40px] border-0 p-0"
          }
        >
          <Image
            src={"/admin/images/icon/profile.svg"}
            alt={"user menu icon"}
            width={40}
            height={40}
            className={""}
          />
        </summary>
        <ul
          ref={menuRef}
          tabIndex={0}
          className="dropdown-content z-[9999] pt-[30px] pr-[20px] pb-[28px] pl-[22px] shadow-xl bg-base-100 rounded-[12px] w-[235px] mt-[3px] mr-[-13px]"
        >
          <li>
            <div className="flex flex-row items-center">
              <div className={"w-[48px]"}>
                <Image
                  src="/admin/images/icon/profile.svg"
                  alt={"profile image"}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col ml-[12px] text-base-200-content w-[132px]">
                <div className={"text-[15px] font-normal"}>{user.name}</div>
                <div className={"text-[10px] font-normal"}>
                  UID：{user.uuid}
                </div>
              </div>
            </div>
          </li>
          <li className={"mt-[26px]"}>
            <button
              className={
                "btn btn-block bg-base-100 hover:bg-base-100 border-0 min-h-[24px] h-[24px] p-0 flex flex-col items-start"
              }
              onClick={() => {
                signOutModalRef.current.showModal();
                console.log(signOutModalRef.current.getAttributeNames());
              }}
            >
              <div className={"w-[48px] flex justify-center"}>
                <Image
                  src={"/admin/images/icon/signout.svg"}
                  alt={"Logout Button"}
                  width={24}
                  height={24}
                />
              </div>
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
      </details>
      <ConfirmSignOutModal dialogRef={signOutModalRef} />
    </>
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

export default Navbar;
