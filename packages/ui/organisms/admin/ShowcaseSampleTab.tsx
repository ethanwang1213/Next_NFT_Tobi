import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SampleItem } from "ui/types/adminTypes";

const ShowcaseSampleTab = ({
  clickSampleItem,
  dragSampleItem,
}: {
  clickSampleItem: (item: SampleItem) => void;
  dragSampleItem: (item: SampleItem) => void;
}) => {
  const apiUrl = "native/my/samples";
  const { data, loading, getData } = useRestfulAPI(apiUrl);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <div className="flex flex-wrap">
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </span>
      )}

      {data &&
        data.length > 0 &&
        data.map((sample, index) => {
          return (
            <div key={sample.id} className="w-1/4 p-2">
              <Image
                src={sample.thumbUrl}
                className={"rounded-[8px] cursor-pointer"}
                alt="sample item"
                width={80}
                height={80}
                style={{
                  objectFit: "contain",
                  maxWidth: 80,
                  maxHeight: 80,
                }}
                onClick={() => clickSampleItem(sample)}
                onDragStart={() => dragSampleItem(sample)}
              />
            </div>
          );
        })}
    </div>
  );
};

export { ShowcaseSampleTab };
