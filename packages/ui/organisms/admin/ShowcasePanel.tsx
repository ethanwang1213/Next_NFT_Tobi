import { useEffect, useState } from "react";

const ShowcasePanel = ({ refresh }: { refresh: number }) => {
  // showcase data
  const [showcases, setShowcases] = useState([]);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetch showcase data");
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0"></div>
      </div>
    </div>
  );
};

export { ShowcasePanel };
