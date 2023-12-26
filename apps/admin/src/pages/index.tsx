import useAuthCheck from "hooks/useAuthCheck";

const Index = () => {
  // たぶん、各ページでやる確認する必要がある
  useAuthCheck();

  return <div>Admin Page</div>;
};

export default Index;
