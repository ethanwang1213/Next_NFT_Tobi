// items-tab.tsx
import React, { useState, useEffect } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { DigitalItemTable } from "./DigitalItemTable";
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
  const [tab, setTab] = useTabs(["item"]);

  const [filterArray, toggleFilter] = useFilterControl([false, false, false]);

  const [price, setPrice] = useState({ from: 0, to: 0 });
  const [statusArray, toggleStatus] = useFilterControl([
    false,
    false,
    false,
    false,
    false,
  ]);
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
          isActive={tab === "item"}
          onClick={() => handleTabChange("item")}
          className="ml-12"
        >
          ITEMS
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
          createDate={createDate}
          setCreateDate={setCreateDate}
        />
        <input
          className="text-base text-secondary/[76] outline-none"
          placeholder="Filter"
        />
      </div>
      <div>
        <TabPanel hidden={tab !== "item"}>
          <DigitalItemTable
            filterArray={filterArray}
            price={price}
            statusArray={statusArray}
            createDate={createDate}
          />
        </TabPanel>
      </div>
    </>
  );
}
