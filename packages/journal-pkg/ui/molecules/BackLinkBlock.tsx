import BackLink from "./BackLink";

const BackLinkBlock = ({
  title,
  fontSize,
  visible,
  onClickBack,
}: {
  title: string;
  fontSize: "small" | "medium";
  visible: boolean;
  onClickBack?: () => void;
}) => {
  const fontSizeClass = fontSize === "small" ? "text-[24px]" : "text-[32px]";
  return (
    <div className={"flex flex-row"}>
      <BackLink visible={visible} onClickBack={onClickBack} />
      <div
        className={`w-full text-center ${fontSizeClass} font-bold text-neutral-main`}
      >
        {title}
      </div>
    </div>
  );
};

export default BackLinkBlock;
