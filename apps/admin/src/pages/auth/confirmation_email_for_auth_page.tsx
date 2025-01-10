import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import ConfirmationSent from "ui/templates/admin/ConfirmationSent";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const ConfirmationEmailForAuthPage = () => {
  const router = useRouter();
  return (
    <ConfirmationSent onClickBack={() => router.push("/authentication")} />
  );
};

export default ConfirmationEmailForAuthPage;
