import { useEffect, useState } from "react";
import {
  Box3,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Texture,
  Vector2,
  Vector3,
} from "three";
import { shallow } from "zustand/shallow";
import useSaidanStore from "@/stores/saidanStore";
import { PlacedItemData } from "@/types/PlacedItemData";
import PlacedItemImpl from "./PlacedItemImpl";

type Props = {
  /* eslint-disable no-unused-vars */
  itemData: PlacedItemData;
  srcModel: Group;
  texture: { map: Texture };
  /* eslint-enable no-unused-vars */
};

const ModelItemImpl = ({ itemData, srcModel, texture }: Props) => {
  const allSrcs = useSaidanStore((state) => state.allSrcs);
  const selectedItemId = useSaidanStore((state) => state.selectedItemId);
  const itemSizeData = useSaidanStore((state) => state.itemSizeData);
  const setItemSize = useSaidanStore((state) => state.setItemSize);
  const isCameraMode = useSaidanStore((state) => state.isCameraMode);

  const [model, setModel] = useState<Group>();
  const [map, setMap] = useState<Texture>();

  const setupTexture = (newMap: Texture) => {
    const newModel = srcModel.clone();
    if (itemData.itemType === "ACRYLIC_STAND") {
      newModel.traverse((o: any) => {
        if (o.type !== "Mesh") return;
        const mesh = o as Mesh;
        const mat = new MeshPhysicalMaterial();
        if (o.name === "GPencil_mesh001") {
          mat.map = newMap;
          mat.map.center = new Vector2(0.5, 0.5);
          mat.map.repeat.y = -1;
        } else {
          mat.transparent = true;
          mat.alphaToCoverage = true;
          mat.transmission = 1.0;
          mat.thickness = 0.3;
          mat.reflectivity = 0;
          mat.clearcoat = 1;
          mat.clearcoatRoughness = 0.14;
        }
        mesh.material = mat;
      });
      return newModel;
    }
    if (itemData.itemType === "TIN_BADGE") {
      newModel.traverse((o: any) => {
        if (o.type !== "Mesh") return;
        const mesh = o as Mesh;
        const mat = new MeshPhysicalMaterial();
        mat.map = newMap;
        const srcData = allSrcs.find((v) => v.id === itemData.srcId);
        if (srcData) {
          const crop = itemData.cropData;
          if (!crop) {
            console.error("crop is undefined");
            return;
          }
          // 大事
          mat.map.center = new Vector2(0.5, 0.5);
          // scaling
          let repeatW;
          let repeatH;
          const cropRate = 0.772;
          let cropScale;
          let offsetX;
          let badgeOffsetX;
          let offsetY;
          let badgeOffsetY;

          if (crop.srcW > crop.srcH) {
            // 横長
            // repeatの増大は縮小になる
            // repeat 2は2つ収めるために大きさは半分になる
            const badgeScale = crop.srcH / crop.srcW;
            cropScale = crop.h / crop.srcH;
            repeatW = (badgeScale * cropScale) / cropRate;
            repeatH = cropScale / cropRate;

            // offset x
            // cropの左端から中心までの距離
            const srcX = crop.srcW / 2.0;
            // cropの中心xを取得
            const offX = crop.x - srcX;
            offsetX = offX / crop.srcW;
            badgeOffsetX = -0.1325 * (badgeScale * cropScale);

            // offset y
            const srcY = crop.srcH / 2.0;
            const offY = crop.y - srcY;
            offsetY = offY / crop.srcH;
            badgeOffsetY = 0.1215 * cropScale;
          } else {
            // 縦長
            const badgeScale = crop.srcW / crop.srcH;
            cropScale = crop.w / crop.srcW;
            repeatW = cropScale / cropRate;
            repeatH = (badgeScale * cropScale) / cropRate;

            // offset x
            // cropの左端から中心までの距離
            const srcX = crop.srcW / 2.0;
            // cropの中心xを取得
            const offX = crop.x - srcX;
            offsetX = offX / crop.srcW;
            badgeOffsetX = -0.1325 * cropScale;

            // offset y
            const srcY = crop.srcH / 2.0;
            const offY = crop.y - srcY;
            offsetY = offY / crop.srcH;
            badgeOffsetY = 0.1215 * (badgeScale * cropScale);
          }
          mat.map.repeat = new Vector2(repeatW, repeatH);
          mat.map.offset.x = offsetX + badgeOffsetX;
          mat.map.offset.y = offsetY + badgeOffsetY;
        }
        mat.map.flipY = false;
        mat.roughness = 0.2;
        mat.metalness = 0.05;
        mat.clearcoat = 1.0;
        mesh.material = mat;
      });
      return newModel;
    }
    const newMesh = new Mesh(
      new BoxGeometry(1, 1, 0.1),
      new MeshStandardMaterial()
    );
    return newMesh;
  };

  useEffect(() => {
    if (!texture.map) return;
    const newMap = texture.map.clone();
    const newModel = setupTexture(newMap) as Group;
    setMap(newMap);
    setModel(newModel);
    if (!isItemSizeZero()) return;
    const boundBox = new Box3().setFromObject(newModel);
    setItemSize(itemData.id, boundBox.getSize(new Vector3()));
  }, [texture.map]);

  // color
  useEffect(() => {
    if (!model) return;
    if (!itemData) return;
    // const color = selectedItemId === itemData.id ? "#ff7" : "#fff";
    let color = "#fff";
    if (!isCameraMode) {
      if (selectedItemId === itemData.id) {
        color = "#ffd";
      }
      if (itemData.isInLimitedPlace) {
        color = "#aaa";
      }
    }

    model.traverse((o: any) => {
      if (o.type !== "Mesh") return;
      const mesh = o as Mesh;
      if (itemData.itemType === "ACRYLIC_STAND") {
        const mat = mesh.material as MeshPhysicalMaterial;
        mat.color = new Color(color);
      } else if (itemData.itemType === "TIN_BADGE") {
        const mat = mesh.material as MeshStandardMaterial;
        mat.color = new Color(color);
      }
    });
  }, [itemData.isInLimitedPlace, selectedItemId, model, isCameraMode]);

  // size
  const isItemSizeZero = () =>
    itemSizeData[itemData.id].x === 0 &&
    itemSizeData[itemData.id].y === 0 &&
    itemSizeData[itemData.id].z === 0;
  useEffect(() => {
    // sizeの設定
    if (!isItemSizeZero()) return;
    const boundBox = new Box3().setFromObject(srcModel);
    setItemSize(itemData.id, boundBox.getSize(new Vector3()));
  }, []);

  return (
    /* eslint-disable react/no-unknown-property */
    <>
      {map && model && (
        <PlacedItemImpl itemData={itemData} scaleZ={itemData.scale}>
          <primitive object={model} />
          {/** ↓なぜかこれを置くと、↑のテクスチャの色も濃くなる（テクスチャの初期化？） */}
          <mesh position={[0, 10, 10]}>
            <boxGeometry args={[0, 0, 0]} />
            <meshStandardMaterial map={map} />
          </mesh>
        </PlacedItemImpl>
      )}
    </>
    /* eslint-enable react/no-unknown-property */
  );
};

export default ModelItemImpl;
