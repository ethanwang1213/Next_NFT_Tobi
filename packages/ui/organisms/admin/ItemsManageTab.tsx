// items-tab.tsx
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import FilterPopupButton from "ui/organisms/admin/FilterPopupButton";
import { DigitalItemTable } from "./DigitalItemTable";

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
  const t = useTranslations("Item");
  const m = useTranslations("Menu");

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
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (tab) => {
    setTab(tab);
    onTabChange(tab);
  };

  return (
    <>
      <nav className="min-w-[980px] flex border-b border-[#D9D9D9] mt-1">
        <TabSelector
          isActive={tab === "item"}
          onClick={() => handleTabChange("item")}
          className="ml-12"
        >
          {m("Items")}
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
          placeholder={t("Filter")}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <TabPanel hidden={tab !== "item"}>
          <DigitalItemTable
            filterArray={filterArray}
            price={price}
            statusArray={statusArray}
            createDate={createDate}
            searchTerm={searchTerm}
          />
        </TabPanel>
      </div>
    </>
  );
}
