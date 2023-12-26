import useEmailSignIn from "hooks/useEmailSignIn";
import Connecting from "ui/templates/Connecting";

// TODO: メールアドレスを使ってサインインする流れが変更になったので、後で修正する
const Verify = () => {
  useEmailSignIn();

  return <Connecting />;
};

export default Verify;
