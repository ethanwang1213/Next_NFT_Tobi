import { useAuth } from "contexts/AdminAuthProvider";
import Loading from "ui/atoms/Loading";

const Index = () => {
  const { user } = useAuth();

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
