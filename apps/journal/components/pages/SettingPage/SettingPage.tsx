import SettingPage0 from "./sub/SettingPage0";

type Props = {
  pageNum: number;
};

/**
 * settingページのコンポーネント
 * @param param0
 * @returns
 */
const SettingPage: React.FC<Props> = ({ pageNum }) => {
  return pageNum % 2 === 0 ? <SettingPage0 /> : <div />;
};

export default SettingPage;
