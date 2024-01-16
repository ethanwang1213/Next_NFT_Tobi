import useAuthCheck from "hooks/useAuthCheck";
import Loading from "ui/atoms/Loading";

const Index = () => {
  const { isAuthenticated } = useAuthCheck();

  if (!isAuthenticated) {
    return (
      <div className={"h-[100dvh] flex justify-center"}>
        <Loading />
      </div>
    );
  }

  return <div>Admin Page</div>;
};

export default Index;
