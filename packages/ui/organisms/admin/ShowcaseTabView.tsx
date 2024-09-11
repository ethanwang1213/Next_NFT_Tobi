import { useShowcaseEditUnityContext } from "hooks/useCustomUnityContext";
import { UndoneRedoneResult } from "hooks/useCustomUnityContext/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { ActionType, SettingsUpdatePhase } from "types/unityTypes";
import { ShowcaseTabSelector } from "ui/atoms/ShowcaseTabSelector";
import Collapse from "ui/organisms/admin/Collapse";
import { ShowcaseInventoryTab } from "ui/organisms/admin/ShowcaseInventoryTab";
import { ShowcaseSampleTab } from "ui/organisms/admin/ShowcaseSampleTab";
import ShowcaseUnityUISetting from "ui/organisms/admin/ShowcaseUnityUISetting";
import { NftItem, SampleItem } from "ui/types/adminTypes";
import BrightnessPicker from "./BrightnessPicker";
import ColorPicker from "./ColorPicker";

const ShowcaseTabView = ({
  clickSampleItem,
  dragSampleItem,
  clickNftItem,
  dragNftItem,
  showRestoreMenu,
  settings,
  updateUnityViewSettings,
  operateMenu,
}: {
  clickSampleItem: (item: SampleItem) => void;
  dragSampleItem: (item: SampleItem) => void;
  clickNftItem: (item: NftItem) => void;
  dragNftItem: (item: NftItem) => void;
  showRestoreMenu: boolean;
  settings: any;
  operateMenu : boolean
  updateUnityViewSettings: (
    wt: string,
    ft: string,
    st: string,
    sb: number,
    pt: string,
    pb: number,
    phase: SettingsUpdatePhase,
  ) => void;
}) => {
  const [tab, setTab] = useTabs(["Sample Items", "Inventory", "Settings"]);
  const [phars, setPhars] = useState<SettingsUpdatePhase>(
    SettingsUpdatePhase.Updating,
  );
  const [active, setActive] = useState("");
  const [wt, setWt] = useState(String);
  const [ft, setFt] = useState(String);
  const [st, setSt] = useState(String);
  const [sb, setSb] = useState(Number);
  const [pt, setPt] = useState(String);
  const [pb, setPb] = useState(Number);

  const handleAction = (
    actionType: ActionType,
    text: string,
    result: UndoneRedoneResult,
  ) => {
    switch (actionType) {
      case 5:
        setWt(result.settings.wallpaper.tint);
        break;
      case 6:
        setFt(result.settings.floor.tint);
        break;
      case 7:
        setSt(result.settings.lighting.sceneLight.tint);
        break;
      case 8:
        setSb(result.settings.lighting.sceneLight.brightness);
        break;
      case 9:
        setPt(result.settings.lighting.pointLight.tint);
        break;
      case 10:
        setPb(result.settings.lighting.pointLight.brightness);
        break;
      default:
    }
  };

  const {} = useShowcaseEditUnityContext({
    onActionRedone: handleAction,
    onActionUndone: handleAction,
  });

  const afterChangeHandle = () => {
    updateUnityViewSettings(wt, ft, st, sb, pt, pb, SettingsUpdatePhase.Ended);
  };

  const handleTabChange = (active) => {
    if (active == tab) {
      return;
    }
    setActive(active);
    setTab(active);
  };

  useEffect(() => {
    if (settings) {
      setWt(settings.wallpaper.tint ?? "#717171");
      setFt(settings.floor.tint ?? "#717171");
      setSt(settings.lighting.sceneLight.tint ?? "#717171");
      setSb(settings.lighting.sceneLight.brightness ?? 1);
      setPt(settings.lighting.pointLight.tint ?? "#717171");
      setPb(settings.lighting.pointLight.brightness ?? 1);
    }
  }, [settings]);

  const updateUnityTheme = () => {
    updateUnityViewSettings(wt, ft, st, sb, pt, pb, phars);
    setPhars(SettingsUpdatePhase.Updating);
  };

  return (
    <div className="pointer-events-auto w-[424px] absolute right-4 top-[21px] bottom-4 flex flex-col items-center text-base-white">
      {showRestoreMenu && (
        <div
          className="absolute w-full h-full bg-secondary bg-opacity-75 backdrop-blur-sm 
            flex flex-col gap-6 justify-center items-center z-10 select-none"
        >
          <span className="text-white text-[32px] font-bold">
            Return to the Inventory
          </span>
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/keyboard_return.svg"
            alt="return icon"
            draggable={false}
          />
        </div>
      )}
      <div className="tabs flex h-[56px] w-full overflow-hidden bg-[#B3B3B3] rounded-t-[24px]">
        <ShowcaseTabSelector
          isActive={tab === "Sample Items"}
          onClick={() => handleTabChange("Sample Items")}
          title={"Sample Items"}
          activeTitle={active}
        >
          <div className="flex items-center justify-center cursor-pointer">
            <Image
              width={12}
              height={12}
              alt="Sample Tab Icon"
              src="/admin/images/icon/sample-icon.svg"
              className="mr-2"
            />
            <span className="text-xs font-medium leading-6 text-[#FAFAFA]">
              Samples Items
            </span>
          </div>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Inventory"}
          onClick={() => handleTabChange("Inventory")}
          title={"Inventory"}
          activeTitle={active}
        >
          <div className="flex items-center justify-center cursor-pointer">
            <Image
              width={16}
              height={16}
              alt="Inventory Tab Icon"
              src="/admin/images/icon/inventory-icon.svg"
              className="mr-2"
            />
            <span className="text-xs font-medium leading-6 text-[#FAFAFA]">
              Inventory
            </span>
          </div>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Settings"}
          onClick={() => handleTabChange("Settings")}
          title={"Settings"}
          activeTitle={active}
        >
          <div className="flex items-center justify-center cursor-pointer">
            <Image
              width={16}
              height={16}
              alt="Setting Tab Icon"
              src="/admin/images/icon/setting-icon.svg"
              className="mr-2"
            />
            <span className="text-xs font-medium leading-6 text-[#FAFAFA]">
              Settings
            </span>
          </div>
        </ShowcaseTabSelector>
      </div>
      <div className="tab-content flex flex-col w-full h-screen-minus-170 bg-[#828282] backdrop-blur-[25px] rounded-b-3xl">
        <div className="flex flex-1 pl-8 pr-8 pt-12 pb-12 w-full flex-col overflow-auto">
          <TabPanel hidden={tab !== "Sample Items"}>
            <ShowcaseSampleTab
              clickSampleItem={clickSampleItem}
              dragSampleItem={dragSampleItem}
            ></ShowcaseSampleTab>
          </TabPanel>
          <TabPanel
            hidden={tab !== "Inventory"}
            className={tab === "Inventory" ? "flex-1 flex flex-col" : ""}
          >
            <ShowcaseInventoryTab
              clickNftItem={clickNftItem}
              dragNftItem={dragNftItem}
            ></ShowcaseInventoryTab>
          </TabPanel>
          <TabPanel hidden={tab !== "Settings"}>
            <div
              className="overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="mx-auto">
                <Collapse title="WALLPAPER">
                  <ColorPicker
                    mode={true}
                    initialColor={wt}
                    onColorChanged={(color) => {
                      setWt(color);
                      updateUnityTheme();
                    }}
                  />
                </Collapse>
                <div className="pb-8"></div>
                <Collapse title="FLOOR">
                  <ColorPicker
                    mode={true}
                    initialColor={ft}
                    onColorChanged={(color) => {
                      setFt(color);
                      updateUnityTheme();
                    }}
                  />
                </Collapse>
                <div className="pb-8"></div>
                <Collapse title="LIGHTING">
                  <div className="pl-2 pr-[52px] py-4">
                    <div className="flex items-center">
                      <Image
                        width={19}
                        height={19}
                        src="/admin/images/scene_light.svg"
                        alt="Scene Light icon"
                        className="mr-[10px]"
                      />
                      <span className="text-[16px] font-[700] leading-[20px]">
                        Scene Light
                      </span>
                    </div>
                    <div className="p-2">
                      <ColorPicker
                        mode={false}
                        initialColor={st}
                        onColorChanged={(color) => {
                          setSt(color);
                          updateUnityTheme();
                        }}
                      />
                      <BrightnessPicker
                        initialValue={sb}
                        afterChangeHandle={afterChangeHandle}
                        onBrightnessChanged={(val) => {
                          setSb(val);
                          updateUnityTheme();
                        }}
                      />
                    </div>
                    <div className="h-[1px] bg-white"></div>
                  </div>
                  <div className="pl-2 pr-[52px] pt-4">
                    <div className="flex items-center">
                      <Image
                        width={19}
                        height={19}
                        src="/admin/images/point_right.svg"
                        alt="Point Light icon"
                        className="mr-[10px]"
                      />
                      <span className="text-[16px] font-[700] leading-[20px]">
                        Point Light
                      </span>
                    </div>
                    <div className="p-2">
                      <ColorPicker
                        mode={false}
                        initialColor={pt}
                        onColorChanged={(color) => {
                          setPt(color);
                          updateUnityTheme();
                        }}
                      />
                      <BrightnessPicker
                        initialValue={pb}
                        afterChangeHandle={afterChangeHandle}
                        onBrightnessChanged={(val) => {
                          setPb(val);
                          updateUnityTheme();
                        }}
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          </TabPanel>
        </div>
        <ShowcaseUnityUISetting menuShow={operateMenu} />
      </div>
    </div>
  );
};

export default ShowcaseTabView;
