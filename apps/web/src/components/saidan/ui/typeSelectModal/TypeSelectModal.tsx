import Image from "next/image";
import AcstButton from "./buttons/AcstButton";
import BadgeButton from "./buttons/BadgeButton";
import PosterButton from "./buttons/PosterButton";

type Props = {
  imageId: string;
  imageSrc: string;
};

const TypeSelectModal = ({ imageId, imageSrc }: Props) => (
  <label
    htmlFor={`my-modal-${imageId}`}
    className="modal cursor z-[2] bg-black/50"
  >
    {/* eslint-disable jsx-a11y/label-has-associated-control */}
    <label className="modal-box relative" htmlFor="">
      {/* eslint-enable jsx-a11y/label-has-associated-control */}
      <div className="flex items-center justify-center h-64">
        <div>
          <div className="relative w-40 aspect-square bg-offwhite rounded-xl">
            <Image
              src={imageSrc}
              alt={`image-${imageId}`}
              fill
              className="object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 w-full gap-2 mb-2 mt-2">
        <AcstButton imageId={imageId} />
        <BadgeButton imageId={imageId} />
        <PosterButton imageId={imageId} />
      </div>
    </label>
  </label>
);

export default TypeSelectModal;
