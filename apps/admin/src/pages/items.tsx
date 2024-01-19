import { Metadata } from "next";
import { useState } from "react";
import CreateButton from "ui/molecules/ItemCreateButton";
import ItemsManageTab from "ui/organisms/admin/ItemsManageTab";

export const metadata: Metadata = {
  title: "アイテム管理",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("sample");

  const linkAddress = {
    sample: "/admin/workspace",
    package: "/admin/items",
  };

  const buttonLabel = {
    sample: "new sample",
    package: "new package",
  };

  return (
    <div className="w-full">
      <div className="flex justify-between pl-12 pr-7 pt-9">
        <h1
          className="font-semibold text-[#717171]"
          style={{ fontSize: 32, lineHeight: 1.5 }}
        >
          アイテム管理
        </h1>
        <CreateButton label={buttonLabel[selectedTab]} href={linkAddress[selectedTab]} />
      </div>
      <div className="w-full items-center justify-between">
        <ItemsManageTab onTabChange={setSelectedTab} />
      </div>
    </div>
  );
}
