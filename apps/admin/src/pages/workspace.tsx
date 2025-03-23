import { getMessages } from "admin/messages/messages";
import { useLeavePage } from "contexts/LeavePageProvider";
import { WorkspaceEditUnityProvider } from "contexts/WorkspaceEditUnityContext";
import {
  getDownloadUrlFromPath,
  ImageType,
  uploadImage,
} from "fetchers/UploadActions";
import { useWorkspaceUnityHook } from "hooks/useCustomUnityHook/useWorkspaceUnityHook";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToggle } from "react-use";
import {
  WorkspaceRemoveItemRequestedHandler,
  WorkspaceSaveDataGeneratedHandler,
} from "types/adminTypes";
import { ActionType, ItemType, ModelType } from "types/unityTypes";
import { CustomUnity } from "ui/molecules/CustomUnity";
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

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
  const [createThumbnail, setCreateThumbnail] = useState(false);
  const timerId = useRef(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const dialogRef = useRef(null);
  const [matchingSample, secondaryMatchSample] = useState(null);
  const tooltip = useTranslations("Tooltip");
  const { id } = router.query;
  const sampleThumbRef = useRef<string | null>(null);

  const [isSampleCreateDialogOpen, setIsSampleCreateDialogOpen] =
    useState(false);
  const [isShortcutDialogOpen, setIsShortcutDialogOpen] = useState(false);

  const [initSampleCreateDialog, setInitSampleCreateDialog] = useState(0);

  const workspaceAPIUrl = "native/my/workspace";
  const { data: workspaceData, postData: storeWorkspaceData } =
    useRestfulAPI(workspaceAPIUrl);

  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);
  const [selectedSampleItemId, setSelectedSampleItemId] = useState(-1);
  const [hasHandlerBeenCalled, setHasHandlerBeenCalled] = useState(false);

  const sampleAPIUrl = "native/my/samples";
  const {
    data: samples,
    getData: loadSamples,
    setData: setSamples,
    postData: createSample,
    deleteData: deleteSamples,
  } = useRestfulAPI(sampleAPIUrl);

  const digitalItemsAPIUrl = "native/admin/digital_items";
  const { data: digitalItems, getData: digitalItemsData } =
    useRestfulAPI(digitalItemsAPIUrl);

  const digitalItemAPIUrl = `native/admin/digital_items/${selectedSampleItem}`;
  const {
    data: digitalItem,
    getData: digitalItemData,
    postData: postDigitalItem,
  } = useRestfulAPI(null);

  const materialAPIUrl = "native/materials";
  const {
    data: materials,
    getData: materialData,
    postData: createMaterialImage,
    deleteData,
  } = useRestfulAPI(materialAPIUrl);

  const [generateSampleError, setGenerateSampleError] = useState(false);

  const generateSampleType = useRef(null);
  const generateMaterialImage = useRef(null);
  const generateModelUrl = useRef(null);
  const generateCroppedImage = useRef(null);

  const onSaveDataGenerated: WorkspaceSaveDataGeneratedHandler = async (
    workspaceSaveData,
    newItemInfo,
    notifySavingResult,
  ) => {
    const idPairs = await storeWorkspaceData(workspaceAPIUrl, {
      itemList: workspaceSaveData.workspaceItemList,
    });
    // notify saving result to Unity
    if (typeof idPairs === "boolean" && !idPairs) {
      // failed to save
      notifySavingResult({
        isSuccess: false,
        idPairs: [],
        apiRequestId: newItemInfo.apiRequestId,
      });
    } else if (idPairs.length > 0) {
      // success to save
      notifySavingResult({
        isSuccess: true,
        idPairs: idPairs,
        apiRequestId: newItemInfo.apiRequestId,
      });
    }
  };

  const materialDeleteHandler = async (id: number) => {
    const update = await deleteData(`${materialAPIUrl}/${id}`);
    if (update) {
      materialData(materialAPIUrl);
    }
  };

  const fetchData = async () => {
    await Promise.all([
      loadSamples(sampleAPIUrl),
      digitalItemsData(digitalItemsAPIUrl),
    ]);
  };

  const onItemThumbnailGenerated = async (thumbnailBase64: string) => {
    sampleThumbRef.current = await uploadImage(
      thumbnailBase64,
      ImageType.SampleThumbnail,
    );

    const materialIndex = materials.findIndex(
      (value) => value.image === generateMaterialImage.current,
    );

    if (!createThumbnail) {
      const postData = {
        thumbUrl: sampleThumbRef.current,
        ...(generateSampleType.current === 1 || generateSampleType.current === 3
          ? { croppedUrl: generateCroppedImage.current }
          : {}),
        modelUrl: generateModelUrl.current,
        materialId: materialIndex == -1 ? 0 : materials[materialIndex].id,
        type: generateSampleType.current,
      };

      const newSample = await createSample(sampleAPIUrl, postData);
      if (newSample === false) {
        setGenerateSampleError(true);
        return;
      }
      placeSampleHandler(newSample);
      await fetchData();
    } else {
      await digitalItemData(digitalItemAPIUrl);
    }

    if (sampleCreateDialogRef.current) {
      sampleCreateDialogRef.current.close();
    }
  };

  useEffect(() => {
    if (digitalItem && createThumbnail) {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        updated_date_time,
        created_date_time,
        id,
        digital_items_id,
        ...filteredLicense
      } = digitalItem.license;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      const processDigitalItem = async () => {
        const submitData = {
          name: digitalItem.name,
          description: digitalItem.description,
          customThumbnailUrl: sampleThumbRef.current,
          isCustomThumbnailSelected: true,
          price: parseInt(digitalItem.price ?? 0),
          ...(digitalItem.status > 2 && { status: digitalItem.status }),
          startDate: digitalItem.startDate,
          endDate: digitalItem.endDate,
          quantityLimit: parseInt(digitalItem.quantityLimit),
          license: filteredLicense,
          copyrights: digitalItem.copyrights,
          schedules: digitalItem.schedules,
        };

        await postDigitalItem(digitalItemAPIUrl, submitData);
        await fetchData();

        setCreateThumbnail(false);
        dialogRef.current?.close();
      };

      processDigitalItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digitalItem, createThumbnail]);

  const onRemoveSampleEnabled = () => {
    setShowRestoreMenu(true);
  };

  const onRemoveSampleDisabled = () => {
    setShowRestoreMenu(false);
  };

  const onRemoveSampleRequested: WorkspaceRemoveItemRequestedHandler = async (
    id,
    apiRequestId,
    notifyRemoveRequestResult,
  ) => {
    setShowRestoreMenu(false);
    const result = await storeWorkspaceData(`${workspaceAPIUrl}/throw`, {
      id: id,
    });
    // notify remove result to unity
    notifyRemoveRequestResult(
      result !== false,
      ItemType.Sample,
      id,
      apiRequestId,
    );
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

  const handleNftModelGeneratedRef = useRef(null);

  const unityHookOutput = useWorkspaceUnityHook({
    sampleMenuX: contentWidth - (showListView ? 448 : 30),
    onSaveDataGenerated,
    onItemThumbnailGenerated,
    onRemoveSampleEnabled,
    onRemoveSampleDisabled,
    onRemoveSampleRequested,
    onActionRedone: handleAction,
    onActionUndone: handleAction,
    onNftModelGenerated: handleNftModelGeneratedRef.current,
  });

  const handleChangeThumbnail = async (itemid: number, newRatio: number) => {
    setCreateThumbnail(true);
    applyAcrylicBaseScaleRatio(itemid, newRatio);
    requestItemThumbnail({
      modelType: 2,
      modelUrl: matchingSample.modelUrl,
      acrylicBaseScaleRatio: newRatio,
      imageUrl: "",
    });
  };

  const {
    isSceneOpen,
    isItemsLoaded,
    isUndoable,
    isRedoable,
    selectedSample,
    setLoadData,
    resumeUnityInputs,
    pauseUnityInputs,
    requestSaveData,
    highlightSamplesByItemId,
    placeNewSample,
    placeNewSampleWithDrag,
    removeSamplesByItemId,
    requestItemThumbnail,
    undoAction,
    redoAction,
    applyAcrylicBaseScaleRatio,
    handleMouseUp,
    deleteAllActionHistory,
  } = unityHookOutput;

  useEffect(() => {
    if (!isSampleCreateDialogOpen) {
      resumeUnityInputs();
    }
  }, [isSampleCreateDialogOpen, resumeUnityInputs]);

  useEffect(() => {
    if (id) {
      const resetWorkspaceData = { ...workspaceData, workspaceItemList: [] };
      setLoadData(resetWorkspaceData);

      if (isItemsLoaded) {
        const sampleIndex = samples.findIndex(
          (sample) => sample.digitalItemId === Number(id),
        );

        if (sampleIndex !== -1) {
          sampleSelectHandler(sampleIndex);
        }
      }
    } else if (workspaceData) {
      setLoadData(workspaceData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, workspaceData, isItemsLoaded]);

  useEffect(() => {
    if (!selectedSample || !samples) {
      if (!hasHandlerBeenCalled) {
        setShowSettingsButton(false);
        setSelectedSampleItem(-1);
        setSelectedSampleItemId(-1);
      }
      return;
    }
    const { digitalItemId, sampleItemId } = selectedSample;
    setSelectedSampleItem(digitalItemId);
    setSelectedSampleItemId(sampleItemId);
    setHasHandlerBeenCalled(false);
    const matchingSample = samples.find(
      (sample) => sample.digitalItemId === digitalItemId,
    );
    setShowSettingsButton(matchingSample?.type === 2);
    secondaryMatchSample(matchingSample);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSample, samples, hasHandlerBeenCalled]);

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
    if (router.query.trigger === "true" && isItemsLoaded) {
      addButtonHandler();
      router.replace(`/workspace?trigger=false`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.trigger, isItemsLoaded]);

  const placeSampleHandler = useCallback(
    (sample: SampleItem) => {
      if (sample) {
        placeNewSample({
          itemId: sample.sampleItemId,
          digitalItemId: sample.digitalItemId,
          modelUrl: sample.modelUrl,
          imageUrl: sample.croppedUrl ?? "",
          acrylicBaseScaleRatio: sample.acrylicBaseScaleRatio ?? 1,
          modelType: sample.type as ModelType,
          sampleName: sample.name !== null ? sample.name : "",
        });
      }
    },
    [placeNewSample],
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

  const selectedSampleHandler = (index: number) => {
    if (index !== -1 && samples) {
      setHasHandlerBeenCalled(true);
      setSelectedSampleItem(samples[index].digitalItemId);
      highlightSamplesByItemId(samples[index].sampleItemId);
      const matchingSample = samples.find(
        (sample) => sample.digitalItemId === samples[index].digitalItemId,
      );
      setShowSettingsButton(matchingSample?.type === 2);
      secondaryMatchSample(matchingSample);
    } else {
      setShowSettingsButton(false);
      setSelectedSampleItem(-1);
      setSelectedSampleItemId(-1);
    }
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
      placeNewSampleWithDrag({
        itemId: samples[index].sampleItemId,
        digitalItemId: samples[index].digitalItemId,
        modelUrl: samples[index].modelUrl,
        imageUrl: samples[index].croppedUrl ?? "",
        acrylicBaseScaleRatio: samples[index].acrylicBaseScaleRatio ?? 1,
        modelType: samples[index].type as ModelType,
        sampleName: samples[index].name !== null ? samples[index].name : "",
      });
    },
    [samples, placeNewSampleWithDrag],
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
      generateCroppedImage.current = image1;
      generateMaterialImage.current = image2;
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
    <WorkspaceEditUnityProvider unityContext={unityHookOutput}>
      <div className="w-full h-full relative no-select" id="workspace_view">
        <div
          className="absolute left-0 right-0 top-0 bottom-0"
          style={{
            pointerEvents: isDialogOpen() ? "none" : "auto",
          }}
        >
          <CustomUnity
            isSceneOpen={isSceneOpen}
            handleMouseUp={handleMouseUp}
          />
        </div>
        {mainToast && <CustomToast show={showToast} message={message} />}
        <AcrylicStandSettingDialog
          selectedItem={selectedSampleItemId}
          dialogRef={dialogRef}
          data={matchingSample}
          scaleRatioSettingHandler={handleChangeThumbnail}
          loading={createThumbnail}
        />
        {!isItemsLoaded && (
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-[#00000080] z-20">
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
              deleteHandler={materialDeleteHandler}
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
            <WorkspaceShortcutDialog dialogRef={shortcutDialogRef} />
          </div>
          <WorkspaceSampleDetailPanel
            id={selectedSampleItem}
            isVisible={showDetailView}
            digitalItems={digitalItems}
            sampleitemId={selectedSampleItemId}
            deleteHandler={deleteSamplesHandler}
            handleNftModelGeneratedRef={handleNftModelGeneratedRef}
            deleteAllActionHistory={deleteAllActionHistory}
          />
          <WorkspaceSampleListPanel
            closeHandler={() => setShowListView(false)}
            isOpen={showListView}
            data={samples}
            createHandler={() => {
              setShowListView(false);
              addButtonHandler();
            }}
            setShowDetailView={setShowDetailView}
            selectHandler={sampleSelectHandler}
            deleteHandler={deleteSamplesHandler}
            dragHandler={sampleDragHandler}
            showRestoreMenu={showRestoreMenu}
            selectedSampleHandler={(index) => selectedSampleHandler(index)}
          />
          <div className="absolute z-30 bottom-12 h-12 flex justify-center pointer-events-auto select-none w-full items-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8 z-10">
              <button
                disabled={!isUndoable}
                className="group btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0 disabled:brightness-75 disabled:bg-none disabled:bg-opacity-0 relative"
                onClick={undoAction}
              >
                <Image
                  width={32}
                  height={32}
                  alt="undo button"
                  src="/admin/images/icon/undo-icon.svg"
                  className="cursor-pointer h-[32px]"
                />
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 text-sm text-white bg-gray-800 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs">
                  {tooltip("Undo")}
                </span>
              </button>
              <button
                disabled={!isRedoable}
                className="group relative btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0 disabled:brightness-75 disabled:bg-none disabled:bg-opacity-0"
                onClick={redoAction}
              >
                <Image
                  width={32}
                  height={32}
                  alt="redo button"
                  src="/admin/images/icon/redo-icon.svg"
                  className="cursor-pointer h-[32px]"
                />
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 text-sm text-white bg-gray-800 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs">
                  {tooltip("Redo")}
                </span>
              </button>
              <button
                className="group relative btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0"
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
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 text-sm text-white bg-gray-800 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs">
                  {tooltip("ToggleUIVisibility")}
                </span>
              </button>
              <button
                className="group btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0 disabled:brightness-75 disabled:bg-none disabled:bg-opacity-0 relative"
                disabled={!showSettingsButton}
                onClick={() => {
                  if (showSettingsButton) {
                    dialogRef.current?.showModal();
                  }
                }}
              >
                <Image
                  width={24}
                  height={24}
                  alt="acrylic button"
                  src="/admin/images/icon/acrylic-settings-icon.svg"
                  className="cursor-pointer h-[24px]"
                />
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 text-sm text-white bg-gray-800 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs">
                  {tooltip("VisualSetting")}
                </span>
              </button>
              <button
                className="group relative btn btn-ghost w-[32px] h-[32px] min-h-[32px] hover:bg-none hover:bg-opacity-0 border-0 p-0"
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
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 text-sm text-white bg-gray-800 px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs">
                  {tooltip("Help")}
                </span>
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
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
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
    </WorkspaceEditUnityProvider>
  );
}
