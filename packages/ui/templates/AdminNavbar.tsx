import NavbarCenter from "ui/atoms/NavbarCenter";
import NavbarContainer from "ui/atoms/NavbarContainer";
import NavbarEnd from "ui/atoms/NavbarEnd";
import NavbarStart from "ui/atoms/NavbarStart";
import SearchBox from "ui/atoms/SearchBox";
import TransitionButton from "ui/atoms/TransitionButton";

const AdminNavbar = () => {
  return (
    <NavbarContainer className={"bg-neutral shadow-xl"}>
      <NavbarStart>
        {/* TODO: 実際はロゴ画像が来る */}
        <span className="text-xl">Tobiratory</span>
      </NavbarStart>
      <NavbarCenter>
        {/* TODO: 検索するためのコールバックを追加する */}
        <SearchBox
          placeholder={"Tobiratory.com で検索"}
          textFieldClassName={
            "rounded-full w-98 block p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500rounded-full"
          }
          iconClassName={
            "absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          }
        />
      </NavbarCenter>
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

export default AdminNavbar;
