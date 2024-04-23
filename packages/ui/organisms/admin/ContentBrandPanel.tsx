import { useEffect, useState } from "react";

const ContentBrandPanel = () => {
  // showcase data
  const [showcases, setShowcases] = useState([]);

  // fetch showcases from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await fetchShowcases();
        // setShowcases(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0"></div>
      </div>
    </div>
  );
};

export { ContentBrandPanel };
