// items-tab.tsx
import React, { useState, useEffect } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { SampleTable } from "./SampleTable";
import FilterPopupButton from "ui/organisms/admin/FilterPopupButton";

const useFilterControl = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const toggleFilter = (index) => {
    const newFilters = [...filters];
    newFilters[index] = !newFilters[index];
    setFilters(newFilters);
  };

  return [filters, toggleFilter];
};

export default function ItemsManageTab({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
  const [tab, setTab] = useTabs(["sample"]);

  const [filterArray, toggleFilter] = useFilterControl([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [price, setPrice] = useState({ from: 0, to: 0 });
  const [statusArray, toggleStatus] = useFilterControl([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [saleStartDate, setSaleStartDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [saleEndDate, setSaleEndDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [soldCount, setSoldCount] = useState({ from: 0, to: 0 });
  const [createDate, setCreateDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  const handleTabChange = (tab) => {
    setTab(tab);
    onTabChange(tab);
  };

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
        <FilterPopupButton
          filterArray={filterArray}
          toggleFilter={toggleFilter}
          price={price}
          setPrice={setPrice}
          statusArray={statusArray}
          toggleStatus={toggleStatus}
          saleStartDate={saleStartDate}
          setSaleStartDate={setSaleStartDate}
          saleEndDate={saleEndDate}
          setSaleEndDate={setSaleEndDate}
          soldCount={soldCount}
          setSoldCount={setSoldCount}
          createDate={createDate}
          setCreateDate={setCreateDate}
        />
        <input
          className="text-base text-secondary/[76] outline-none"
          placeholder="Search for Samples"
        />
      </div>
      <div>
        <TabPanel hidden={tab !== "sample"}>
          <SampleTable
            filterArray={filterArray}
            price={price}
            statusArray={statusArray}
            saleStartDate={saleStartDate}
            saleEndDate={saleEndDate}
            soldCount={soldCount}
            createDate={createDate}
          />
        </TabPanel>
      </div>
    </>
  );
}
