import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useWorkspaceEditUnity } from "contexts/WorkspaceEditUnityContext";
import { decodeBase64ToBinary, uploadData } from "fetchers/UploadActions";
import useFcmToken from "hooks/useFCMToken";
import useFinalizeModel from "hooks/useFinalizeModel";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Button from "ui/atoms/Button";
import { formatDateToLocal } from "ui/atoms/Formatters";
import DeleteConfirmDialog2 from "./DeleteConfirmDialog2";
import MintConfirmDialog2 from "./MintConfirmDialog";
import SampleDetailDialog from "./SampleDetailDialog";

interface SampleDetailViewProps {
  id: number;
  sampleitemId: number;
  digitalItems: any;
  section: string;
  handleNftModelGeneratedRef: React.MutableRefObject<
    (itemId: number, nftModelBase64: string) => void
  >;
  deleteHandler: (ids: number[]) => void;
  deleteAllActionHistory: () => void;
}

const MintNotification = ({ title, text }) => {
  return (
    <div className="p-[10px] bg-secondary-900 flex flex-col items-center gap-4">
      <span className="text-base text-base-white font-bold text-center">
        {title}
      </span>
      <span className="text-sm text-base-white font-normal text-center">
        {text}
      </span>
    </div>
  );
};

const SampleDetailView: React.FC<SampleDetailViewProps> = ({
  id,
  section,
  digitalItems,
  sampleitemId,
  handleNftModelGeneratedRef,
  deleteHandler,
  deleteAllActionHistory,
}) => {
  const [data, setData] = useState<any>(null);
  const [minting, setMinting] = useState(false);
  const [loading, setLoading] = useState(true);
  const dialogRef = useRef(null);
  const apiUrl = `native/admin/digital_items/${id}`;
  const { data: digitalItem, getData, postData } = useRestfulAPI(null);
  const mintConfirmDialogRef = useRef(null);
  const deleteConfirmDialogRef = useRef(null);
  const { token: fcmToken } = useFcmToken();
  const [finalizeModelError] = useFinalizeModel();
  const { pauseUnityInputs, requestNftModelGeneration } =
    useShowcaseEditUnity();
  const {
    requestNftModelGeneration: workspaceRequestNftModelGeneration,
    pauseUnityInputs: workspacePauseUnityInputs,
  } = useWorkspaceEditUnity();
  const t = useTranslations("Workspace");
  const s = useTranslations("Showcase");

  useEffect(() => {
    if (finalizeModelError) {
      toast(finalizeModelError.toString());
    }
  }, [finalizeModelError]);

  const handleNftModelGenerated = useCallback(
    async (itemId: number, nftModelBase64: string) => {
      let modelUrl: string | undefined;

      if (nftModelBase64) {
        const binaryData = decodeBase64ToBinary(nftModelBase64);
        modelUrl = await uploadData(binaryData);
      }

      const payload: { fcmToken: string; amount: number; modelUrl?: string } = {
        fcmToken: fcmToken,
        amount: 1,
        ...(digitalItem?.metaModelUrl || data?.metaModelUrl
          ? {}
          : { modelUrl }),
      };

      const result = await postData(`native/items/${itemId}/mint`, payload);

      if (!result) {
        toast(
          <MintNotification
            title={s("MintFailed")}
            text={s("MintFailedLimitExceeded")}
          />,
          {
            className: "mint-notification",
          },
        );
      } else {
        deleteAllActionHistory();
        trackSampleMint(data?.modelType);
        await getData(apiUrl);
        setData(digitalItem);
      }
      setMinting(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fcmToken, digitalItem, data],
  );

  handleNftModelGeneratedRef.current = handleNftModelGenerated;

  useEffect(() => {
    if (id > 0 && digitalItems) {
      const matchedItem = digitalItems.find((item) => item.id === id);
      setData(matchedItem);
    } else {
      setData(null);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calculateTotalDays = (): number => {
    if (!data.startDate) return 0;

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const differenceInMs: number = end.getTime() - start.getTime();
    const daysDifference: number = differenceInMs / (1000 * 60 * 60 * 24);

    return Math.floor(daysDifference);
  };

  const getDefaultLicense = (license) => {
    return Object.entries(license).map(([key, value]) => {
      if (typeof value === "boolean") {
        return (
          <div key={key}>
            {key.toUpperCase()} : {value ? "OK" : "NG"}
            <br />
          </div>
        );
      }
    });
  };

  const trackSampleMint = useCallback((sampleType: number) => {
    const sampleTypeLabels: { [key: number]: string } = {
      1: "Poster",
      2: "AcrylicStand",
      3: "CanBadge",
      4: "MessageCard",
      5: "UserUploadedModel",
    };

    const eventLabel = sampleTypeLabels[sampleType] || "unknown";
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "mint_sample", {
        event_category: "MintedCount",
        event_label: eventLabel,
        value: 1,
      });
    }
  }, []);

  const mintConfirmDialogHandler = useCallback(
    async (value: string) => {
      if (value === "cancel") {
        return;
      }

      if (value === "mint" && data) {
        setMinting(true);
        if (data.metaModelUrl) {
          handleNftModelGenerated(data.id, "");
        } else {
          const requestPayload = {
            itemId: data.id,
            modelType: data.type,
            modelUrl: data.modelUrl,
            imageUrl: data.materialUrl || data.customThumbnailUrl,
          };
          
          if (section === "showcase") {
            requestNftModelGeneration(requestPayload);
          } else {
            workspaceRequestNftModelGeneration(requestPayload);
          }
        }
      }
    },
    [
      data,
      section,
      requestNftModelGeneration,
      handleNftModelGenerated,
      workspaceRequestNftModelGeneration,
    ],
  );

  const deleteConfirmDialogHandler = useCallback(
    (value: string) => {
      if (value == "delete") {
        deleteAllActionHistory();
        deleteHandler([sampleitemId]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteHandler],
  );

  return (
    <div className="w-full h-full">
      {loading && data ? (
        <span className="h-full w-full loading loading-spinner"></span>
      ) : (
        <div className="w-full h-full gap-6 flex flex-col justify-center items-center text-base-white">
          <span className="text-base font-semibold ">{data?.content.name}</span>
          <span className="text-2xl font-bold text-center">
            {data ? data.name || t("ItemTitle") : ""}
          </span>
          <Image
            width={160}
            height={160}
            src={
              data
                ? data.isCustomThumbnailSelected
                  ? data.customThumbnailUrl
                  : data.defaultThumbnailUrl
                : "/admin/images/png/empty-image.png"
            }
            alt="image"
            onClick={() => {
              dialogRef.current.showModal();
              if (section === "workspace") {
                workspacePauseUnityInputs;
              } else {
                pauseUnityInputs();
              }
            }}
            className="rounded-lg h-[160px] w-[160px] cursor-pointer transition-transform hover:scale-105"
          />
          <div
            className="w-full shrink overflow-y-auto flex flex-col gap-4"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] font-normal text-center">
              {data?.description}
            </span>
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("Creator")}
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.content.name ? data?.content.name : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("Copyright")}
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.copyrights.length
                    ? data.copyrights.map((copyright, index) => (
                        <span key={index}>
                          {index > 0 && ", "}©{copyright.name}
                        </span>
                      ))
                    : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("License")}
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.license ? getDefaultLicense(data.license) : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("DateAcquired")}
                </span>
                <div className="text-[10px] font-medium w-[168px]">
                  {data?.startDate ? formatDateToLocal(data.startDate) : "-"}
                  {data && <br />}
                  {data?.startDate && `Owned for ${calculateTotalDays()} days`}
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("History")}
                </span>
                {data &&
                Array.isArray(data.ownerHistory) &&
                data.ownerHistory.length > 0 ? (
                  <div className="grid grid-cols-5">
                    {data.ownerHistory.map((history) => (
                      <div key={history.uid}>
                        <Image
                          src={history.avatar}
                          className={
                            "rounded-full cursor-pointer border-1 border-white"
                          }
                          alt="avatar"
                          width={12}
                          height={12}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] font-medium w-[168px]">-</span>
                )}
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[90px] text-right">
                  {t("SerialNumber")}
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.serialNumber ? data.serialNumber : "-"}
                </span>
              </div>
            </div>
            <SampleDetailDialog data={data} dialogRef={dialogRef} />
            {data && (
              <div className="mx-auto mt-4">
                <Link
                  href={`/items/detail?id=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-[192px] h-[46px] rounded-[30px] bg-primary flex justify-center items-center gap-2">
                    <Image
                      src="/admin/images/icon/open_in_new.svg"
                      width={24}
                      height={24}
                      alt="open icon"
                    />
                    <span className="text-base-white text-base font-bold">
                      {t("EditItemData")}
                    </span>
                  </Button>
                </Link>
              </div>
            )}
            {data && (
              <div className="mx-auto">
                <Button
                  className={`w-[192px] h-[46px] shrink-0 rounded-[30px] flex justify-center items-center  ${
                    minting ? "bg-[#9A4500] gap-6" : "bg-[#E96700] gap-2"
                  }`}
                  disabled={minting}
                  onClick={() => {
                    if (mintConfirmDialogRef.current) {
                      mintConfirmDialogRef.current.showModal();
                    }
                  }}
                >
                  {minting ? (
                    <div className="flex justify-center">
                      <span className="loading loading-spinner bg-white text-info loading-md" />
                    </div>
                  ) : (
                    <Image
                      src="/admin/images/icon/sample-icon.svg"
                      width={16}
                      height={20}
                      alt="mint icon"
                    />
                  )}
                  <span className="text-base-white text-base font-bold">
                    {minting ? t("Minting") : t("MintAsNFT")}
                  </span>
                </Button>
              </div>
            )}
            <MintConfirmDialog2
              dialogRef={mintConfirmDialogRef}
              changeHandler={mintConfirmDialogHandler}
            />
            <DeleteConfirmDialog2
              dialogRef={deleteConfirmDialogRef}
              changeHandler={deleteConfirmDialogHandler}
            />
            {data && section == "workspace" && (
              <div className="mt-4 w-[244px] text-right">
                <Button
                  onClick={() => {
                    if (deleteConfirmDialogRef.current) {
                      deleteConfirmDialogRef.current.showModal();
                    }
                  }}
                >
                  <Image
                    src="/admin/images/icon/trash.svg"
                    width={24}
                    height={24}
                    alt="trash icon"
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleDetailView;
