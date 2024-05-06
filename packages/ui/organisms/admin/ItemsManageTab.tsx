// items-tab.tsx
import React, { useState, useEffect } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { SampleTable } from "./SampleTable";
import FilterPopupButton from "ui/organisms/admin/FilterPopupButton";

export default function ItemsManageTab({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
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
          className="ml-12"
        >
          SAMPLE
        </TabSelector>
      </nav>
      <div className="flex justify-start">
        <FilterPopupButton />
        <input
          className="text-base text-secondary/[76] outline-none"
          placeholder="Search for Samples"
        />
      </div>
      <div>
        <TabPanel hidden={tab !== "sample"}>
          <SampleTable filters={filterArray} />
        </TabPanel>
      </div>
    </>
  );
}
