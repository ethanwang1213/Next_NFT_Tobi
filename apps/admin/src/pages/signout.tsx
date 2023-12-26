import useSignOut from "hooks/useSignOut";
import SignOut from "ui/templates/SignOut";
const Signout = () => {
  useSignOut();

  return <SignOut />;
};

export default Signout;
