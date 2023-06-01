import { BANNER } from "@/constants/saidanConstants";

const ShopBanner = () => (
  <picture className=" col-span-2 grid content-start  w-full aspect-[211.5/100.08]">
    <source srcSet={`${BANNER.pc}`} media="(min-width: 520px)" />
    <img
      className="rounded-xl w-full h-full"
      src={`${BANNER.sp}`}
      alt="banner"
    />
  </picture>
);

export default ShopBanner;
