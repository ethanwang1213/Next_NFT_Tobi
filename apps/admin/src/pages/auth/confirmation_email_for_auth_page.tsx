import { useRouter } from "next/router";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";

const ConfirmationEmailForAuthPage = () => {
  const router = useRouter();
  return (
    <ConfirmationSent onClickBack={() => router.push("/authentication")} />
  );
};

export default ConfirmationEmailForAuthPage;
