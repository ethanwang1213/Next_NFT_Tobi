import BackLink from "./BackLink";

const BackLinkBlock = ({
  title,
  fontSize,
  visible,
  onClickBack,
}: {
  title: string;
  fontSize: "tiny" | "small" | "medium";
  visible: boolean;
  onClickBack?: () => void;
}) => {
  const fontSizes = {
    tiny: "text-[20px]",
    small: "text-[24px]",
    medium: "text-[32px]",
  };
  return (
    <div className={"flex flex-row"}>
      <BackLink visible={visible} onClickBack={onClickBack} />
      <div
        className={`w-full text-center ${fontSizes[fontSize]} font-bold text-neutral-main`}
      >
        {title}
      </div>
    </div>
  );
};

export default BackLinkBlock;
