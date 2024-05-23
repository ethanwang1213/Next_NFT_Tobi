import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "../../atoms/Button";
import SampleDetailDialog from "./SampleDetailDialog";

const ShowcaseSampleDetail = ({ id }: { id: number }) => {
  const dialogRef = useRef(null);
  const apiUrl = `native/admin/samples/${id}`;
  const { data, loading, getData } = useRestfulAPI(null);

  useEffect(() => {
    if (id !== -1) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const calculateTotalDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs: number = end.getTime() - start.getTime();
    const daysDifference: number = differenceInMs / (1000 * 60 * 60 * 24);

    return Math.floor(daysDifference);
  };

  return (
    <div
      className="w-[316px] bg-gray-800 bg-opacity-50 min-h-full absolute left-0
    flex flex-col justify-center items-center gap-6 text-base-white px-4 pt-6 pb-10"
    >
      <span className="text-base font-semibold ">{data?.content.name}</span>
      <span className="text-2xl font-bold">
        {data?.name ? data.name : "Unnamed Sample item"}
      </span>
      <Button onClick={() => dialogRef.current.showModal()}>
        <Image
          width={160}
          height={160}
          src={
            data?.customThumbnailUrl
              ? data?.customThumbnailUrl
              : "/admin/images/png/empty-image.png"
          }
          alt="image"
        />
      </Button>
      <span className="text-[10px] font-normal text-center">
        {data?.description}
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Creator
          </span>
          <span className="text-[10px] font-medium">
            {data?.content.name ? data?.content.name : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Copyright
          </span>
          <span className="text-[10px] font-medium">
            {data?.copyrights.length ? `@${data?.copyrights.join(" @")}` : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            License
          </span>
          <span className="text-[10px] font-medium flex-1">
            {data?.license ? data.license : "-"}
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Date Acquired
          </span>
          <div className="text-[10px] font-medium">
            {data?.startDate ? data.startDate : "-"}
            <br />
            Owned for {calculateTotalDays(data?.startDate, data?.endDate)} days
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            History
          </span>
          <div className="flex-1 flex gap-1">
            <span className="text-[10px] font-medium">-</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
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

export default ShowcaseSampleDetail;
