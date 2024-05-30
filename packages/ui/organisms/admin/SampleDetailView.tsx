import Image from "next/image";
import SampleDetailDialog from "./SampleDetailDialog";
import { useEffect, useRef } from "react";
import useRestfulAPI from "hooks/useRestfulAPI";
import { formatDateToLocal } from "ui/atoms/Formatters";

const SampleDetailView = ({ id }: { id: number }) => {
  const dialogRef = useRef(null);
  const apiUrl = `native/admin/samples/${id}`;
  const { data, loading, getData } = useRestfulAPI(null);

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
        <SampleDetailDialog
          thumbnail={data?.customThumbnailUrl}
          content={data?.content.name}
          item={data?.name}
          dialogRef={dialogRef}
        />
      </div>
    </div>
  );
};

export default SampleDetailView;