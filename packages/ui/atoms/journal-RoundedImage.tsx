import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export const RoundedImage: React.FC<Props> = ({ src, alt }) => {
  return (
    <div className="h-full aspect-square relative rounded-full bg-white">
      <Image src={src} alt={alt} />
    </div>
  );
};
