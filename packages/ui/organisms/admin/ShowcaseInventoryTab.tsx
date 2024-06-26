import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";
import { BoxComponent } from "ui/organisms/admin/BoxComponent";
import { NftItem } from "ui/types/adminTypes";
import { BoxInventoryTab } from "./BoxInventoryTab";
import { InventoryItemComponent } from "./InventoryItemComponent";

const ShowcaseInventoryTab = ({
  clickNftItem,
  dragNftItem,
}: {
  clickNftItem: (id: NftItem) => void;
  dragNftItem: (item: NftItem) => void;
}) => {
  const apiUrl = "native/my/inventory";
  const { data, loading, getData } = useRestfulAPI(apiUrl);

  const [reload, setReload] = useState(0);
  const [boxid, setBoxid] = useState(-1);
  const [boxName, setBoxName] = useState("");

  useEffect(() => {
    if (reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <>
      {boxid == -1 && (
        <div className="flex flex-wrap">
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="loading loading-spinner loading-md"></span>
            </span>
          )}
          {data?.boxes?.map((box, index) => {
            return (
              <div key={box.id} className="w-1/4 p-2">
                <BoxComponent
                  box={box}
                  clickBox={(id, title) => {
                    setBoxid(id);
                    setBoxName(title);
                  }}
                ></BoxComponent>
              </div>
            );
          })}
          {data?.items?.map((item, index) => {
            return (
              <div key={item.id} className="w-1/4 p-2">
                <InventoryItemComponent
                  imageUrl={item.image}
                  selectHandler={() => clickNftItem(item)}
                  dragStartHandler={() => dragNftItem(item)}
                ></InventoryItemComponent>
              </div>
            );
          })}
        </div>
      )}
      {boxid != -1 && (
        <div className="relative flex-1 p-[24px] bg-gray-300 bg-opacity-50 rounded-3xl">
          <BoxInventoryTab
            id={boxid}
            title={boxName}
            clickNftItem={clickNftItem}
            dragNftItem={dragNftItem}
            backRoot={() => {
              setBoxid(-1);
              setBoxName("");
            }}
          ></BoxInventoryTab>
        </div>
      )}
    </>
  );
};

export { ShowcaseInventoryTab };
