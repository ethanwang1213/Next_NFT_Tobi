import useSaidanStore from "@/stores/saidanStore";
import React, { Suspense } from "react";
import BoxItem from "./BoxItem";
import GLBItem from "./GLBItem";

const PlacedItems: React.FC = () => {
  const allSrcs = useSaidanStore((state) => state.allSrcs);
  const placedItems = useSaidanStore((state) => state.placedItems);

  return (
    <>
      {placedItems.map((v) => {
        const src = allSrcs.find((s) => s.id === v.srcId);
        if (!src) return null;

        const params = {
          // key: `${v.id}`,
          itemData: v,
          srcData: src,
        };
        // if (v.itemType === 'ACRYLIC_STAND') {
        //   console.log(src.squareImageSrc)
        // }

        if (v.itemType === "ACRYLIC_STAND" || v.itemType === "TIN_BADGE") {
          return (
            <Suspense key={v.id} fallback={null}>
              <GLBItem {...params} />
            </Suspense>
          );
        }
        return (
          <Suspense key={v.id} fallback={null}>
            <BoxItem {...params} />
          </Suspense>
        );
      })}
    </>
  );
};

export default PlacedItems;
