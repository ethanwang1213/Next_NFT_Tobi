import { useAuth } from "contexts/AdminAuthProvider";
import { useNavbar } from "contexts/AdminNavbarProvider";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
                alt={""}
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
            onClick={signOut}
          ></ImageIconButton>
        </li>
      </ul>
    </details>
  );
};

export default Navbar;
