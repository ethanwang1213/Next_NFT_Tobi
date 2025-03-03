import { useEffect, useState } from "react";
import { GetStaticPropsContext } from "next";
import Loading from "ui/atoms/Loading";
import StatusErrors from "ui/templates/admin/StatusErrors";
import { getMessages } from "admin/messages/messages";

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
  const [ErrorPageComponent, setErrorPageComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const status = errorPages[statusCode] || "404";
    setErrorPageComponent(<StatusErrors status={status} />);
  }, [statusCode]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {ErrorPageComponent ? (
        ErrorPageComponent
      ) : (
        <dialog className="modal">
          <div className="bg-transparent">
            <Loading className="text-primary" />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ErrorPage;
