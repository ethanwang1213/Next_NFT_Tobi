import { getMessages } from "admin/messages/messages";
import { useAuth } from "contexts/AdminAuthProvider";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

export interface SidebarItem {
  name: string;
  icon: string;
  href: string;
  visible: boolean;
}

export const useUpdatedSidebarItems = () => {
  const { user } = useAuth();
  const t = useTranslations("Menu");
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  const getApplyHref = (status: string) => {
    switch (status) {
      case "not-approved":
        return "/apply/contentApproval";
      case "rejected":
        return "/apply/contentRejected";
      case "reported":
      case "freezed":
        return "/apply/contentReported";
      default:
        return "/apply";
    }
  };

  useEffect(() => {
    const userBusiness = user.hasBusinessAccount === "exist";

    const updatedSidebarItems: SidebarItem[] = [
      {
        name: "Tobiratory Creator Program",
        icon: "/admin/images/icon/contents.svg",
        href: getApplyHref(user.hasBusinessAccount),
        visible: !userBusiness,
      },
      {
        name: t("Workspace"),
        icon: "/admin/images/icon/workspace.svg",
        href: "/workspace",
        visible: userBusiness,
      },
      {
        name: t("Items"),
        icon: "/admin/images/icon/tag.svg",
        href: "/items",
        visible: userBusiness,
      },
      {
        name: t("Content"),
        icon: "/admin/images/icon/contents.svg",
        href: "/contents",
        visible: userBusiness,
      },
      {
        name: t("Gift"),
        icon: "/admin/images/icon/gift.svg",
        href: "/gift",
        visible: userBusiness,
      },
      {
        name: t("Account"),
        icon: "/admin/images/icon/account.svg",
        href: "/account",
        visible: true,
      },
    ];

    setSidebarItems(updatedSidebarItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, t]);

  return sidebarItems;
};
