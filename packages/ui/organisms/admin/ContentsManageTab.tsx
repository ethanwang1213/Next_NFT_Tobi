import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { ContentBrandPanel } from "./ContentBrandPanel";
import { ContentSettingPanel } from "./ContentSettingPanel";
import { ShowcasePanel } from "./ShowcasePanel";

export default function ContentsManageTab({
  onTabChange,
  refresh,
}: {
  onTabChange: (value: string) => void;
  refresh: number;
}) {
  const [tab, setTab] = useTabs(["showcase", "brand", "settings"]);

  const handleTabChange = (tab) => {
    setTab(tab);
    onTabChange(tab);
  };

  return (
    <>
      <nav className="flex border-b border-[#D9D9D9] mt-1">
        <TabSelector
          isActive={tab === "showcase"}
          onClick={() => handleTabChange("showcase")}
          className="ml-12"
        >
          SHOWCASE
        </TabSelector>
        <TabSelector
          isActive={tab === "brand"}
          onClick={() => handleTabChange("brand")}
        >
          BRAND
        </TabSelector>
        <TabSelector
          isActive={tab === "settings"}
          onClick={() => handleTabChange("settings")}
        >
          SETTINGS
        </TabSelector>
      </nav>
      <div>
        <TabPanel hidden={tab !== "showcase"}>
          <ShowcasePanel refresh={refresh} />
        </TabPanel>
        <TabPanel hidden={tab !== "brand"}>
          <ContentBrandPanel />
        </TabPanel>
        <TabPanel hidden={tab !== "settings"}>
          <ContentSettingPanel />
        </TabPanel>
      </div>
    </>
  );
}
