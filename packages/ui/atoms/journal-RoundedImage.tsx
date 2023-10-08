import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export const RoundedImage: React.FC<Props> = ({ src, alt }) => {
  return (
    <div
      className="h-full aspect-square relative rounded-full 
        bg-white text-xs sm:text-base"
    >
      <Image src={src} alt={alt} width={105} height={105} />
    </div>
  );
};
