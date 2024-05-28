import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";

const ShowcaseSampleTab = ({
  clickSampleItem,
}: {
  clickSampleItem: (id: number) => void;
}) => {
  const apiUrl = "native/admin/samples";
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
              <div
                className={
                  "rounded-[8px] bg-no-repeat bg-center cursor-pointer"
                }
                style={{
                  backgroundImage: `url(${sample.thumbnail})`,
                  backgroundSize: "contain",
                  paddingTop: "100%",
                }}
                onClick={() => clickSampleItem(sample.id)}
              ></div>
            </div>
          );
        })}
    </div>
  );
};

export { ShowcaseSampleTab };
