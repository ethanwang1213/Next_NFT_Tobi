import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TIN_BADGE_MODEL_SRC } from "@/constants/saidanConstants";
import { PlacedItemData, SrcItemData } from "@/types/PlacedItemData";
import ModelItemImpl from "./Implements/ModelItemImpl";

type PlacedItemProps = {
  /* eslint-disable no-unused-vars */
  itemData: PlacedItemData;
  srcData: SrcItemData;
  /* eslint-enable no-unused-vars */
};

const GLBItem = ({ itemData, srcData }: PlacedItemProps) => {
  // model
  const { scene: model } = useLoader(
    GLTFLoader,
    itemData.itemType === "ACRYLIC_STAND"
      ? srcData.acstModelSrc
      : TIN_BADGE_MODEL_SRC
  );

  const texture = useTexture({
    map: itemData.itemType === 'ACRYLIC_STAND'
      ? srcData.squareImageSrc : srcData.whitedImageSrc,
  });

  return (
    /* eslint-disable react/no-unknown-property */
    <ModelItemImpl
      itemData={itemData}
      srcModel={model}
      texture={texture}
    />
    /* eslint-enable react/no-unknown-property */
  );
};

export default GLBItem;
