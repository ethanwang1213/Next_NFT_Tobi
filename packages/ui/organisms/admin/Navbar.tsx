import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";
import AccountConfirmDialog from "./AccountConfirmDialog";

const Navbar = () => {
  return (
    <NavbarContainer
      className={
        "shadow-[0px_1px_10px_0px_rgba(0,0,0,0.20)] min-h-[56px] h-[56px] p-0"
      }
    >
      <NavbarStart className={"min-h-[56px] h-[56px]"}>
        <NavbarStartBlock />
      </NavbarStart>
      <NavbarEnd>
        <UserMenu />
      </NavbarEnd>
    </NavbarContainer>
  );
};

const NavbarStartBlock = () => {
  const { onClickMenu } = useNavbar();
  return (
    <>
      <button
        className={
          "btn btn-block bg-inactive hover:bg-inactive border-0 w-[24px] min-h-[24px] h-[24px] ml-[18px] p-0"
        }
        onClick={onClickMenu}
        style={{
          WebkitMaskImage: `url(/admin/images/icon/hamburger.svg)`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
        }}
      ></button>

      <Image
        src={"/admin/images/logo.svg"}
        alt={"logo"}
        priority={true}
        width={135.68}
        height={32}
        className={"ml-[36px]"}
      />
    </>
  );
};

const UserMenu = () => {
  const userProfileIconRef = useRef<HTMLDetailsElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const signOutModalRef = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();

  // Close when clicking outside the dropdown.
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
        className="dropdown dropdown-end w-[40px] h-[40px] mr-[14px]"
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
          className="dropdown-content z-[1] pt-[30px] pr-[20px] pb-[28px] pl-[22px] shadow-xl bg-base-100 rounded-[12px] w-[235px] mt-[3px] mr-[-13px]"
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
                  Logout
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
  return (
    <AccountConfirmDialog
      title="サインアウトしますか?"
      account={user}
      firstButtonProp={{
        caption: "サインアウト",
        isPrimary: true,
        callback: signOut,
      }}
      secondButtonProp={{ caption: "キャンセル", isPrimary: false }}
      dialogRef={dialogRef}
    />
  );
};

export default Navbar;
