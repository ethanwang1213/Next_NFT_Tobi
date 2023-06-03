import { ITEM_TYPE_DATA, FLOOR_OFFSET } from "@/constants/saidanConstants";
import { DirectControlContext } from "@/context/directControl";
import useSaidanStore from "@/stores/saidanStore";
import { PlacedItemData } from "@/types/PlacedItemData";
import { Html } from "@react-three/drei";
import { useContext } from "react";
import DirectScaleIcon from "@/../public/saidan/saidan-ui/direct_scale.svg";

type Props = {
  itemData: PlacedItemData;
};

const DirectScalePoint: React.FC<Props> = ({ itemData }: Props) => {
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);

  const { handleDirectScaleDown } = useContext(DirectControlContext);

  const getPosY = () => {
    const beyondHead =
      (1.0 - ITEM_TYPE_DATA[itemData.itemType].originPosition) *
      itemSizeData[itemData.id].y *
      itemData.scale;
    return itemData.position.y + beyondHead;
  };

  const getPosZ = () => {
    const pointDepth = FLOOR_OFFSET * Math.abs(Math.sin(itemData.rotation));
    return itemData.position.z + pointDepth - 0.1;
  };

  return (
    /* eslint-disable react/no-unknown-property */
    <>
      <mesh
        position={[
          itemData.position.x,
          getPosY(), // yはrotationの影響を受けない
          getPosZ(),
        ]}
        onPointerDown={(e) => handleDirectScaleDown(e, itemData.id)}
      >
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#555"
          transparent
          opacity={itemData.isInLimitedPlace ? 0.2 : 0.7}
        />
      </mesh>
      <Html
        transform={true}
        position={[itemData.position.x, getPosY(), getPosZ()]}
        scale={1}
        pointerEvents="none"
      >
        <div className="w-20 h-20 flex justify-center grid content-center">
          <DirectScaleIcon />
        </div>
      </Html>
    </>
    /* eslint-enable react/no-unknown-property */
  );
};

export default DirectScalePoint;
