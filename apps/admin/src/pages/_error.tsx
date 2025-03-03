import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import StatusErrors from "ui/templates/admin/StatusErrors";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

interface ErrorProps {
  statusCode: number;
}

const errorPages: Record<number, string> = {
  401: "401",
  403: "403",
  404: "404",
  500: "500",
  503: "503",
  504: "504",
};

const ErrorPage = ({ statusCode }: ErrorProps) => {
  const status = errorPages[statusCode] || "404";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <StatusErrors status={status} />
    </div>
  );
};

export default ErrorPage;
