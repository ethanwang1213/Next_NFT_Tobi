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
    <NavbarContainer className={"bg-neutral shadow-xl"}>
      <NavbarStart>
        <ImageIconButton
          label={""}
          type={"button"}
          imagePath={"/admin/images/icon/hamburger.svg"}
          alt={"google"}
          buttonClassName={
            "btn-block border-0 w-[35px] bg-neutral hover:bg-neutral"
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
