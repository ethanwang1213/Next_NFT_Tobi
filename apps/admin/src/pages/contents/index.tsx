import { Metadata } from "next";
import { useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ContentsManageTab from "ui/organisms/admin/ContentsManageTab";

export const metadata: Metadata = {
  title: "Contents",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("sample");

  const links = {
    showcase: {
      label: "new showcase",
      clickHandler: () => null,
    },
    brand: {
      label: "",
    },
    settings: {
      label: "",
    },
  };

  return (
    <>
      <div className="h-14 ml-12 mr-7 mt-9 flex justify-between items-center">
        <h1 className="font-semibold text-secondary text-3xl">CONTENT</h1>
        <CreateButton {...(links[selectedTab] ?? links.showcase)} />
      </div>
      <div>
        <ContentsManageTab onTabChange={setSelectedTab} />
      </div>
    </>
  );
}
