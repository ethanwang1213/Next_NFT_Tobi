import { useRouter } from "next/router";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";

const ComfirmationEmail = () => {
  const router = useRouter();
  return <ConfirmationSent onClickBack={() => router.push("/account")} />;
};

export default ComfirmationEmail;
