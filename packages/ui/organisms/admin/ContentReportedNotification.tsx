import Link from "next/link";
import React from "react";
import Button from "ui/atoms/Button";

interface ContentReportedNotificationProps {
  onButtonClick: () => void;
}

const ContentReportedNotification: React.FC<
  ContentReportedNotificationProps
> = ({ onButtonClick }) => {
  return (
    <div className="mt-10 px-20">
      <div className="py-[37px] px-[32px] bg-[#FF4747] mx-auto rounded-[20px] font-sans">
        <div className="text-[#fff] border-l-[3px] border-[#fff] pl-4">
          <p className="text-[24px] font-semibold">
            Your content has been reported.
          </p>
          <p className="text-[14px] my-6 font-medium">
            Your content has been temporarily frozen due to a reported issue
            with your content.
            <br />
            For more details, please contact us at:
            <Link href="#"> TCP-support@tobiratory.com</Link>
          </p>
          <Button
            className="px-3 py-4 rounded-[8px] bg-[#fff] text-[#717171] font-[13px] font-medium"
            onClick={onButtonClick}
          >
            Submit additional documentation here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentReportedNotification;
