import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";
import { BoxComponent } from "ui/organisms/admin/BoxComponent";
import { BoxInventoryTab } from "./BoxInventoryTab";
import { InventoryItemComponent } from "./InventoryItemComponent";

const ShowcaseInventoryTab = ({
  clickSampleItem,
}: {
  clickSampleItem: (id: number) => void;
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
          {data &&
            data.boxes &&
            data.boxes.length > 0 &&
            data.boxes.map((box, index) => {
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
          {data &&
            data.items &&
            data.items.length > 0 &&
            data.items.map((item, index) => {
              return (
                <div key={item.id} className="w-1/4 p-2">
                  <InventoryItemComponent item={item}></InventoryItemComponent>
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
