import useRestfulAPI from "hooks/useRestfulAPI";
import { Metadata } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ContentsManageTab from "ui/organisms/admin/ContentsManageTab";

export const metadata: Metadata = {
  title: "Contents",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("showcase");
  const { postData } = useRestfulAPI(null);
  const apiUrl = "native/admin/showcases";
  const [reload, setReload] = useState(0);
  const router = useRouter();

  const links = {
    showcase: {
      label: "new showcase",
      clickHandler: () => {
        postData(apiUrl, {
          title: "The showcase title",
          description: "",
          templateId: 1,
        }).then((response) => {
          const showcaseId = response.id;
          router.push(`/contents/showcase?id=${showcaseId}`);
          setReload(reload + 1);
        });
      },
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
      <div className="h-14 ml-9 mr-7 mt-[34px] flex justify-between items-center">
        <h1 className="font-semibold text-secondary text-3xl">CONTENT</h1>
        <CreateButton {...(links[selectedTab] ?? links.showcase)} height={56} />
      </div>
      <div>
        <ContentsManageTab onTabChange={setSelectedTab} reload={reload} />
      </div>
    </>
  );
}
