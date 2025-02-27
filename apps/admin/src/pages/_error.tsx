import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import Error401 from "ui/templates/admin/error/error_401";
import Error403 from "ui/templates/admin/error/error_403";
import Error404 from "ui/templates/admin/error/error_404";
import Error500 from "ui/templates/admin/error/error_500";
import Error503 from "ui/templates/admin/error/error_503";
import Error504 from "ui/templates/admin/error/error_504";
import Loading from "ui/atoms/Loading";

interface ErrorProps {
  statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
  const [ErrorPageComponent, setErrorPageComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (statusCode) {
      case 401:
        setErrorPageComponent(<Error401 />);
        break;
      case 403:
        setErrorPageComponent(<Error403 />);
        break;
      case 404:
        setErrorPageComponent(<Error404 />);
        break;
      case 500:
        setErrorPageComponent(<Error500 />);
        break;
      case 503:
        setErrorPageComponent(<Error503 />);
        break;
      case 504:
        setErrorPageComponent(<Error504 />);
        break;
      default:
        setErrorPageComponent(<Error404 />); 
    }
  }, [statusCode]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {ErrorPageComponent ||  <dialog className="modal">
      <div className="bg-transparent">
        <Loading className="text-primary" />
      </div>
    </dialog>}
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  return { statusCode };
};

export default ErrorPage;
