import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NftItem } from "../../types/adminTypes";
import { InventoryItemComponent } from "./InventoryItemComponent";

const BoxInventoryTab = ({
  backRoot,
  id,
  title,
  clickNftItem,
  dragNftItem,
}: {
  backRoot: () => void;
  id: number;
  title: string;
  clickNftItem: (id: NftItem) => void;
  dragNftItem: (item: NftItem) => void;
}) => {
  const apiUrl = `native/my/inventory/box/${id}`;
  const { data, loading, getData } = useRestfulAPI(apiUrl);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <>
      <div className="absolute left-[32px] top-[26px] cursor-pointer">
        <Image
          width={16}
          height={16}
          src="/admin/images/icon/left-arrow.svg"
          alt="Left Arrow Icon"
          onClick={backRoot}
        />
      </div>
      <div className="flex items-center justify-center h-full">
        <span className="text-center text-base font-semibold leading-[19.2px]">
          {title}
        </span>
      </div>
      <div className="flex flex-wrap pt-[13px]">
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </span>
        )}
        {data?.items?.map((item, index) => {
          return (
            <div key={item.id} className="w-1/4 p-2">
              <InventoryItemComponent
                selectHandler={() => clickNftItem(item)}
                dragStartHandler={() => dragNftItem(item)}
                imageUrl={item.image}
              ></InventoryItemComponent>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { BoxInventoryTab };
