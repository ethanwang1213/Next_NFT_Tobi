import React from "react";
import TobirapolisIcon from "../../../apps/journal/public/images/icon/tobirapolis_icon.svg";

export const Tmf2024Title: React.FC = React.memo(() => {
  return (
    <div className="flex">
      <div className="py-2">
        <TobirapolisIcon />
      </div>
      <div className="pl-6 pt-1">
        <h3 className="text-dark-brown text-[32px] font-bold">
          Enter the Keyword
        </h3>
        <p className="text-primary text-xs font-bold">
          If you enter the correct keyword, it will be recorded in your Journal.
        </p>
      </div>
    </div>
  );
});
