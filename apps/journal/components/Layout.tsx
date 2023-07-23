// 初期化のためにimport
import { app } from "@/firebase/client";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
