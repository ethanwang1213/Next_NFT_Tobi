import Image from "next/image";
import { ReactNode } from "react";
import BackLink from "ui/organisms/admin/BackLink";

export const Position = {
  Top: 0,
  Middle: 1,
} as const;
type Position = (typeof Position)[keyof typeof Position];

const ReauthTemplate = ({
  position,
  children,
  onClickBack,
}: {
  position: Position;
  children: ReactNode;
  onClickBack: () => void;
}) => {
  const marginTop = position === Position.Middle ? "mt-[234px]" : "";
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full">
        <BackLink onClickBack={onClickBack} />
      </div>
      <Image
        src={"/admin/images/tobiratory-name-logo.svg"}
        alt={"tobiratory logo"}
        width={450}
        height={96}
        className={marginTop}
      />
      {children}
    </div>
  );
};

export default ReauthTemplate;
