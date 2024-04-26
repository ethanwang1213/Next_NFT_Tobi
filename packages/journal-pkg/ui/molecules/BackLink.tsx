import Image from "next/image";

type Props = {
  onClickBack: () => void;
};

const BackLink = ({ onClickBack }: Props) => {
  return (
    <button
      className="btn-link no-underline text-base-content"
      onClick={onClickBack}
    >
      <Image
        src={"/journal/images/icon/left-arrow.svg"}
        alt={"back"}
        width={15}
        height={26}
      />
    </button>
  );
};

export default BackLink;
