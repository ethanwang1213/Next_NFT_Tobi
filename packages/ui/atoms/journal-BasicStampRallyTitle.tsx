import React from "react";
import TobirapolisIcon from "../../../apps/journal/public/images/icon/tobirapolis_icon.svg";

export const BasicStampRallyTitle: React.FC = React.memo(() => {
  return (
    <div className="flex">
      <div className="py-2">
        <TobirapolisIcon />
      </div>
      <div className="pl-3 sm:pl-6 pt-1">
        <h3 className="text-dark-brown text-[24px] sm:text-[32px] font-bold">Enter the Keyword</h3>
        <p className="text-primary text-[10px] sm:text-xs font-bold">
          If you enter the correct keyword, it will be recorded in your Journal.
        </p>
      </div>
    </div>
  );
});
