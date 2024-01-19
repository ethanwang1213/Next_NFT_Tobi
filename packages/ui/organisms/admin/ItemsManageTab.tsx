// items-tab.tsx
import React, { useState, useEffect } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import SampleTable from "./SampleTable";
import PackageTable from "./PackageTable";
import FilterPopupMenu from "ui/molecules/filter-popup-menu";

export default function ItemsManageTab({ onTabChange }) {
  const [tab, setTab] = useTabs(["sample", "package"]);
  const [filterArray, setFilterArray] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
  });

  const handleTabChange = (tab) => {
    setTab(tab);
    onTabChange(tab);
  };

  // Function to toggle a specific index in the array
  const toggleAtIndex = (index) => {
    setFilterArray((prevArray) => {
      const newArray = { ...prevArray };
      newArray[index] = !newArray[index];
      return newArray;
    });
  };

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
        <TabSelector
          isActive={tab === "package"}
          onClick={() => handleTabChange("package")}
          isFirst={false}
        >
          PACKAGE
        </TabSelector>
      </nav>
      <FilterPopupMenu preference={filterArray} changeHandler={toggleAtIndex} />
      <div className="">
        <TabPanel hidden={tab !== "sample"}>
          <SampleTable filters={filterArray} />
        </TabPanel>
        <TabPanel hidden={tab !== "package"}>
          <PackageTable />
        </TabPanel>
      </div>
    </>
  );
}
