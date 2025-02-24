import Image from "next/image";
import { useState } from "react";

type InfoTooltipProps = {
  Tooltiptext: string;
  className?: string;
};

const InfoTooltip = ({ Tooltiptext, className }: InfoTooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex inline items-center">
      <Image
        src="/admin/images/info-icon-2.svg"
        width={16}
        height={16}
        alt="information"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && (
        <span
          className={`absolute left-[16px] ml-2 text-center px-2 py-2 z-10 border border-gray-400 rounded-lg bg-white text-[#1779DE] text-[12px] ${
            className || ""
          }`}
        >
          {Tooltiptext}
        </span>
      )}
    </div>
  );
};

export default InfoTooltip;
