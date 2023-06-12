import useWindowSize from "@/hooks/useWindowSize";
import { ReactNode } from "react";
import ArrowBackButton from "../global/ArrowBackButton";
import LogoHeader from "../global/LogoHeader";

type Props = {
  title: ReactNode;
};

const ContactHeader: React.FC<Props> = ({ title }) => {
  const { isWide } = useWindowSize();

  return (
    <>
      <LogoHeader />
      <div className="contact-header-container-inner">
        <div className="flex">
          <div className="contact-header-arrow-container">
            {!isWide && <ArrowBackButton />}
          </div>
          <p className="contact-header-text">{title}</p>
        </div>
      </div>
    </>
  );
};

export default ContactHeader;
