import ShowcaseEditUnityContext from "contexts/ShowcaseEditUnityContext";
import { useItemPreviewUnityContext } from "hooks/useCustomUnityContext";
import { MutableRefObject, useContext, useEffect, useState } from "react";
import { ItemPreviewUnity } from "ui/molecules/CustomUnity";

const SampleDetailDialog = ({
  data,
  dialogRef,
}: {
  data: any;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const { setLoadData, unityProvider } = useItemPreviewUnityContext();
  const [showUnity, setShowUnity] = useState(false);
  const unityContext = useContext(ShowcaseEditUnityContext);
  const { selectedItem } = unityContext;

  useEffect(() => {
    if (data && selectedItem) {
      const itemData = {
        itemId: selectedItem.itemId,
        itemType: selectedItem.itemType,
        modelType: selectedItem.itemType,
        modelUrl: data.modelUrl,
        imageUrl: data.customThumbnailUrl,
        isDebug: true,
      };
      setLoadData(itemData);
      setShowUnity(true);
    } else {
      setShowUnity(false);
    }
  }, [data, setLoadData, selectedItem]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl p-6 flex flex-col gap-3 justify-between items-center bg-[#3F3F3FE5]">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-3 right-5">
            <span
              className="material-symbols-outlined text-base-white cursor-pointer"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </form>
        <span className="text-base-black text-base font-semibold text-gray-100">
          {data?.content?.name || "Content Name"}
        </span>
        <span className="text-base-black text-2xl font-bold text-gray-100">
          {data?.name || "Item Title"}
        </span>
        <div className="mb-[56px]">
          {showUnity ? (
            <div className="w-[400px] h-[400px]">
              <ItemPreviewUnity unityProvider={unityProvider} />
            </div>
          ) : (
            <p className="text-center text-[#9F9C9C] text-[16px] h-[400px] flex items-center">
              The 3D preview will be displayed here when an item is selected
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default SampleDetailDialog;
