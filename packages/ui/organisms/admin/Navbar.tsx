import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";

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
          "btn btn-block bg-ghost bg-base-100 hover:bg-base-100 border-0 w-[35px] min-h-[25px] h-[25px] ml-[18px] p-0"
        }
        onClick={onClickMenu}
      >
        <Image
          src={"/admin/images/icon/hamburger.svg"}
          alt={"toggle menu"}
          priority={true}
          width={35}
          height={25}
        />
      </button>
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
  const { signOut } = useAuth();

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
                <div className={"text-[15px] font-normal"}>IP NAME</div>
                <div className={"text-[10px] font-normal"}>
                  UID：123456789101112
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
                  alt={"Sign Out Button"}
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
                  Sign Out
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
  const { signOut } = useAuth();
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-[437px] rounded-[32px]">
        <div className="flex justify-end mr-[2px] mt-[-2px]">
          <form method={"dialog"}>
            <button className="btn w-[16px] h-[19px] min-h-fit border-0 p-0 bg-base-100 hover:bg-base-100">
              <Image
                src={"/admin/images/icon/close.svg"}
                alt={"close button"}
                width={16}
                height={19}
                className={"border-0 p-0"}
              />
            </button>
          </form>
        </div>
        <div className="text-center text-2xl text-base-200-content font-normal">
          サインアウトしますか?
        </div>
        <Image
          src="/admin/images/icon/profile.svg"
          alt={"profile image"}
          width={153}
          height={153}
          className={"m-auto mt-[30px]"}
        />
        <div className={"text-center mt-[30px] text-2xl text-base-200-content"}>
          Account Name
        </div>
        <div
          className={
            "text-center text-[15px] text-base-200-content font-normal"
          }
        >
          @account_ame
        </div>
        <div className="modal-action justify-center mt-[70px] mb-[33px]">
          <form method="dialog">
            <div className={"flex flex-col justify-center space-y-[26px]"}>
              <button
                onClick={signOut}
                className="btn btn-block w-[268px] h-[56px] rounded-[30px] bg-primary hover:bg-primary text-primary-content text-xl font-semibold"
              >
                サインアウト
              </button>
              <button className="btn btn-block w-[268px] h-[56px] rounded-[30px] border-primary hover:border-primary bg-base-100 hover:bg-base-100 text-primary text-xl font-semibold">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Navbar;
