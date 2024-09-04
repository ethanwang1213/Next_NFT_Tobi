import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  url: string;
};

const ColorizedSvg = ({ url, ...props }: Props) => {
  return (
    <div
      style={{
        WebkitMaskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
      {...props}
    />
  );
};

export default ColorizedSvg;
