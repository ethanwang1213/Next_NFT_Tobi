import { AuthProvider } from "contexts/AdminAuthProvider";
import { ReactNode } from "react";
import FontLoader from "ui/atoms/FontLoader";
import AdminHeader from "ui/templates/AdminHeader";
import AdminNavbar from "ui/templates/AdminNavbar";

type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <>
      <AdminHeader />
      <FontLoader />
      <AuthProvider>
        <AdminNavbar />
        {children}
      </AuthProvider>
    </>
  );
};

export default AdminLayout;
