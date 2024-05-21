import Image from "next/image";
import { TabPanel, useTabs } from "react-headless-tabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShowcaseTabSelector } from "ui/atoms/ShowcaseTabSelector";
import { ShowcaseSampleTab } from "ui/organisms/admin/ShowcaseSampleTab";

const ShowcaseTabView = () => {
  const [tab, setTab] = useTabs(["Sample Items", "Inventory", "Settings"]);

  const handleTabChange = (active) => {
    if (active == tab) {
      return;
    }

    setTab(active);
  };

  return (
    <div
      className="w-[504px] bg-gray-800 bg-opacity-50 min-h-full absolute right-0
  flex flex-col items-center text-base-white"
    >
      <nav className="flex h-16 w-full bg-white">
        <ShowcaseTabSelector
          isActive={tab === "Sample Items"}
          onClick={() => handleTabChange("Sample Items")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/sample-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Sample Items</span>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Inventory"}
          onClick={() => handleTabChange("Inventory")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/inventory-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Inventory</span>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Settings"}
          onClick={() => handleTabChange("Settings")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/setting-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Settings</span>
        </ShowcaseTabSelector>
      </nav>
      <div className="flow-root pl-[68px] pr-[68px] pt-[52px] pb-[52px] w-full">
        <TabPanel hidden={tab !== "Sample Items"}>
          <ShowcaseSampleTab></ShowcaseSampleTab>
        </TabPanel>
        <TabPanel hidden={tab !== "Inventory"}></TabPanel>
        <TabPanel hidden={tab !== "Settings"}></TabPanel>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default ShowcaseTabView;
