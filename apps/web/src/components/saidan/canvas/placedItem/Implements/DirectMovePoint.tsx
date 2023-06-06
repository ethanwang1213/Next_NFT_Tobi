import { FLOOR_OFFSET, ITEM_TYPE_DATA } from "@/constants/saidanConstants";
import useSaidanStore from "@/stores/saidanStore";
import { PlacedItemData } from "@/types/PlacedItemData";

type Props = {
  itemData: PlacedItemData;
};

const DirectMovePoint = ({ itemData }: Props) => {
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);

  const getPosY = () => {
    const originHeight =
      ITEM_TYPE_DATA[itemData.itemType].originPosition *
      itemSizeData[itemData.id].y *
      itemData.scale;
    return itemData.position.y - originHeight + FLOOR_OFFSET;
  };

  const getPosZ = () => {
    const pointDepth = FLOOR_OFFSET * Math.abs(Math.sin(itemData.rotation));
    return itemData.position.z + pointDepth - 0.1;
  };

  return (
    /* eslint-disable react/no-unknown-property */
    <mesh
      position={[
        itemData.position.x,
        getPosY(), // yはrotationの影響を受けない
        getPosZ(),
      ]}
    >
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial
        color="#555"
        transparent
        opacity={itemData.isInLimitedPlace ? 0.2 : 0.7}
      />
    </mesh>
    /* eslint-enable react/no-unknown-property */
  );
};

export default DirectMovePoint;
