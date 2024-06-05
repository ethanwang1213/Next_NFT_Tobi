import { Metadata } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import WorkspaceSampleDetailPanel from "ui/organisms/admin/WorkspaceSampleDetailPanel";
import WorkspaceSampleCreateDialog from "ui/organisms/admin/WorkspaceSampleCreateDialog";
import WorkspaceSampleListPanel from "ui/organisms/admin/WorkspaceSampleListPanel";
import WorkspaceShortcutDialog from "ui/organisms/admin/WorkspaceShortcutDialog";
import Image from "next/image";
import { useWorkspaceUnityContext } from "hooks/useCustomUnityContext";
import { WorkspaceUnity } from "ui/molecules/CustomUnity";
import useRestfulAPI from "hooks/useRestfulAPI";
import { ImageType, uploadImage } from "fetchers/UploadActions";
import { ModelType } from "types/unityTypes";
import { SampleItem } from "ui/types/adminTypes";
import { WorkspaceSaveData } from "types/adminTypes";
import { useLeavePage } from "contexts/LeavePageProvider";

export const metadata: Metadata = {
  title: "ワークスペース",
};

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const sampleCreateDialogRef = useRef(null);
  const shortcutDialogRef = useRef(null);

  const [initSampleCreateDialog, setInitSampleCreateDialog] = useState(0);

  const workspaceAPIUrl = "native/my/workspace";
  const { data: workspaceData, postData: storeWorkspaceData } =
    useRestfulAPI(workspaceAPIUrl);

  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);

  const {
    data: samples,
    setData: setSamples,
    deleteData: deleteSamples,
  } = useRestfulAPI("native/my/samples");

  const { data: materials, postData } = useRestfulAPI("native/materials");

  const generateError = useRef(false);
  const generateSampleType = useRef(null);
  const generateMaterialImage = useRef(null);
  const generateModelUrl = useRef(null);

  const onSaveDataGenerated = (workspaceSaveData: WorkspaceSaveData) => {
    console.log("onSaveDataGenerated", workspaceSaveData);
    storeWorkspaceData(workspaceAPIUrl, {
      itemList: workspaceSaveData.workspaceItemList,
    });
  };

  const onItemThumbnailGenerated = async (thumbnailBase64: string) => {
    const sampleThumb = await uploadImage(
      thumbnailBase64,
      ImageType.SampleThumbnail,
    );
    const newSample = await postData("native/my/samples", {
      thumbUrl: sampleThumb,
      modelUrl: generateModelUrl.current,
      materialId: generateMaterialImage.current.id,
      type: generateSampleType.current,
    });
    placeSampleHandler(newSample);

    if (sampleCreateDialogRef.current) {
      sampleCreateDialogRef.current.close();
    }
  };

  const {
    unityProvider,
    setLoadData: setWorkspaceData,
    requestSaveData,
    placeNewSample,
    removeSamplesByItemId,
    requestItemThumbnail,
  } = useWorkspaceUnityContext({
    onSaveDataGenerated,
    onItemThumbnailGenerated,
  });

  useEffect(() => {
    if (workspaceData && workspaceData.workspaceItemList.length) {
      setWorkspaceData(workspaceData.workspaceItemList);
    }
  }, [workspaceData, setWorkspaceData]);

  const requestSaveDataInterval = 1000 * 60 * 1; // 5 minutes
  useEffect(() => {
    // Initialize timer
    const requestSaveDataTimer = setTimeout(() => {
      requestSaveData();
    }, requestSaveDataInterval);

    return () => {
      clearTimeout(requestSaveDataTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { leavingPage, setLeavingPage } = useLeavePage();

  useEffect(() => {
    if (leavingPage) {
      // Request save data to Unity
      requestSaveData();
      setLeavingPage(false); // Reset the state
    }
  }, [leavingPage, setLeavingPage, requestSaveData]);

  const addButtonHandler = useCallback(() => {
    if (sampleCreateDialogRef.current) {
      setInitSampleCreateDialog(initSampleCreateDialog + 1);
      sampleCreateDialogRef.current.showModal();
    }
  }, [initSampleCreateDialog]);

  const placeSampleHandler = useCallback(
    (sample: SampleItem) => {
      const materialIndex = materials.findIndex(
        (value) => value.id === sample.materialId,
      );
      placeNewSample({
        itemId: sample.id,
        modelUrl: sample.modelUrl,
        imageUrl: materials[materialIndex].image,
        modelType: sample.type == 1 ? ModelType.Poster : ModelType.AcrylicStand,
      });
      requestSaveData();
    },
    [materials, placeNewSample, requestSaveData],
  );

  const sampleSelectHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].id);
      placeSampleHandler(samples[index]);
    },
    [samples, placeSampleHandler],
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

  const generateSampleHandler = useCallback(
    async (materialId: number, materialImage: string, sampleType: number) => {
      generateSampleType.current = sampleType;
      if (sampleType === ModelType.Poster) {
        // take material image
        let selMaterialImage;
        if (materialId === 0) {
          const imageUrl = await uploadImage(
            materialImage,
            ImageType.MaterialImage,
          );
          const response = await postData(
            "native/materials",
            { image: imageUrl },
            [],
          );
          selMaterialImage = response[response.length - 1];
        } else {
          const materialIndex = materials.findIndex(
            (value) => value.id === materialId,
          );
          selMaterialImage = materials[materialIndex];
        }
        generateMaterialImage.current = selMaterialImage;

        // create model
        const modelResp = await postData("native/model/create", {
          type: "Poster",
          materialId: selMaterialImage.id,
          imageUrl: selMaterialImage.image,
        });
        generateModelUrl.current = modelResp["modelUrl"];
        requestItemThumbnail({
          modelType: ModelType.Poster,
          modelUrl: modelResp["modelUrl"],
          imageUrl: selMaterialImage.image,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [materials, requestItemThumbnail],
  );

  return (
    <div className="w-full h-full relative">
      <WorkspaceUnity unityProvider={unityProvider} />
      <div className="absolute left-0 right-0 top-0 bottom-0 flex overflow-x-hidden">
        <WorkspaceSampleCreateDialog
          dialogRef={sampleCreateDialogRef}
          initDialog={initSampleCreateDialog}
          materials={materials}
          generateHandler={generateSampleHandler}
          generateError={generateError.current}
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
            addButtonHandler();
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
          onClick={addButtonHandler}
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
