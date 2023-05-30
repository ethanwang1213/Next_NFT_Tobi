import TBRLogo from '@/../public/logo/tbr-logo-w.svg';
import Link from 'next/link';

const LogoHeader = () => (
  <div className="flex h-[6%]">
    <div className="pl-4 pt-4 w-full">
      <div className="flex text-white h-full flex justify-start">
        <Link href={"/"} className="w-[168.9px] h-[41.52px]">
          <TBRLogo />
        </Link>
      </div>
    </div>
    <div className="flex-grow" />
  </div>
);
export default LogoHeader;
