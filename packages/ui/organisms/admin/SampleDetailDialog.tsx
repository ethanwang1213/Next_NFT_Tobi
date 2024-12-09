import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useWorkspaceEditUnity } from "contexts/WorkspaceEditUnityContext";
import { useItemPreviewUnityHook } from "hooks/useCustomUnityHook";
import { useTranslations } from "next-intl";
import { MutableRefObject, useEffect, useState } from "react";
import { SecondaryUnity } from "ui/molecules/CustomUnity";
import Spinner from "./Spinner";

interface SampleDetailDialogProps {
  data: any;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}

const SampleDetailDialog = ({ data, dialogRef }: SampleDetailDialogProps) => {
  const { setLoadData, isSceneOpen, unityProvider } = useItemPreviewUnityHook();
  const { selectedItem, resumeUnityInputs } = useShowcaseEditUnity();
  const { selectedSample, resumeUnityInputs: workspaceResumeUnityInputs } =
    useWorkspaceEditUnity();
  const t = useTranslations("Showcase");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedItem) {
        setLoadData({
          itemId: selectedItem.itemId,
          itemType: selectedItem.itemType,
          modelType: data.type,
          modelUrl: data.modelUrl,
          imageUrl: data.croppedUrl ?? "",
          acrylicBaseScaleRatio: data.acrylicBaseScaleRatio,
        });
      } else if (selectedSample) {
        setLoadData({
          itemId: selectedSample.sampleItemId,
          itemType: 0,
          modelType: data.type,
          modelUrl: data.modelUrl,
          imageUrl: data.croppedUrl ?? "",
          acrylicBaseScaleRatio: data.acrylicBaseScaleRatio,
        });
      }
    }
  }, [data, selectedItem, selectedSample, isOpen, setLoadData]);

  // observe dialog open attribute
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const observer = new MutationObserver(() => setIsOpen(dialog.open));
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => observer.disconnect();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[878px] rounded-3xl p-6 flex flex-col h-[600px] gap-3 items-center bg-[#3F3F3FE5] relative">
        <form method="dialog">
          <button
            className="absolute w-4 h-4 top-3 right-5 z-20"
            onClick={() => {
              if (selectedItem) {
                resumeUnityInputs();
              } else {
                workspaceResumeUnityInputs();
              }
            }}
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
          {data?.name || t("ItemTitle")}
        </span>
        <div className="absolute w-full h-full top-0 bottom-0 left-0 right-0 flex justify-center items-center">
          {!isOpen && (
            <p className="text-center text-neutral-400 text-[16px] flex items-center justify-center flex">
              {t("PreviewDisplayed")}
            </p>
          )}
          {isOpen && unityProvider && (
            <SecondaryUnity
              unityProvider={unityProvider}
              isSceneOpen={isSceneOpen}
            />
          )}
          {!isSceneOpen && isOpen && (
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
