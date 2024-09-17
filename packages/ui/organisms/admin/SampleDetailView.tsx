import { useWorkspaceUnityContext } from "hooks/useCustomUnityContext";
import useFcmToken from "hooks/useFCMToken";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Button from "ui/atoms/Button";
import { formatDateToLocal } from "ui/atoms/Formatters";
import DeleteConfirmDialog2 from "./DeleteConfirmDialog2";
import MintConfirmDialog2 from "./MintConfirmDialog";
import SampleDetailDialog from "./SampleDetailDialog";

interface SampleDetailViewProps {
  id: number;
  sampleitemId: number;
  section: string;
  deleteHandler: (ids: number[]) => void;
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
  sampleitemId,
  deleteHandler,
}) => {
  const dialogRef = useRef(null);
  const apiUrl = `native/admin/digital_items/${id}`;
  const { data, loading, getData, postData } = useRestfulAPI(null);
  const mintConfirmDialogRef = useRef(null);
  const deleteConfirmDialogRef = useRef(null);
  const { token: fcmToken } = useFcmToken();
  const { deleteAllActionHistory } = useWorkspaceUnityContext({});

  useEffect(() => {
    if (id > 0) {
      getData(apiUrl);
    }
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
      if (value === "mint") {
        const result = await postData(`native/items/${id}/mint`, {
          fcmToken: fcmToken,
          amount: 1,
          modelUrl: data.modelUrl,
        });

        if (!result) {
          toast(
            <MintNotification
              title="Mint failed"
              text="The daily transaction limit has been exceeded, so Mint could not be completed."
            />,
            {
              className: "mint-notification",
            },
          );
        } else {
          deleteAllActionHistory();
          trackSampleMint(data.modelType);
        }
      }
    },
    [data, fcmToken, id, postData, deleteAllActionHistory, trackSampleMint],
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
      {loading ? (
        <span className="h-full w-full loading loading-spinner"></span>
      ) : (
        <div className="w-full h-full gap-6 flex flex-col justify-center items-center text-base-white">
          <span className="text-base font-semibold ">{data?.content.name}</span>
          <span className="text-2xl font-bold text-center">
            {data ? data.name || "Unnamed Sample item" : ""}
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
            }}
            className="rounded-lg"
          />
          <div
            className="w-full shrink overflow-y-auto flex flex-col gap-6"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] font-normal text-center">
              {data?.description}
            </span>
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[76px] text-right">
                  Creator
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.content.name ? data?.content.name : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[76px] text-right">
                  Copyright
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.copyrights.length
                    ? `@${data?.copyrights.join(" @")}`
                    : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[76px] text-right">
                  License
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {data?.license ? data.license : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[76px] text-right">
                  Date Acquired
                </span>
                <div className="text-[10px] font-medium w-[168px]">
                  {data?.startDate ? formatDateToLocal(data.startDate) : "-"}
                  {data && <br />}
                  {data?.startDate && `Owned for ${calculateTotalDays()} days`}
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-medium w-[76px] text-right">
                  History
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
                <span className="text-[10px] font-medium w-[76px] text-right">
                  Serial Number
                </span>
                <span className="text-[10px] font-medium w-[168px]">
                  {" "}
                  {data?.serialNumber ? data.serialNumber : "-"}
                </span>
              </div>
            </div>
            {section === "showcase" && (
              <SampleDetailDialog data={data} dialogRef={dialogRef} />
            )}
            {data && (
              <div className="mx-auto mt-12">
                <Link href={`/items/detail?id=${id}`}>
                  <Button className="w-[192px] h-[46px] rounded-[30px] bg-primary flex justify-center items-center gap-2">
                    <Image
                      src="/admin/images/icon/open_in_new.svg"
                      width={24}
                      height={24}
                      alt="open icon"
                    />
                    <span className="text-base-white text-base font-bold">
                      Edit Item Data
                    </span>
                  </Button>
                </Link>
              </div>
            )}
            {data && (
              <div className="mx-auto">
                <Button
                  className="w-[192px] h-[46px] shrink-0 rounded-[30px] bg-[#E96700] flex justify-center items-center gap-2"
                  onClick={() => {
                    if (mintConfirmDialogRef.current) {
                      mintConfirmDialogRef.current.showModal();
                    }
                  }}
                >
                  <Image
                    src="/admin/images/icon/sample-icon.svg"
                    width={16}
                    height={20}
                    alt="mint icon"
                  />
                  <span className="text-base-white text-base font-bold">
                    Mint as an NFT
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
