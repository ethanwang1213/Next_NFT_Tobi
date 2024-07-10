import { Metadata } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ItemsManageTab from "ui/organisms/admin/ItemsManageTab";

export const metadata: Metadata = {
  title: "ITEMS",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("item");

  const router = useRouter();

  const links = {
    item: {
      label: "new item",
      clickHandler: () => router.push("/workspace"),
    },
  };

  return (
    <>
      <div className="h-14 ml-12 mr-7 mt-9 flex justify-between items-center">
        <h1 className="font-semibold text-secondary text-3xl">ITEMS</h1>
        <CreateButton {...(links[selectedTab] ?? links.item)} height={56} />
      </div>
      <div>
        <ItemsManageTab onTabChange={setSelectedTab} />
      </div>
    </>
  );
}
