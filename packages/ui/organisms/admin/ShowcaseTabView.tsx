import Image from "next/image";
import { TabPanel, useTabs } from "react-headless-tabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShowcaseTabSelector } from "ui/atoms/ShowcaseTabSelector";
import { ShowcaseInventoryTab } from "ui/organisms/admin/ShowcaseInventoryTab";
import { ShowcaseSampleTab } from "ui/organisms/admin/ShowcaseSampleTab";
import ShowcaseUnityUISetting from "ui/organisms/admin/ShowcaseUnityUISetting";
import { NftItem, SampleItem } from "ui/types/adminTypes";

const ShowcaseTabView = ({
  clickSampleItem,
  dragSampleItem,
  clickNftItem,
  dragNftItem,
  showRestoreMenu,
}: {
  clickSampleItem: (item: SampleItem) => void;
  dragSampleItem: (item: SampleItem) => void;
  clickNftItem: (item: NftItem) => void;
  dragNftItem: (item: NftItem) => void;
  showRestoreMenu: boolean;
}) => {
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
      {showRestoreMenu && (
        <div
          className="absolute w-full h-full bg-secondary bg-opacity-75 backdrop-blur-sm 
            flex flex-col gap-6 justify-center items-center z-10 select-none"
        >
          <span className="text-white text-[32px] font-bold">
            Return to the Inventory
          </span>
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/keyboard_return.svg"
            alt="return icon"
            draggable={false}
          />
        </div>
      )}
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
      <div className="p-[30px] w-full flex-1 flex flex-col">
        <TabPanel hidden={tab !== "Sample Items"}>
          <ShowcaseSampleTab
            clickSampleItem={clickSampleItem}
            dragSampleItem={dragSampleItem}
          ></ShowcaseSampleTab>
        </TabPanel>
        <TabPanel
          hidden={tab !== "Inventory"}
          className={tab === "Inventory" ? "flex-1 flex flex-col" : ""}
        >
          <ShowcaseInventoryTab
            clickNftItem={clickNftItem}
            dragNftItem={dragNftItem}
          ></ShowcaseInventoryTab>
        </TabPanel>
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
      <ShowcaseUnityUISetting />
    </div>
  );
};

export default ShowcaseTabView;
