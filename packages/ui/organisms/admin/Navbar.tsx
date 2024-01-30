import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react";
import ImageIconButton from "ui/atoms/ImageIconButton";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";

const logoWidth = 135.68;
const logoHeight = 32;

const Navbar = () => {
  return (
    <NavbarContainer className={"shadow-[0px_1px_10px_0px_rgba(0,0,0,0.20)]"}>
      <NavbarStart>
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
      <ImageIconButton
        label={""}
        type={"button"}
        imagePath={"/admin/images/icon/hamburger.svg"}
        alt={"toggle menu"}
        buttonClassName={
          "btn-block bg-ghost bg-base-100 hover:bg-base-100 border-0 w-[35px] h-[25px]"
        }
        iconClassName={"relative h-[50%] aspect-square"}
        onClick={onClickMenu}
      />
      <Image
        src={"/admin/images/logo.svg"}
        alt={"logo"}
        priority={true}
        width={logoWidth}
        height={logoHeight}
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
      <details ref={userProfileIconRef} className="dropdown dropdown-end">
        <summary className={"btn bg-base-100 hover:bg-base-100 border-0"}>
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
          className="dropdown-content z-[1] p-4 shadow-xl bg-base-100 rounded-box w-[235px] mt-2"
        >
          <li>
            <div className="hover:bg-base-100 flex flex-row items-center">
              <div>
                <Image
                  src="/admin/images/icon/profile.svg"
                  alt={"profile image"}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col ml-2 text-base-200-content">
                <div className={"text-[15px]"}>IP NAME</div>
                <div className={"text-[10px]"}>UID：123456789101112</div>
              </div>
            </div>
          </li>
          <li>
            <ImageIconButton
              label={"Sign Out"}
              type={"button"}
              imagePath={"/admin/images/icon/signout.svg"}
              width={31.25}
              height={28}
              buttonClassName={
                "btn-block flex justify-start bg-base-100 hover:bg-base-100 border-0 pl-2 text-[15px] text-base-200-content font-normal"
              }
              iconClassName={"pr-2"}
              onClick={() => {
                signOutModalRef.current.showModal();
                console.log(signOutModalRef.current.getAttributeNames());
              }}
            ></ImageIconButton>
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
