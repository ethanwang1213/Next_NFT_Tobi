import { useRef, useState } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "ui/atoms/tab-selector";
import { ContentBrandPanel } from "./ContentBrandPanel";
import { ContentSettingPanel } from "./ContentSettingPanel";
import SaveConfirmDialog from "./SaveConfirmDialog";
import { ShowcasePanel } from "./ShowcasePanel";

export default function ContentsManageTab({
  onTabChange,
  reload,
}: {
  onTabChange: (value: string) => void;
  reload: number;
}) {
  const [tab, setTab] = useTabs(["showcase", "brand", "settings"]);
  const [changed, setChanged] = useState(null);
  const [cancelFlag, setCancelFlag] = useState(0);
  const [publishFlag, setPublishFlag] = useState(0);

  let actionTab = null;

  const dialogRef = useRef(null);

  const handleTabChange = (active) => {
    if (active == tab) {
      return;
    }

    if (changed != null) {
      actionTab = active;
      // show dialog
      dialogRef.current.showModal();
      return;
    }

    setTab(active);
    onTabChange(active);
  };

  const actionHandler = (value: string) => {
    if (value == "save") {
      setPublishFlag(publishFlag + 1);
      setTab(actionTab);
      onTabChange(actionTab);
      setChanged(null);
    }

    if (value == "discard") {
      setCancelFlag(cancelFlag + 1);
      setTab(actionTab);
      onTabChange(actionTab);
      setChanged(null);
    }

    if (value == "cancel") {
      actionTab = null;
    }
  };

  return (
    <>
      <nav className="flex border-b border-[#D9D9D9] mt-1">
        <TabSelector
          isActive={tab === "showcase"}
          onClick={() => handleTabChange("showcase")}
          className="ml-12 mt-3"
        >
          SHOWCASE
        </TabSelector>
        <TabSelector
          isActive={tab === "brand"}
          onClick={() => handleTabChange("brand")}
          className="mt-3"
        >
          BRAND
        </TabSelector>
        <TabSelector
          isActive={tab === "settings"}
          onClick={() => handleTabChange("settings")}
          className="mt-3"
        >
          SETTINGS
        </TabSelector>
        <div className="w-full flex justify-end gap-10 mb-3 mr-6 h-14">
          {tab !== "showcase" && (
            <>
              <button
                className={`text-xl h-14 border-2 rounded-[30px] px-10 
                  enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow 
                  ${
                    changed
                      ? "text-primary border-primary"
                      : "text-inactive border-inactive"
                  }`}
                disabled={!changed}
                onClick={() => {
                  setChanged(null);
                  setCancelFlag(cancelFlag + 1);
                }}
              >
                Cancel
              </button>
              <button
                className={`text-xl h-14 text-white rounded-[30px] px-10 
                  enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow 
                  ${changed ? "bg-primary" : "bg-inactive"}`}
                disabled={!changed}
                onClick={() => {
                  setChanged(null);
                  setPublishFlag(publishFlag + 1);
                }}
              >
                Public
              </button>
            </>
          )}
        </div>
      </nav>
      <div className="flow-root px-[50px] pt-[60px] pb-[40px]">
        <TabPanel hidden={tab !== "showcase"}>
          <ShowcasePanel reload={reload} />
        </TabPanel>
        <TabPanel hidden={tab !== "brand"}>
          <ContentBrandPanel
            cancelFlag={cancelFlag}
            publishFlag={publishFlag}
            changeHandler={() => setChanged("brand")}
          />
        </TabPanel>
        <TabPanel hidden={tab !== "settings"}>
          <ContentSettingPanel
            cancelFlag={cancelFlag}
            publishFlag={publishFlag}
            changeHandler={() => setChanged("settings")}
          />
        </TabPanel>
        <SaveConfirmDialog
          dialogRef={dialogRef}
          changeHandler={actionHandler}
        />
      </div>
    </>
  );
}
