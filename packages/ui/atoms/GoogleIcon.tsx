import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  alt?: string;
  className?: string;
  disabled?: boolean;
};

const GoogleIcon = ({ alt, className, disabled, ...props }: Props) => {
  return (
    <Image
      alt={alt ?? "google"}
      src="/admin/images/icon/google.svg"
      className={`${className} ${disabled ? "grayscale" : ""}`}
      {...props}
    />
  );
};

export default GoogleIcon;
