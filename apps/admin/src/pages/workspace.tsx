import { Metadata } from "next";
import { useCallback, useRef, useState } from "react";
import WorkspaceSampleDetailPanel from "ui/organisms/admin/WorkspaceSampleDetailPanel";
import WorkspaceSampleCreateDialog from "ui/organisms/admin/WorkspaceSampleCreateDialog";
import WorkspaceSampleListPanel from "ui/organisms/admin/WorkspaceSampleListPanel";
import WorkspaceShortcutDialog from "ui/organisms/admin/WorkspaceShortcutDialog";
import Image from "next/image";
import { useWorkspaceUnityContext } from "hooks/useCustomUnityContext";
import { WorkspaceUnity } from "ui/molecules/CustomUnity";
import useRestfulAPI from "hooks/useRestfulAPI";

export const metadata: Metadata = {
  title: "ワークスペース",
};

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const sampleCreateDialogRef = useRef(null);
  const shortcutDialogRef = useRef(null);

  const [initSampleCreateDialog, setInitSampleCreateDialog] = useState(0);

  // const workspaceAPIUrl = "native/my/workspace";
  // const { data: workspaceData } = useRestfulAPI(workspaceAPIUrl);

  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);

  const {
    data: samples,
    setData: setSamples,
    deleteData: deleteSamples,
  } = useRestfulAPI("native/my/samples");

  const { data: materials } = useRestfulAPI("native/materials");

  const onSaveDataGenerated = (workspaceSaveData: WorkspaceSaveData) => {};

  const onItemThumbnailGenerated = (thumbnailBase64: string) => {};

  const {
    unityProvider,
    setLoadData,
    requestSaveData,
    placeNewSample,
    removeSample,
    removeSamplesByItemId,
    requestItemThumbnail,
  } = useWorkspaceUnityContext({
    onSaveDataGenerated,
    onItemThumbnailGenerated,
  });

  const createSampleHandler = useCallback(() => {
    if (sampleCreateDialogRef.current) {
      setInitSampleCreateDialog(initSampleCreateDialog + 1);
      sampleCreateDialogRef.current.showModal();
    }
  }, [initSampleCreateDialog]);

  const sampleSelectHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].id);
      const materialIndex = materials.findIndex(
        (value) => value.id === samples[index].materialId,
      );
      placeNewSample({
        itemId: samples[index].id,
        modelUrl: samples[index].modelUrl,
        imageUrl: materials[materialIndex].image,
        modelType: samples[index].type,
      });
    },
    [materials, samples, placeNewSample],
  );

  const deleteSamplesHandler = useCallback(
    async (ids: number[]) => {
      const success = await deleteSamples("native/admin/samples", {
        sampleIds: ids,
      });
      if (success) {
        const newSamples = samples.filter(
          (sample) => ids.findIndex((id) => id === sample.id) === -1,
        );
        setSamples(newSamples);

        // remove sample items in unity view
        removeSamplesByItemId(ids);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [samples, removeSamplesByItemId],
  );

  return (
    <div className="w-full h-full relative">
      <WorkspaceUnity unityProvider={unityProvider} />
      <div className="absolute left-0 right-0 top-0 bottom-0 flex overflow-x-hidden">
        <WorkspaceSampleCreateDialog
          dialogRef={sampleCreateDialogRef}
          initDialog={initSampleCreateDialog}
          materials={materials}
        />
        <WorkspaceShortcutDialog
          dialogRef={shortcutDialogRef}
          changeHandler={null}
        />
        {showDetailView && (
          <WorkspaceSampleDetailPanel id={selectedSampleItem} />
        )}
        <WorkspaceSampleListPanel
          closeHandler={() => setShowListView(false)}
          isOpen={showListView}
          data={samples}
          createHandler={() => {
            setShowListView(false);
            createSampleHandler();
          }}
          selectHandler={sampleSelectHandler}
          deleteHandler={deleteSamplesHandler}
        />
        <div
          className="absolute left-[50%] bottom-12 h-12 flex justify-center"
          style={{
            transform: "translateX(-50%)",
          }}
        >
          <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8">
            <Image
              width={32}
              height={32}
              alt="undo button"
              src="/admin/images/icon/undo-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                console.log("undo button is clicked");
              }}
            />
            <Image
              width={32}
              height={32}
              alt="undo button"
              src="/admin/images/icon/redo-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                console.log("redo button is clicked");
              }}
            />
            <Image
              width={32}
              height={32}
              alt="undo button"
              src="/admin/images/icon/visibility-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                setShowDetailView(!showDetailView);
              }}
            />
            <Image
              width={32}
              height={32}
              alt="undo button"
              src="/admin/images/icon/help-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                if (shortcutDialogRef.current) {
                  shortcutDialogRef.current.showModal();
                }
              }}
            />
          </div>
        </div>
        <div
          className="absolute bottom-16 right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer"
          onClick={createSampleHandler}
        >
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/add-icon.svg"
            alt="icon button"
          />
        </div>
        <div
          className="absolute bottom-[178px] right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer"
          onClick={() => {
            setShowListView(!showListView);
          }}
        >
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/list-icon.svg"
            alt="icon button"
          />
        </div>
      </div>
    </div>
  );
}
