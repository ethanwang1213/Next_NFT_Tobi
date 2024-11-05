import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const onMouseDown = (event: React.MouseEvent) => {
    dragStartPos.current = { x: event.clientX, y: event.clientY };
  };

  const onMouseMove = (event: React.MouseEvent, sample: SampleItem) => {
    if (dragStartPos.current) {
      const dx = event.clientX - dragStartPos.current.x;
      const dy = event.clientY - dragStartPos.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragStartPos.current = null;
        dragSampleItem(sample);
      }
    }
  };

  const onMouseUp = () => {
    dragStartPos.current = null;
  };

  return (
    <div className="flex flex-wrap">
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </span>
      )}
      {data &&
        data.length > 0 &&
        [...data].reverse().map((sample, index) => {
          return (
            <div
              key={sample.sampleItemId}
              className="w-1/4 p-2 flex item-center justify-center"
              onMouseDown={onMouseDown}
              onMouseMove={(event) => {
                onMouseMove(event, sample);
              }}
              onMouseUp={onMouseUp}
            >
              <Image
                src={sample.thumbUrl}
                draggable={false}
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
              />
            </div>
          );
        })}
    </div>
  );
};

export { ShowcaseSampleTab };
