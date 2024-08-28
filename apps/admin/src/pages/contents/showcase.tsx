import { useLeavePage } from "contexts/LeavePageProvider";
import { ImageType, uploadImage } from "fetchers/UploadActions";
import { useShowcaseEditUnityContext } from "hooks/useCustomUnityContext";
import useRestfulAPI from "hooks/useRestfulAPI";
import useWASDKeys from "hooks/useWASDKeys";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useToggle } from "react-use";
import { SendItemRemovalResult, ShowcaseSaveData } from "types/adminTypes";
import { ItemType, ModelType, SettingsUpdatePhase } from "types/unityTypes";
import Button from "ui/atoms/Button";
import { ShowcaseEditUnity } from "ui/molecules/CustomUnity";
import CustomToast from "ui/organisms/admin/CustomToast";
import ShowcaseNameEditDialog from "ui/organisms/admin/ShowcaseNameEditDialog";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";
import { NftItem, SampleItem } from "ui/types/adminTypes";

const Showcase = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showDetailView, setShowDetailView] = useState(false);
  const [showSampleDetailView, setShowSampleDetailView] = useState(false);
  const [showSmartFrame, setShowSmartFrame] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [mainToast, toggleMainToast] = useToggle(true);
  const [message, setMessage] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedSampleItem, setSelectedSampleItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const apiUrl = "native/admin/showcases";
  const {
    data: showcaseData,
    error,
    getData,
    putData,
    postData,
  } = useRestfulAPI(null);
  const timerId = useRef(null);

  const { data: materialData } = useRestfulAPI("native/materials");
  const wasdKeys = useWASDKeys();
  const [showRestoreMenu, setShowRestoreMenu] = useState(false);

  // showcase unity view event handlers
  const onSaveDataGenerated = async (
    showcaseSaveData: ShowcaseSaveData,
    updateIdValues,
  ) => {
    const thumbnailUrl = await uploadImage(
      showcaseSaveData.thumbnailImageBase64,
      ImageType.ShowcaseThumbnail,
    );
    const IdPairs = await postData(`${apiUrl}/${id}`, {
      sampleItemList: showcaseSaveData.sampleItemList,
      nftItemList: showcaseSaveData.nftItemList,
      thumbnailImage: thumbnailUrl,
      settings: {
        wallpaper: {
          tint: wt,
        },
        floor: {
          tint: ft,
        },
        lighting: {
          sceneLight: {
            tint: st,
            brightness: sb,
          },
          pointLight: {
            tint: pt,
            brightness: pb,
          },
        },
      },
    });
    updateIdValues({ idPairs: IdPairs });
  };

  const onRemoveItemEnabled = () => {
    setShowRestoreMenu(true);
  };

  const onRemoveItemDisabled = () => {
    setShowRestoreMenu(false);
  };

  const onRemoveItemRequested = async (
    itemType: ItemType,
    uniqueId: number,
    itemId: number,
    sendItemRemovalResult: SendItemRemovalResult,
  ) => {
    // hide the restore menu
    setShowRestoreMenu(false);
    let postResult;
    if (itemType === ItemType.Sample) {
      postResult = await postData(`${apiUrl}/${id}/throw`, {
        sampleRelationId: uniqueId,
      });
    }
    if (itemType === ItemType.DigitalItemNft) {
      postResult = await postData(`${apiUrl}/${id}/throw`, {
        nftRelationId: uniqueId,
      });
      // update remains count for NFT item
    }
    if (postResult == "thrown") {
      sendItemRemovalResult(itemType, uniqueId, true);
    } else {
      sendItemRemovalResult(itemType, uniqueId, false);
    }
  };

  const [contentWidth, setContentWidth] = useState(0);

  const {
    isLoaded,
    unityProvider,
    setLoadData,
    requestSaveData,
    placeNewSample,
    placeNewNft,
    placeNewSampleWithDrag,
    placeNewNftWithDrag,
    updateSettings,
    inputWasd,
    isUndoable,
    selectedItem,
  } = useShowcaseEditUnityContext({
    itemMenuX: contentWidth - (showDetailView ? 504 : 30),
    onSaveDataGenerated,
    onRemoveItemEnabled,
    onRemoveItemDisabled,
    onRemoveItemRequested,
  });

  const { leavingPage, setLeavingPage } = useLeavePage();

  useEffect(() => {
    if (leavingPage) {
      // Request save data to Unity
      requestSaveData();
      setLeavingPage(false); // Reset the state
    }
  }, [leavingPage, setLeavingPage, requestSaveData]);

  const handleButtonClick = (msg) => {
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

  const changeShowcaseDetail = async (title: string, description: string) => {
    setLoading(true);
    const jsonData = await putData(`${apiUrl}/${id}`, { title, description });
    if (jsonData) {
      showcaseData.title = jsonData.title;
      showcaseData.description = jsonData.description;
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
    setLoading(false);
  };

  // load showcase data
  useEffect(() => {
    if (id) {
      getData(`${apiUrl}/${id}`); // update showcaseData state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [wt, setWt] = useState("#717171");
  const [ft, setFt] = useState("#717171");
  const [st, setSt] = useState("#717171");
  const [sb, setSb] = useState(70);
  const [pt, setPt] = useState("#717171");
  const [pb, setPb] = useState(70);

  useEffect(() => {
    if (showcaseData != undefined) {
      setWt(showcaseData.settings.wallpaper.tint ?? "#717171");
      setFt(showcaseData.settings.floor.tint ?? "#717171");
      setSt(showcaseData.settings.lighting.sceneLight.tint ?? "#717171");
      setSb(showcaseData.settings.lighting.sceneLight.brightness ?? 1);
      setPt(showcaseData.settings.lighting.pointLight.tint ?? "#717171");
      setPb(showcaseData.settings.lighting.pointLight.brightness ?? 1);
    }
  }, [showcaseData]);
  // set showcase data to unity view when it is loaded
  useEffect(() => {
    if (showcaseData) {
      setLoadData(showcaseData);
    }
  }, [showcaseData, setLoadData]);

  useEffect(() => {
    if (selectedItem) {
      setShowSampleDetailView(true);
      setSelectedSampleItem(selectedItem.digitalItemId);
    } else {
      setShowSampleDetailView(false);
    }
  }, [selectedItem]);

  const requestSaveDataInterval = 1000 * 60 * 5; // 5minutes
  useEffect(() => {
    // Initialize timer
    const requestSaveDataTimer = setInterval(() => {
      requestSaveData();
    }, requestSaveDataInterval);

    return () => {
      clearInterval(requestSaveDataTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSaveDataInterval, requestSaveData]);

  useEffect(() => {
    const updateContainerWidth = () => {
      const height = document.querySelector(".w-full.h-full").clientHeight;
      const width = Math.ceil((height / 16) * 9);
      setContainerWidth(width);

      setContentWidth(document.querySelector(".w-full.h-full").clientWidth);
    };

    // Update container width on mount and window resize
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  useEffect(() => {
    inputWasd(wasdKeys);
  }, [inputWasd, wasdKeys]);

  const selectSampleHandler = useCallback(
    (sample: SampleItem, isDrag: boolean) => {
      const imageUrl =
        materialData.find((material) => material.id === sample.materialId)
          ?.image || "";
      const sampleData = {
        sampleItemId: sample.sampleItemId,
        digitalItemId: sample.digitalItemId,
        modelType: sample.type as ModelType,
        modelUrl: sample.modelUrl,
        imageUrl,
        sampleName: sample.name !== null ? sample.name : "",
      };

      isDrag ? placeNewSampleWithDrag(sampleData) : placeNewSample(sampleData);
    },
    [materialData, placeNewSample, placeNewSampleWithDrag],
  );

  const selectNftHandler = useCallback(
    (nft: NftItem, isDrag: boolean) => {
      // place a new item
      if (!isDrag)
        placeNewNft({
          nftId: nft.sampleItemId,
          digitalItemId: nft.digitalItemId,
          modelType: nft.modelType as ModelType,
          modelUrl: nft.modelUrl,
          isDebug: true,
          nftName: nft.name !== null ? nft.name : "",
        });
      else
        placeNewNftWithDrag({
          nftId: nft.sampleItemId,
          digitalItemId: nft.digitalItemId,
          modelType: nft.modelType as ModelType,
          modelUrl: nft.modelUrl,
          isDebug: true,
          nftName: nft.name !== null ? nft.name : "",
        });
    },
    [placeNewNft, placeNewNftWithDrag],
  );

  const updateUnityViewSettings = (
    wt: string,
    ft: string,
    st: string,
    sb: number,
    pt: string,
    pb: number,
  ) => {
    setWt(wt);
    setFt(ft);
    setSt(st);
    setSb(sb);
    setPt(pt);
    setPb(pb);

    /// TODO(Murat) by Toruto: modify updating settings for undo/redo feature
    /// Set the `phase` argument as `SettingsUpdatePhase.Updating`
    ///   while operating a GUI for updating settings
    ///   such like dragging a slider, dragging a color picker, etc.
    /// Set the `phase` argument as `SettingsUpdatePhase.Ended`
    ///   when operating the GUI is ended
    ///   such like releassed a slider, released a color picker, etc.
    ///   And, with this phase, the change of settings is registered on action history for undo/redo.

    /// NOTE(Toruto): After the implementation, please remove this comment.

    updateSettings({
      wallpaper: {
        tint: wt,
      },
      floor: {
        tint: ft,
      },
      lighting: {
        sceneLight: {
          tint: st,
          brightness: sb,
        },
        pointLight: {
          tint: pt,
          brightness: pb,
        },
      },
      phase: SettingsUpdatePhase.Updating,
    });
  };

  return (
    <div className="w-full h-screen-minus-56 relative">
      <ShowcaseEditUnity unityProvider={unityProvider} />
      {!isLoaded && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
        </div>
      )}
      <div className="pointer-events-none absolute left-0 right-0 top-0 bottom-0">
        <div
          className="pointer-events-auto absolute top-0 right-0 flex justify-center mx-auto mt-[24px]"
          style={{
            width: `${containerWidth}px`,
            left: `${320 - 424}px`,
          }}
        >
          <span className="text-xl font-semibold text-[#858585] text-center mr-1">
            {showcaseData ? (
              showcaseData.title
            ) : (
              <span className="loading loading-spinner"></span>
            )}
          </span>
          {/* <div className="relative">
            <button
              className={`${
                loading
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100 pointer-events-auto"
              } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
              onClick={() => dialogRef.current.showModal()}
            >
              Submit
            </button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
              </div>
            )}
          </div> */}
          {loading && <span className="loading loading-spinner"></span>}
          {!loading && (
            <Button onClick={() => dialogRef.current.showModal()}>
              <Image
                width={24}
                height={24}
                src="/admin/images/icon/pencil.svg"
                alt="pencil icon"
              />
            </Button>
          )}
        </div>
        <ShowcaseSampleDetail
          showSampleDetailView={showSampleDetailView}
          showDetailView={showDetailView}
          id={selectedSampleItem}
        />
        {/* Align component in the center */}
        {/* 320px: width of left component. 424px: width of right component. */}
        <div
          className="w-[336px] mt-[72px] absolute"
          style={{ left: "calc(318px + (100% - 318px - 432px - 336px) / 2)" }}
        >
          {mainToast && <CustomToast show={showToast} message={message} />}
          {!mainToast && <CustomToast show={showToast} message={message} />}
        </div>
        <div
          className="pointer-events-auto w-[336px] bottom-0 absolute"
          style={{ left: "calc(318px + (100% - 318px - 432px - 336px) / 2)" }}
        >
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8 z-10">
              <Button disabled={isUndoable}>
                <Image
                  width={32}
                  height={32}
                  alt="undo button"
                  src="/admin/images/icon/undo-icon.svg"
                  className="cursor-pointer"
                  onClick={() =>
                    handleButtonClick("undo: Deleted Sample Item A ")
                  }
                />
              </Button>

              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer"
                onClick={() =>
                  handleButtonClick("redo: Deleted Sample Item A ")
                }
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src={
                  showSmartFrame
                    ? "/admin/images/icon/crop-on-icon.svg"
                    : "/admin/images/icon/crop-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowSampleDetailView(!showSampleDetailView);
                  setShowSmartFrame(!showSmartFrame);
                  handleButtonClick(
                    showSmartFrame
                      ? "The smartphone frame is visibly"
                      : "The smartphone frame is disable",
                  );
                }}
              />
              <Image
                width={32}
                height={32}
                alt="toggle button"
                src={
                  showDetailView
                    ? "/admin/images/icon/visibility-on-icon.svg"
                    : "/admin/images/icon/visibility-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowSampleDetailView(!showDetailView);
                  setShowDetailView(!showDetailView);
                  handleButtonClick(
                    showDetailView ? "The UI is hidden" : "The UI is shown",
                  );
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/help-icon.svg"
                className="cursor-pointer"
                onClick={() => handleButtonClick("help button is clicked")}
              />
            </div>
          </div>
        </div>
        {showDetailView && (
          <ShowcaseTabView
            clickSampleItem={(item: SampleItem) =>
              selectSampleHandler(item, false)
            }
            dragSampleItem={(item: SampleItem) =>
              selectSampleHandler(item, true)
            }
            clickNftItem={(item: NftItem) => selectNftHandler(item, false)}
            dragNftItem={(item: NftItem) => selectNftHandler(item, true)}
            showRestoreMenu={showRestoreMenu}
            settings={showcaseData?.settings}
            updateUnityViewSettings={(
              wt: string,
              ft: string,
              st: string,
              sb: number,
              pt: string,
              pb: number,
            ) => {
              updateUnityViewSettings(wt, ft, st, sb, pt, pb);
            }}
          />
        )}
        {showRestoreMenu && !showDetailView && (
          <div
            className="pointer-events-auto absolute w-[112px] h-full right-0 bg-secondary bg-opacity-75 backdrop-blur-sm
              flex flex-col justify-center items-center z-10 select-none"
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
        <ShowcaseNameEditDialog
          showcaseTitle={showcaseData?.title ?? ""}
          showcaseDescription={showcaseData?.description ?? ""}
          dialogRef={dialogRef}
          changeHandler={changeShowcaseDetail}
        />
      </div>
    </div>
  );
};

export default Showcase;
