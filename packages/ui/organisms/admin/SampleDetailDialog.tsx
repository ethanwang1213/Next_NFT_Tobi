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
  const { selectedItem, resumeUnityInputs } = useShowcaseEditUnity();

  useEffect(() => {
    if (data && selectedItem) {
      setLoadData({
        itemId: selectedItem.id,
        itemType: selectedItem.itemType,
        modelType: data.type,
        modelUrl: data.modelUrl,
        imageUrl: data.materialUrl || data.customThumbnailUrl,
        acrylicBaseScaleRatio: data.acrylicBaseScaleRatio,
      });
      setShowUnity(true);
    } else {
      setShowUnity(false);
    }
  }, [data, selectedItem, setLoadData]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl p-6 flex flex-col h-[600px] gap-3 items-center bg-[#3F3F3FE5] relative">
        <form method="dialog">
          <button
            className="absolute w-4 h-4 top-3 right-5 z-20"
            onClick={resumeUnityInputs}
          >
            <span
              className="material-symbols-outlined text-base-white cursor-pointer"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </form>
        <span className="text-base-black text-base font-semibold text-gray-100 z-20">
          {data?.content?.name || "Content Name"}
        </span>
        <span className="text-base-black text-2xl font-bold text-gray-100 z-20">
          {data?.name || "Item Title"}
        </span>
        <div className="absolute w-full h-full top-0 bottom-0 left-0 right-0 flex justify-center items-center">
          {!showUnity && (
            <p className="text-center text-neutral-400 text-[16px] flex items-center justify-center flex">
              The 3D preview will be displayed here when an item is selected
            </p>
          )}
          {showUnity && unityProvider && (
            <ItemPreviewUnity
              unityProvider={unityProvider}
              isLoaded={isLoaded}
            />
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
