import Image from "next/image";
import useSaidanStore from "@/stores/saidanStore";
import TypeSelectModal from "../typeSelectModal/TypeSelectModal";

type Props = {
  imageId: string;
  imageSrc: string;
};

const ImageInBag = ({ imageId, imageSrc }: Props) => {
  const tutorialPhase = useSaidanStore((state) => state.tutorialPhase);

  return (
    <div
      className={`w-full aspect-square ${
        tutorialPhase === "SELECT_ITEM" ? "z-10 pointer-events-none" : "z-1"
      }`}
    >
      <label
        htmlFor={`my-modal-${imageId}`}
        className="relative btn btn-square bg-offwhite hover:bg-[#707070] border-none w-full h-full overflow-hidden"
        style={{
          position: "relative",
        }}
      >
        <Image
          src={imageSrc}
          alt={`image-${imageId}`}
          fill
          sizes="(min-width: 520px) 25vw, 33vw"
          style={{ objectFit: "contain" }}
          className=" select-none pointer-events-none"
        />
      </label>

      <input
        type="checkbox"
        id={`my-modal-${imageId}`}
        className="modal-toggle"
      />
      <TypeSelectModal imageId={imageId} imageSrc={imageSrc} />
    </div>
  );
};

export default ImageInBag;
