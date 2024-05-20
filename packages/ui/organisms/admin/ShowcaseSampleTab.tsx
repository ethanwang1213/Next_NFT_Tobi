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
  }, [reload]);
  console.log(data);

  return (
    <div className="flex flex-wrap">
      {data &&
        data.length > 0 &&
        data.map((sample, index) => {
          return (
            <div key={sample.id} className="w-1/4 p-4">
              <div
                className={"w-20 h-20 rounded-[8px]"}
                style={{
                  backgroundImage: `url(${sample.thumbImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover", // Ensure the image covers the entire div
                  backgroundRepeat: "no-repeat", // Prevent image repetition
                }}
              ></div>
            </div>
          );
        })}
    </div>
  );
};

export { ShowcaseSampleTab };
