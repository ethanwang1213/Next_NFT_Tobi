import { useNavbar } from "contexts/AdminNavbarProvider";
import Image from "next/image";
import ImageIconButton from "ui/atoms/ImageIconButton";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";
import TransitionButton from "ui/atoms/TransitionButton";

const Navbar = () => {
  const logoWidth = 135.68;
  const logoHeight = 32;
  const { onClickMenu } = useNavbar();
  return (
    <NavbarContainer className={"shadow-[0px_1px_10px_0px_rgba(0,0,0,0.20)]"}>
      <NavbarStart>
        <ImageIconButton
          label={""}
          type={"button"}
          imagePath={"/admin/images/icon/hamburger.svg"}
          alt={"toggle menu"}
          buttonClassName={
            "btn-block bg-base-100 hover:bg-base-100 border-0 w-[35px]"
          }
          iconClassName={"relative h-[50%] aspect-square"}
          onClick={onClickMenu}
        />
        <Image
          src={"/admin/images/logo.svg"}
          alt={""}
          priority={true}
          width={logoWidth}
          height={logoHeight}
        />
      </NavbarStart>
      <NavbarEnd>
        {/* TODO: サインインするとプロフィール画像に変わる */}
        {/* TODO: たぶん、メニューも追加される */}
        <TransitionButton
          label={"Sign in"}
          url={"/signin"}
          className={"btn-primary rounded-full w-40 text-neutral"}
        />
      </NavbarEnd>
    </NavbarContainer>
  );
};

export default Navbar;
