import { useLeavePage } from "contexts/LeavePageProvider";
import {
  getDownloadUrlFromPath,
  ImageType,
  uploadImage,
} from "fetchers/UploadActions";
import { useWorkspaceUnityContext } from "hooks/useCustomUnityContext";
import useRestfulAPI from "hooks/useRestfulAPI";
import useWASDKeys from "hooks/useWASDKeys";
import { Metadata } from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SendSampleRemovalResult,
  UpdateIdValues,
  WorkspaceSaveData,
} from "types/adminTypes";
import { ModelType } from "types/unityTypes";
import { WorkspaceUnity } from "ui/molecules/CustomUnity";
import WorkspaceSampleCreateDialog from "ui/organisms/admin/WorkspaceSampleCreateDialog";
import WorkspaceSampleDetailPanel from "ui/organisms/admin/WorkspaceSampleDetailPanel";
import WorkspaceSampleListPanel from "ui/organisms/admin/WorkspaceSampleListPanel";
import WorkspaceShortcutDialog from "ui/organisms/admin/WorkspaceShortcutDialog";
import { SampleItem } from "ui/types/adminTypes";

export const metadata: Metadata = {
  title: "ワークスペース",
};

const REMOVE_PANEL_WIDTH = 56;

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [showRestoreMenu, setShowRestoreMenu] = useState(false);
  const sampleCreateDialogRef = useRef<HTMLDialogElement>(null);
  const shortcutDialogRef = useRef<HTMLDialogElement>(null);

  const [isSampleCreateDialogOpen, setIsSampleCreateDialogOpen] =
    useState(false);
  const [isShortcutDialogOpen, setIsShortcutDialogOpen] = useState(false);

  const [initSampleCreateDialog, setInitSampleCreateDialog] = useState(0);

  const workspaceAPIUrl = "native/my/workspace";
  const { data: workspaceData, postData: storeWorkspaceData } =
    useRestfulAPI(workspaceAPIUrl);

  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);

  const sampleAPIUrl = "native/my/samples";
  const {
    data: samples,
    getData: loadSamples,
    setData: setSamples,
    postData: createSample,
    deleteData: deleteSamples,
  } = useRestfulAPI(sampleAPIUrl);

  const materialAPIUrl = "native/materials";
  const { data: materials, postData: createMaterialImage } =
    useRestfulAPI(materialAPIUrl);

  const [generateSampleError, setGenerateSampleError] = useState(false);

  const wasdKeys = useWASDKeys();

  const generateSampleType = useRef(null);
  const generateMaterialImage = useRef(null);
  const generateModelUrl = useRef(null);

  const onSaveDataGenerated = async (
    workspaceSaveData: WorkspaceSaveData,
    updateIdValues: UpdateIdValues,
  ) => {
    const updateIds = await storeWorkspaceData(workspaceAPIUrl, {
      itemList: workspaceSaveData.workspaceItemList,
    });
    if (updateIds.length > 0) {
      updateIdValues({ idPairs: updateIds });
    }
  };

  const onItemThumbnailGenerated = async (thumbnailBase64: string) => {
    const sampleThumb = await uploadImage(
      thumbnailBase64,
      ImageType.SampleThumbnail,
    );

    const materialIndex = materials.findIndex(
      (value) => value.image === generateMaterialImage.current,
    );

    const postData = {
      thumbUrl: sampleThumb,
      modelUrl: generateModelUrl.current,
      materialId: materialIndex == -1 ? 0 : materials[materialIndex].id,
      type: generateSampleType.current,
    };
    if (materialIndex == -1) {
      delete postData.materialId;
    }

    const newSample = await createSample(sampleAPIUrl, postData);
    if (newSample === false) {
      setGenerateSampleError(true);
      return;
    }
    placeSampleHandler(newSample);
    loadSamples(sampleAPIUrl);

    if (sampleCreateDialogRef.current) {
      sampleCreateDialogRef.current.close();
    }
  };

  const onRemoveSampleEnabled = () => {
    setShowRestoreMenu(true);
  };

  const onRemoveSampleDisabled = () => {
    setShowRestoreMenu(false);
  };

  const onRemoveSampleRequested = async (
    id: number,
    itemId: number,
    sendSampleRemovalResult: SendSampleRemovalResult,
  ) => {
    // hide the restore menu
    setShowRestoreMenu(false);
    const result = await storeWorkspaceData(`${workspaceAPIUrl}/throw`, {
      id: id,
    });
    sendSampleRemovalResult(id, result !== false);
  };

  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const updateContainerWidth = () => {
      setContentWidth(document.querySelector("#workspace_view").clientWidth);
    };

    // Update container width on mount and window resize
    updateContainerWidth();

    // Add event listener when the component mounts
    window.addEventListener("resize", updateContainerWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  const {
    unityProvider,
    isLoaded,
    selectedSampleId,
    setLoadData: setWorkspaceData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeSamplesByItemId,
    requestItemThumbnail,
    inputWasd,
  } = useWorkspaceUnityContext({
    sampleMenuX: contentWidth - (showListView ? 448 : REMOVE_PANEL_WIDTH * 2),
    onSaveDataGenerated,
    onItemThumbnailGenerated,
    onRemoveSampleEnabled,
    onRemoveSampleDisabled,
    onRemoveSampleRequested,
  });

  useEffect(() => {
    if (workspaceData) {
      setWorkspaceData(workspaceData);
    }
  }, [workspaceData, setWorkspaceData]);

  useEffect(() => {
    setSelectedSampleItem(selectedSampleId);
  }, [selectedSampleId]);

  const requestSaveDataInterval = 1000 * 60 * 5; // 5 minutes
  useEffect(() => {
    // Initialize timer
    const requestSaveDataTimer = setInterval(() => {
      requestSaveData();
    }, requestSaveDataInterval);

    return () => {
      clearInterval(requestSaveDataTimer);
    };
  }, [requestSaveData, requestSaveDataInterval]);

  const { leavingPage, setLeavingPage } = useLeavePage();

  useEffect(() => {
    if (leavingPage) {
      // Request save data to Unity
      requestSaveData();
      setLeavingPage(false); // Reset the state
    }
  }, [leavingPage, setLeavingPage, requestSaveData]);

  useEffect(() => {
    inputWasd(wasdKeys);
  }, [inputWasd, wasdKeys]);

  const addButtonHandler = useCallback(() => {
    if (sampleCreateDialogRef.current) {
      setInitSampleCreateDialog(initSampleCreateDialog + 1);
      setGenerateSampleError(false);
      sampleCreateDialogRef.current.showModal();
      setIsSampleCreateDialogOpen(true);
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
        imageUrl: materialIndex > -1 ? materials[materialIndex].image : null,
        modelType: sample.type as ModelType,
      });
    },
    [materials, placeNewSample],
  );

  const sampleSelectHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].id);
      placeSampleHandler(samples[index]);
    },
    [samples, placeSampleHandler],
  );

  const sampleDragHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].id);
      const materialIndex = materials.findIndex(
        (value) => value.id === samples[index].materialId,
      );
      placeNewSampleWithDrag({
        itemId: samples[index].id,
        modelUrl: samples[index].modelUrl,
        imageUrl: materials[materialIndex].image,
        modelType: samples[index].type as ModelType,
      });
    },
    [samples, materials, placeNewSampleWithDrag],
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

  const createMaterialImageHandler = useCallback(
    async (imageUrl: string): Promise<boolean> => {
      const resp = await createMaterialImage(
        materialAPIUrl,
        {
          image: imageUrl,
        },
        [],
      );
      if (!resp) {
        return false;
      }

      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const removeBackgroundHandler = useCallback(
    async (image: string): Promise<string> => {
      const resp = await createSample("native/model/remove-bg", {
        url: image,
      });
      if (!resp) {
        return "";
      }
      return await getDownloadUrlFromPath(resp["url"]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const generateSampleHandler = async (
    sampleType: ModelType,
    image1: string,
    image2: string,
    coords: string,
  ): Promise<boolean> => {
    generateSampleType.current = sampleType;
    if (sampleType === ModelType.Poster || sampleType === ModelType.CanBadge) {
      generateModelUrl.current =
        "https://storage.googleapis.com/tobiratory-dev_media/item-models/poster/poster.glb";
      generateMaterialImage.current = image1;
      requestItemThumbnail({
        modelType: sampleType as ModelType,
        modelUrl: generateModelUrl.current,
        imageUrl: image1,
      });
    } else if (sampleType == ModelType.AcrylicStand) {
      const bodyObj = {
        bodyUrl: image1,
        baseUrl: image2,
        coords: coords,
      };
      if (image2 == null) {
        delete bodyObj.baseUrl;
      }
      if (coords == null) {
        delete bodyObj.coords;
      }
      const modelResp = await createSample(
        "native/model/acrylic-stand",
        bodyObj,
      );
      if (modelResp === false) {
        return false;
      }
      generateModelUrl.current = await getDownloadUrlFromPath(modelResp["url"]);
      generateMaterialImage.current = image1;
      requestItemThumbnail({
        modelType: ModelType.AcrylicStand,
        modelUrl: generateModelUrl.current,
        imageUrl: image1,
      });
    } else if (sampleType == ModelType.MessageCard) {
      const modelResp = await createSample("native/model/message-card", {
        url: image1,
      });
      if (modelResp === false) {
        return false;
      }
      generateModelUrl.current = await getDownloadUrlFromPath(modelResp["url"]);
      generateMaterialImage.current = null;
      requestItemThumbnail({
        modelType: ModelType.MessageCard,
        modelUrl: generateModelUrl.current,
        imageUrl: image1,
      });
    }

    return true;
  };

  const isDialogOpen = () => {
    if (isSampleCreateDialogOpen) {
      return true;
    }
    if (isShortcutDialogOpen) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const sampleDialog = sampleCreateDialogRef.current;
    const shortcutDialog = shortcutDialogRef.current;

    const handleSampleDialogClose = () => {
      setIsSampleCreateDialogOpen(false);
    };

    const handleShortcutDialogClose = () => {
      setIsShortcutDialogOpen(false);
    };

    if (sampleDialog) {
      sampleDialog.addEventListener("close", handleSampleDialogClose);
    }

    if (shortcutDialog) {
      shortcutDialog.addEventListener("close", handleShortcutDialogClose);
    }

    return () => {
      if (sampleDialog) {
        sampleDialog.removeEventListener("close", handleSampleDialogClose);
      }

      if (shortcutDialog) {
        shortcutDialog.removeEventListener("close", handleShortcutDialogClose);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative" id="workspace_view">
      <div
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{ pointerEvents: isDialogOpen() ? "none" : "auto" }}
      >
        <WorkspaceUnity unityProvider={unityProvider} />
      </div>
      {!isLoaded && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      <div className="absolute left-0 right-0 top-0 bottom-0 flex overflow-x-hidden pointer-events-none">
        <div
          style={{
            pointerEvents:
              sampleCreateDialogRef.current &&
              sampleCreateDialogRef.current.open
                ? "auto"
                : "none",
          }}
        >
          <WorkspaceSampleCreateDialog
            dialogRef={sampleCreateDialogRef}
            initDialog={initSampleCreateDialog}
            materials={materials}
            generateHandler={generateSampleHandler}
            generateError={generateSampleError}
            createMaterialImageHandler={createMaterialImageHandler}
            removeBackgroundHandler={removeBackgroundHandler}
            resetErrorHandler={() => {
              setGenerateSampleError(false);
            }}
          />
        </div>
        <div
          style={{
            pointerEvents:
              shortcutDialogRef.current && shortcutDialogRef.current.open
                ? "auto"
                : "none",
          }}
        >
          <WorkspaceShortcutDialog
            dialogRef={shortcutDialogRef}
            changeHandler={null}
          />
        </div>
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
          dragHandler={sampleDragHandler}
          showRestoreMenu={showRestoreMenu}
        />
        <div
          className="absolute left-[50%] bottom-12 h-12 flex justify-center pointer-events-auto select-none"
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
              alt="redo button"
              src="/admin/images/icon/redo-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                console.log("redo button is clicked");
              }}
            />
            <Image
              width={32}
              height={32}
              alt="visibility button"
              src={
                showDetailView
                  ? "/admin/images/icon/visibility-on-icon.svg"
                  : "/admin/images/icon/visibility-off-icon.svg"
              }
              className="cursor-pointer"
              onClick={() => {
                setShowDetailView(!showDetailView);
              }}
            />
            <Image
              width={32}
              height={32}
              alt="shortcut button"
              src="/admin/images/icon/help-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                if (shortcutDialogRef.current) {
                  shortcutDialogRef.current.showModal();
                  setIsShortcutDialogOpen(true);
                }
              }}
            />
          </div>
        </div>
        <div
          className="absolute bottom-16 right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer pointer-events-auto select-none"
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
            flex justify-center items-center cursor-pointer pointer-events-auto select-none"
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
        {showRestoreMenu && !showListView && (
          <div
            className={`absolute w-[${REMOVE_PANEL_WIDTH}px] h-full right-0 bg-secondary bg-opacity-75 backdrop-blur-sm
              flex flex-col justify-center items-center z-10 pointer-events-auto select-none`}
          >
            <Image
              width={48}
              height={48}
              src="/admin/images/icon/keyboard_return.svg"
              alt="return icon"
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
