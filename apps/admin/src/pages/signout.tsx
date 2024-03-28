import { useAuth } from "contexts/AdminAuthProvider";
import { useEffect } from "react";
import Loading from "ui/atoms/Loading";

const Index = () => {
  const { user, signOut } = useAuth();
  useEffect(() => {
    signOut();
  }, []);

  if (!user) {
    return (
      <div className={"h-[100dvh] flex justify-center"}>
        <Loading />
      </div>
    );
  }

  return <div>Admin Page</div>;
};

export default Index;
