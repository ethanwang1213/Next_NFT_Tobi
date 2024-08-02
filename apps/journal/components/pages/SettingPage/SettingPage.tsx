import { useAuth } from "journal-pkg/contexts/journal-AuthProvider";
import { useEffect } from "react";
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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return pageNum % 2 === 0 ? <SettingPage0 /> : <div />;
};

export default SettingPage;
