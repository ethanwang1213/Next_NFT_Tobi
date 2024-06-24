import Image from "next/image";
import SampleDetailDialog from "./SampleDetailDialog";
import { useCallback, useEffect, useRef } from "react";
import useRestfulAPI from "hooks/useRestfulAPI";
import { formatDateToLocal } from "ui/atoms/Formatters";
import Button from "ui/atoms/Button";
import MintConfirmDialog from "./MintConfirmDialog";
import useFcmToken from "hooks/useFCMToken";

const SampleDetailView = ({ id }: { id: number }) => {
  const dialogRef = useRef(null);
  const apiUrl = `native/admin/samples/${id}`;
  const { data, getData, postData } = useRestfulAPI(null);
  const mintConfirmDialogRef = useRef(null);
  const { token: fcmToken } = useFcmToken();

  useEffect(() => {
    if (id > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calculateTotalDays = (): number => {
    if (!data) return 0;

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const differenceInMs: number = end.getTime() - start.getTime();
    const daysDifference: number = differenceInMs / (1000 * 60 * 60 * 24);

    return Math.floor(daysDifference);
  };

  const mintConfirmDialogHandler = useCallback(
    (value: string) => {
      if (value == "mint") {
        postData(`native/items/${id}/mint`, {
          fcmToken: fcmToken,
          amount: 1,
          modelUrl: data.modelUrl,
        });
      }
    },
    [data, fcmToken, id, postData],
  );

  return (
    <div className="flex flex-col items-center gap-6 text-base-white">
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
          if (data && dialogRef.current) {
            dialogRef.current.showModal();
          }
        }}
        className="rounded-lg"
      />
      <span className="text-[10px] font-normal text-center">
        {data?.description}
      </span>
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            Creator
          </span>
          <span className="text-[10px] font-medium">
            {data?.content.name ? data?.content.name : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            Copyright
          </span>
          <span className="text-[10px] font-medium">
            {data?.copyrights.length ? `@${data?.copyrights.join(" @")}` : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            License
          </span>
          <span className="text-[10px] font-medium flex-1">
            {data?.license ? data.license : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            Date Acquired
          </span>
          <div className="text-[10px] font-medium">
            {data
              ? data.startDate
                ? formatDateToLocal(data.startDate)
                : "-"
              : "-"}
            {data && <br />}
            {data && `Owned for ${calculateTotalDays()} days`}
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            History
          </span>
          <div className="flex-1 flex gap-1">
            <span className="text-[10px] font-medium">-</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[100px] text-right">
            Serial Number
          </span>
          <span className="text-[10px] font-medium">-</span>
        </div>
        {data && (
          <SampleDetailDialog
            thumbnail={data?.customThumbnailUrl}
            content={data?.content.name}
            item={data?.name}
            dialogRef={dialogRef}
          />
        )}
      </div>
      {id > 0 && (
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
      )}
      {id > 0 && (
        <Button
          className="w-[192px] h-[46px] rounded-[30px] bg-[#E96700] flex justify-center items-center gap-2"
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
      )}
      <MintConfirmDialog
        dialogRef={mintConfirmDialogRef}
        changeHandler={mintConfirmDialogHandler}
      />
    </div>
  );
};

export default SampleDetailView;