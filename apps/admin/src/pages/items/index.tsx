import { Metadata } from "next";
import { useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ItemsManageTab from "ui/organisms/admin/ItemsManageTab";

export const metadata: Metadata = {
  title: "ITEMS",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("sample");

  const links = {
    sample: {
      label: "new sample",
      href: "/workspace",
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between pl-12 pr-7 pt-9">
        <h1 className="font-semibold text-[#717171] text-3xl">ITEMS</h1>
        <CreateButton {...(links[selectedTab] ?? links.sample)} />
      </div>
      <div className="w-full items-center justify-between pl-5">
        <ItemsManageTab onTabChange={setSelectedTab} />
      </div>
    </div>
  );
}
