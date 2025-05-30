import PageTitle from ".";

type Props = {
  isShown: boolean;
};

/**
 * settingページのタイトルを表示するコンポーネント
 * @param param0
 * @returns
 */
const SettingPageTitle: React.FC<Props> = ({ isShown }) => {
  return (
    <div
      className="grid content-center leading-[48px] sm:leading-[84px]
                -mx-4 mb-0 h-[18%] min-h-[18%] sm:h-[214px] sm:min-h-[214px]"
    >
      <PageTitle isShown={isShown} title="SETTINGS" />
    </div>
  );
};

export default SettingPageTitle;
