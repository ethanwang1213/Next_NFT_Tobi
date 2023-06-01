import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import {
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  Box3,
  Vector3,
  Vector2,
  Texture,
} from "three";
import { useTexture } from "@react-three/drei";
import useSaidanStore from "@/stores/saidanStore";
import { PlacedItemData, SrcItemData } from "@/types/PlacedItemData";
import PlacedItemImpl from "./Implements/PlacedItemImpl";

type PlacedItemProps = {
  /* eslint-disable no-unused-vars */
  itemData: PlacedItemData;
  srcData: SrcItemData;
  /* eslint-enable no-unused-vars */
};

const BoxItem = ({ itemData, srcData }: PlacedItemProps) => {
  const allSrcs = useSaidanStore((state) => state.allSrcs);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const setItemSize = useSaidanStore((state) => state.setItemSize);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  // texture
  const [map, setMap] = useState<Texture>();
  const texture = useTexture({
    map:
      itemData.itemType === "ACRYLIC_STAND"
        ? srcData.imageSrc
        : srcData.whitedImageSrc,
  });
  useEffect(() => {
    if (!texture.map) return;
    const newMap = texture.map.clone();
    const srcData = allSrcs.find((v) => v.id === itemData.srcId);
    if (srcData) {
      const crop = itemData.cropData;
      if (!crop) {
        console.error("crop is undefined");
        return;
      }
      // 大事
      newMap.center = new Vector2(0.5, 0.5);
      // scaling
      let repeatW;
      let repeatH;
      if (crop.srcH / crop.srcW < Math.SQRT2) {
        // 比較的横長
        // 横が潰される
        const posterScale = crop.srcH / (crop.srcW * Math.SQRT2);
        const cropScale = crop.h / crop.srcH;
        repeatW = posterScale * cropScale;
        repeatH = cropScale;
      } else {
        // 比較的縦長
        // 縦が潰される
        const posterScale = crop.srcW / (crop.srcH * Math.SQRT1_2);
        const cropScale = crop.w / crop.srcW;
        repeatW = cropScale;
        repeatH = posterScale * cropScale;
      }
      newMap.repeat = new Vector2(repeatW, repeatH);
      // offset x
      const srcX = crop.srcW / 2.0;
      const offX = crop.x - srcX;
      const offsetX = offX / crop.srcW;
      // offset y
      const srcY = crop.srcH / 2.0;
      const offY = crop.y - srcY;
      const offsetY = offY / crop.srcH;
      newMap.offset = new Vector2(offsetX, -offsetY);
    }
    setMap(newMap);
  }, [texture.map]);

  // color
  const [itemColor, setItemColor] = useState<string>("#fff");
  useEffect(() => {
    if (!itemData) return;
    let color = "#fff";
    if (!isCameraMode) {
      if (selectedItemId === itemData.id) {
        color = "#ffd";
      }
      if (itemData.isInLimitedPlace) {
        color = "#aaa";
      }
    }
    setItemColor(color);
  }, [itemData.isInLimitedPlace, selectedItemId, isCameraMode]);

  // size
  useEffect(() => {
    const newMesh = new Mesh(
      new BoxGeometry(1, Math.SQRT2, 0.1),
      new MeshStandardMaterial()
    );
    const boundBox = new Box3().setFromObject(newMesh);
    setItemSize(itemData.id, boundBox.getSize(new Vector3()));
  }, []);

  return (
    /* eslint-disable react/no-unknown-property */
    <>
      {map && (
        <PlacedItemImpl itemData={itemData} scaleZ={1}>
          <mesh>
            <boxGeometry args={[1, Math.SQRT2, 0.01]} />
            <meshPhysicalMaterial
              color={itemColor}
              transparent={false}
              opacity={itemData.isInLimitedPlace ? 0.5 : 1}
              map={map}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
            />
          </mesh>
        </PlacedItemImpl>
      )}
    </>
    /* eslint-enable react/no-unknown-property */
  );
};

export default BoxItem;
