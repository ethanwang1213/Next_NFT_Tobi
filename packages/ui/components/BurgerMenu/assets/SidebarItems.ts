import { useAuth } from "contexts/AdminAuthProvider";
export interface SidebarItem {
  name: string;
  icon: string;
  href: string;
  visible: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Tobiratory Creator Program",
    icon: "/admin/images/icon/contents.svg",
    href: "/apply",
    visible: false,
  },
  {
    name: "Workspace",
    icon: "/admin/images/icon/workspace.svg",
    href: "/workspace",
    visible: false,
  },
  {
    name: "Items",
    icon: "/admin/images/icon/tag.svg",
    href: "/items",
    visible: false,
  },
  {
    name: "Content",
    icon: "/admin/images/icon/contents.svg",
    href: "/contents",
    visible: false,
  },
  {
    name: "Gift",
    icon: "/admin/images/icon/gift.svg",
    href: "/gift",
    visible: false,
  },
  {
    name: "Account",
    icon: "/admin/images/icon/account.svg",
    href: "/account",
    visible: true,
  },
];

export const useUpdatedSidebarItems = () => {
  const { user } = useAuth();

  return sidebarItems.map((item) => ({
    ...item,
    visible:
      item.name === "Tobiratory Creator Program"
        ? !user.hasBusinessAccount
        : item.visible || user.hasBusinessAccount,
  }));
};
