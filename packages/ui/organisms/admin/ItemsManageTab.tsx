// items-tab.tsx
import React, { useState, useEffect } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { SampleTable } from "./SampleTable";
import PackageTable from "./PackageTable";
import FilterPopupButton from "ui/organisms/admin/FilterPopupButton";

export default function ItemsManageTab({ onTabChange }) {
  // const [tab, setTab] = useTabs(["sample", "package"]);
  const [tab, setTab] = useTabs(["sample"]);

  const [filterArray, setFilterArray] = useState({});

  const handleTabChange = (tab) => {
    setTab(tab);
    onTabChange(tab);
  };

  // Function to toggle a specific index in the array
  const toggleAtIndex = (index) =>
    setFilterArray((prevArray) => ({
      ...prevArray,
      [index]: !prevArray[index],
    }));

  return (
    <>
      <nav className="flex border-b border-[#D9D9D9] mt-1">
        <TabSelector
          isActive={tab === "sample"}
          onClick={() => handleTabChange("sample")}
          isFirst={true}
        >
          SAMPLE
        </TabSelector>
        {/* <TabSelector
          isActive={tab === "package"}
          onClick={() => handleTabChange("package")}
          isFirst={false}
        >
          PACKAGE
        </TabSelector> */}
      </nav>
      <div className="flex justify-start">
        <FilterPopupButton />
        <input
          className="text-base text-secondary/[76] outline-none"
          placeholder="Search for Samples"
        />
      </div>
      <div className="">
        <TabPanel hidden={tab !== "sample"}>
          <SampleTable filters={filterArray} />
        </TabPanel>
        {/* <TabPanel hidden={tab !== "package"}>
          <PackageTable />
        </TabPanel> */}
      </div>
    </>
  );
}
