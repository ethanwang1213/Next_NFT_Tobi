import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import SampleTable from "./sample-table";
import PackageTable from "./package-table";

export function ItemsManageTab() {
  const [selectedTab, setSelectedTab] = useTabs([
    "sample",
    "pacakge",
  ]);

  return (
    <>
      <nav className="flex border-b border-gray-300">
        <TabSelector
          isActive={selectedTab === "sample"}
          onClick={() => setSelectedTab("sample")}
        >
          SAMPLE
        </TabSelector>
        <TabSelector
          isActive={selectedTab === "pacakge"}
          onClick={() => setSelectedTab("pacakge")}
        >
          PACKAGE
        </TabSelector>
      </nav>
      <div className="p-4">
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