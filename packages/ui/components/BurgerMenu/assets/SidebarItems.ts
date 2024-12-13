import { useAuth } from "contexts/AdminAuthProvider";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

export interface SidebarItem {
  name: string;
  icon: string;
  href: string;
  visible: boolean;
}

export const useUpdatedSidebarItems = (content: string) => {
  const { user } = useAuth();
  const t = useTranslations("Menu");

  const sidebarItems: SidebarItem[] = [
    {
      name: "Tobiratory Creator Program",
      icon: "/admin/images/icon/contents.svg",
      href: "/apply",
      visible: false,
    },
    {
      name: t("Workspace"),
      icon: "/admin/images/icon/workspace.svg",
      href: "/workspace",
      visible: false,
    },
    {
      name: t("Items"),
      icon: "/admin/images/icon/tag.svg",
      href: "/items",
      visible: false,
    },
    {
      name: t("Content"),
      icon: "/admin/images/icon/contents.svg",
      href: "/contents",
      visible: false,
    },
    {
      name: t("Gift"),
      icon: "/admin/images/icon/gift.svg",
      href: "/gift",
      visible: false,
    },
    {
      name: t("Account"),
      icon: "/admin/images/icon/account.svg",
      href: "/account",
      visible: true,
    },
  ];

  return sidebarItems.map((item) => ({
    ...item,
    visible:
      content === "not-approved" || content === "approve-rejected"
        ? item.visible
        : item.name === "Tobiratory Creator Program"
          ? !user.hasBusinessAccount
          : item.visible || user.hasBusinessAccount,
  }));
};
