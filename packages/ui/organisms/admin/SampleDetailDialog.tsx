import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useItemPreviewUnityContext } from "hooks/useCustomUnityContext";
import { MutableRefObject, useEffect, useState } from "react";
import { ItemPreviewUnity } from "ui/molecules/CustomUnity";
import Spinner from "./Spinner";

interface SampleDetailDialogProps {
  data: any;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}

const SampleDetailDialog = ({ data, dialogRef }: SampleDetailDialogProps) => {
  const { setLoadData, isLoaded, unityProvider } = useItemPreviewUnityContext();
  const [showUnity, setShowUnity] = useState(false);
  const { selectedItem } = useShowcaseEditUnity();

  useEffect(() => {
    if (data && selectedItem) {
      setLoadData({
        itemId: selectedItem.id,
        itemType: selectedItem.itemType,
        modelType: data.type,
        modelUrl: data.modelUrl,
        imageUrl: data.customThumbnailUrl,
        isDebug: true,
      });
      setShowUnity(true);
    } else {
      setShowUnity(false);
    }
  }, [data, selectedItem, setLoadData]);

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
        <div className="relative mb-[56px] w-full h-full">
          {!showUnity && (
            <p className="text-center text-neutral-400 text-[16px] h-[400px] flex items-center justify-center flex">
              The 3D preview will be displayed here when an item is selected
            </p>
          )}
          {showUnity && unityProvider && (
            <ItemPreviewUnity unityProvider={unityProvider} />
          )}
          {!isLoaded && showUnity && (
            <div className="absolute inset-0 flex justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default SampleDetailDialog;
