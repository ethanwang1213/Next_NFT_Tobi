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
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToggle } from "react-use";
import {
  SendSampleRemovalResult,
  UpdateIdValues,
  WorkspaceSaveData,
} from "types/adminTypes";
import { ActionType, ModelType } from "types/unityTypes";
import { WorkspaceUnity } from "ui/molecules/CustomUnity";
import AcrylicStandSettingDialog from "ui/organisms/admin/AcrylicStandSetting";
import CustomToast from "ui/organisms/admin/CustomToast";
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
  const [showToast, setShowToast] = useState(false);
  const [mainToast, toggleMainToast] = useToggle(true);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const timerId = useRef(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const dialogRef = useRef(null);

  const [isSampleCreateDialogOpen, setIsSampleCreateDialogOpen] =
    useState(false);
  const [isShortcutDialogOpen, setIsShortcutDialogOpen] = useState(false);

  const [initSampleCreateDialog, setInitSampleCreateDialog] = useState(0);

  const workspaceAPIUrl = "native/my/workspace";
  const { data: workspaceData, postData: storeWorkspaceData } =
    useRestfulAPI(workspaceAPIUrl);

  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);
  const [selectedSampleItemId, setSelectedSampleItemId] = useState(-1);

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
      thumbUrl:
        generateSampleType.current === 1
          ? generateMaterialImage.current
          : sampleThumb,
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
    setShowRestoreMenu(false);
    const result = await storeWorkspaceData(`${workspaceAPIUrl}/throw`, {
      id: id,
    });
    sendSampleRemovalResult(id, result !== false);
  };

  const handleAction = (actionType: ActionType, text: string): void => {
    notification(text);
  };

  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const updateContainerWidth = () => {
      setContentWidth(document.querySelector("#workspace_view").clientWidth);
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  const {
    unityProvider,
    isLoaded,
    selectedSample,
    isUndoable,
    isRedoable,
    setLoadData: setWorkspaceData,
    requestSaveData,
    placeNewSample,
    placeNewSampleWithDrag,
    removeSamplesByItemId,
    requestItemThumbnail,
    inputWasd,
    pauseUnityInputs,
    resumeUnityInputs,
    undoAction,
    redoAction,
  } = useWorkspaceUnityContext({
    sampleMenuX: contentWidth - (showListView ? 448 : 30),
    onSaveDataGenerated,
    onItemThumbnailGenerated,
    onRemoveSampleEnabled,
    onRemoveSampleDisabled,
    onRemoveSampleRequested,
    onActionRedone: handleAction,
    onActionUndone: handleAction,
  });

  useEffect(() => {
    if (!isSampleCreateDialogOpen) {
      resumeUnityInputs();
    }
  }, [isSampleCreateDialogOpen, resumeUnityInputs]);

  useEffect(() => {
    if (workspaceData) {
      setWorkspaceData(workspaceData);
    }
  }, [workspaceData, setWorkspaceData]);

  useEffect(() => {
    if (selectedSample) {
      setSelectedSampleItem(selectedSample.digitalItemId);
      setSelectedSampleItemId(selectedSample.sampleItemId);
      const matchingSample = samples.find(
        (sample) => sample.digitalItemId === selectedSample.digitalItemId,
      );
      setShowSettingsButton(matchingSample?.type === 2);
    } else {
      setShowSettingsButton(false);
      setSelectedSampleItem(-1);
      setSelectedSampleItemId(-1);
    }
  }, [selectedSample, samples]);

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
    pauseUnityInputs();
  }, [initSampleCreateDialog, pauseUnityInputs]);

  useEffect(() => {
    if (router.query.trigger === "true" && isLoaded) {
      addButtonHandler();
      router.replace(`/workspace?trigger=false`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.trigger, isLoaded]);

  const placeSampleHandler = useCallback(
    (sample: SampleItem) => {
      const materialIndex = materials.findIndex(
        (value) => value.id === sample.materialId,
      );
      placeNewSample({
        sampleItemId: sample.sampleItemId,
        digitalItemId: sample.digitalItemId,
        modelUrl: sample.modelUrl,
        imageUrl:
          materialIndex > -1 ? materials[materialIndex].image : sample.thumbUrl,
        modelType: sample.type as ModelType,
        sampleName: sample.name !== null ? sample.name : "",
      });
    },
    [materials, placeNewSample],
  );

  const notification = (msg) => {
    setShowToast(false);
    toggleMainToast();
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    createToast(msg);
  };

  const createToast = (msg) => {
    setMessage(msg);
    setShowToast(true);
    timerId.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const sampleSelectHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].digitalItemId);
      setSelectedSampleItemId(samples[index].sampleItemId);
      placeSampleHandler(samples[index]);
    },
    [samples, placeSampleHandler],
  );

  const sampleDragHandler = useCallback(
    (index: number) => {
      setSelectedSampleItem(samples[index].digitalItemId);
      setSelectedSampleItemId(samples[index].sampleItemId);
      const materialIndex = materials.findIndex(
        (value) => value.id === samples[index].materialId,
      );
      placeNewSampleWithDrag({
        sampleItemId: samples[index].sampleItemId,
        digitalItemId: samples[index].digitalItemId,
        modelUrl: samples[index].modelUrl,
        imageUrl:
          materialIndex > -1
            ? materials[materialIndex].image
            : samples[index].thumbUrl,
        modelType: samples[index].type as ModelType,
        sampleName: samples[index].name !== null ? samples[index].name : "",
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
          (sample) => ids.findIndex((id) => id === sample.sampleItemId) === -1,
        );
        setSamples(newSamples);
        // remove sample items in unity view
        await removeSamplesByItemId(ids);
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

  const sampleTypeLabels: { [key: number]: string } = {
    1: "Poster",
    2: "AcrylicStand",
    3: "CanBadge",
    4: "MessageCard",
    5: "3DModel",
  };

  const trackSampleCreation = (sampleType: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      const eventName = sampleTypeLabels[sampleType] || "unknown";
      window.gtag("event", eventName, {
        event_category: "Sample",
        value: 1,
      });
    }
  };

  const generateSampleHandler = async (
    sampleType: ModelType,
    image1: string,
    image2: string,
    coords: string,
  ): Promise<boolean> => {
    generateSampleType.current = sampleType;
    trackSampleCreation(sampleType as ModelType);
    const modelUrlMap = {
      [ModelType.Poster]:
        "https://storage.googleapis.com/tobiratory-dev_media/item-models/poster/poster.glb",
      [ModelType.CanBadge]:
        "https://storage.googleapis.com/tobiratory-dev_media/item-models/can-badge/can-badge.glb",
    };

    if (modelUrlMap[sampleType]) {
      generateModelUrl.current = modelUrlMap[sampleType];
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
    } else if (sampleType == ModelType.UserUploadedModel) {
      generateModelUrl.current = image1;
      requestItemThumbnail({
        modelType: ModelType.UserUploadedModel,
        modelUrl: generateModelUrl.current,
        imageUrl: null,
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
    <div className="w-full h-full relative no-select" id="workspace_view">
      <AcrylicStandSettingDialog dialogRef={dialogRef} />
      <div
        className="absolute left-0 right-0 top-0 bottom-0"
        style={{
          pointerEvents: isDialogOpen() ? "none" : "auto",
        }}
      >
        <WorkspaceUnity unityProvider={unityProvider} isLoaded={isLoaded} />
      </div>
      {mainToast && <CustomToast show={showToast} message={message} />}
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
          <WorkspaceSampleDetailPanel
            id={selectedSampleItem}
            sampleitemId={selectedSampleItemId}
            deleteHandler={deleteSamplesHandler}
          />
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
        <div className="w-full flex justify-center absolute bottom-28 items-center">
          {showSettingsButton ? (
            <button
              className="h-12 bg-primary flex justify-between items-center px-6 gap-2 rounded-3xl z-10 pointer-events-auto"
              onClick={() => {
                dialogRef.current.showModal();
              }}
            >
              <Image
                width={32}
                height={32}
                alt="setting button"
                src="/admin/images/icon/setting-icon.svg"
                className="cursor-pointer h-[27px]"
              />
              <span className="text-[14px] font-bold text-white">
                Body/Base Ratio Settings
              </span>
            </button>
          ) : null}
        </div>
        <div className="absolute bottom-12 h-12 flex justify-center pointer-events-auto select-none w-full items-center">
          <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8 z-10">
            <button
              disabled={!isUndoable}
              className="btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0 disabled:brightness-75 disabled:bg-none disabled:bg-opacity-0"
              onClick={undoAction}
            >
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/undo-icon.svg"
                className="cursor-pointer h-[32px]"
              />
            </button>
            <button
              disabled={!isRedoable}
              className="btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0 disabled:brightness-75 disabled:bg-none disabled:bg-opacity-0"
              onClick={redoAction}
            >
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer h-[32px]"
              />
            </button>
            <button
              className="btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0"
              onClick={() => {
                setShowDetailView(!showDetailView);
                setShowListView(!showDetailView);
              }}
            >
              <Image
                width={32}
                height={32}
                alt="visibility button"
                src={
                  showDetailView
                    ? "/admin/images/icon/visibility-on-icon.svg"
                    : "/admin/images/icon/visibility-off-icon.svg"
                }
              />
            </button>
            <button
              className="btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0"
              onClick={() => {
                if (shortcutDialogRef.current) {
                  shortcutDialogRef.current.showModal();
                  setIsShortcutDialogOpen(true);
                }
              }}
            >
              <Image
                width={32}
                height={32}
                alt="shortcut button"
                src="/admin/images/icon/help-icon.svg"
              />
            </button>
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
