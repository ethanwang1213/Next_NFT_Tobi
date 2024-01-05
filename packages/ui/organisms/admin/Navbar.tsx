import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";
import TransitionButton from "ui/atoms/TransitionButton";
const Navbar = () => {
  return (
    <NavbarContainer className={"bg-neutral shadow-xl"}>
      <NavbarStart>
        {/* TODO: 実際はロゴ画像が来る */}
        <span className="text-xl">Tobiratory</span>
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
