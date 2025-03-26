import { getMessages } from "admin/messages/messages";
import { useLoading } from "contexts/LoadingContext";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateButton from "ui/molecules/CreateButton";
import ContentsManageTab from "ui/organisms/admin/ContentsManageTab";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

export const metadata: Metadata = {
  title: "Contents",
};

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("showcase");
  const { postData, loading } = useRestfulAPI(null);
  const apiUrl = "native/admin/showcases";
  const [reload, setReload] = useState(0);
  const { setLoading } = useLoading();
  const router = useRouter();
  const t = useTranslations("Menu");
  const l = useTranslations("ContentShowcase");

  const links = {
    showcase: {
      label: l("NewShowcase"),
      clickHandler: () => {
        setLoading(true);
        postData(apiUrl, {
          title: "The showcase title",
          description: "",
          templateId: 1,
        })
          .then((response) => {
            const showcaseId = response.id;
            router.push(`/contents/showcase?id=${showcaseId}`);
            setReload(reload + 1);
          })
          .finally(() => {
            setLoading(false);
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

  useEffect(() => {
    setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <div className="sm:!min-w-[816px] h-14 ml-9 mr-7 mt-[34px] flex justify-between items-center">
        <h1 className="font-semibold text-secondary text-3xl uppercase">
          {t("Content")}
        </h1>
        {loading ? (
          <div className="h-14 mx-auto my-10 flex flex-row justify-center mr-28">
            <span className={"loading loading-spinner text-info loading-md"} />
          </div>
        ) : (
          <CreateButton
            {...(links[selectedTab] ?? links.showcase)}
            height={56}
          />
        )}
      </div>
      <div>
        <ContentsManageTab onTabChange={setSelectedTab} reload={reload} />
      </div>
    </>
  );
}
