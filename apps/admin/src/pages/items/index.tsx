import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ItemsManageTab from "ui/organisms/admin/ItemsManageTab";
import {getMessages} from "admin/messages/messages";

export const metadata: Metadata = {
  title: "ITEMS",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("item");
  const router = useRouter();
  const t = useTranslations("Menu");
  const b = useTranslations("Item");

  const links = {
    item: {
      label: b("NewItem"),
      clickHandler: () => router.push("/workspace?trigger=true"),
    },
  };

  return (
    <>
      <div className="h-14 ml-12 mr-7 mt-9 flex justify-between items-center uppercase">
        <h1 className="font-semibold text-secondary text-3xl">{t("Items")}</h1>
        <CreateButton {...(links[selectedTab] ?? links.item)} height={56} />
      </div>
      <div>
        <ItemsManageTab onTabChange={setSelectedTab} />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}
