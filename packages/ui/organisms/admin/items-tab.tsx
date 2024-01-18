import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import SampleTable from "./sample-table";
import PackageTable from "./package-table";
import FilterPopupMenu from "ui/molecules/filter-popup-menu";

export function ItemsManageTab() {
  const [selectedTab, setSelectedTab] = useTabs(["sample", "pacakge"]);

  return (
    <>
      <nav className="flex border-b border-[#D9D9D9] mt-4">
        <TabSelector
          isActive={selectedTab === "sample"}
          onClick={() => setSelectedTab("sample")}
          isFirst={true}
        >
          SAMPLE
        </TabSelector>
        <TabSelector
          isActive={selectedTab === "pacakge"}
          onClick={() => setSelectedTab("pacakge")}
          isFirst={false}
        >
          PACKAGE
        </TabSelector>
      </nav>
      <FilterPopupMenu />
      <div className="">
        <TabPanel hidden={selectedTab !== "sample"}>
          <SampleTable />
        </TabPanel>
        <TabPanel hidden={selectedTab !== "pacakge"}>
          <PackageTable />
        </TabPanel>
      </div>
    </>
  );
}
