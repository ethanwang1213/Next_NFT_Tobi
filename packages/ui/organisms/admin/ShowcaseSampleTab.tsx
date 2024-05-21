import useRestfulAPI from "hooks/useRestfulAPI";
import { useEffect, useState } from "react";

const ShowcaseSampleTab = () => {
  const apiUrl = "native/admin/samples";
  const { data, getData } = useRestfulAPI(apiUrl);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (reload > 0) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <div className="flex flex-wrap">
      {data &&
        data.length > 0 &&
        data.map((sample, index) => {
          return (
            <div key={sample.id} className="w-1/4 p-2">
              <div
                className={"rounded-[8px] bg-no-repeat bg-center"}
                style={{
                  backgroundImage: `url(${sample.thumbnail})`,
                  backgroundSize: "contain",
                  paddingTop: "100%",
                }}
              ></div>
            </div>
          );
        })}
    </div>
  );
};

export { ShowcaseSampleTab };
