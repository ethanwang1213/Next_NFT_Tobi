import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { UndoneRedoneResult } from "hooks/useCustomUnityHook/types";
import { useTranslations } from "next-intl";
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
  isVisible,
  clickSampleItem,
  dragSampleItem,
  clickNftItem,
  dragNftItem,
  showRestoreMenu,
  settings,
  updateUnityViewSettings,
  operateMenu,
  handleActionRef,
}: {
  isVisible: boolean;
  clickSampleItem: (item: SampleItem) => void;
  dragSampleItem: (item: SampleItem) => void;
  clickNftItem: (item: NftItem, nft: any) => void;
  dragNftItem: (item: NftItem, nft: any) => void;
  showRestoreMenu: boolean;
  settings: any;
  operateMenu: boolean;
  updateUnityViewSettings: (
    wt: string,
    ft: string,
    st: string,
    sb: number,
    pt: string,
    pb: number,
    phase: SettingsUpdatePhase,
  ) => void;
  handleActionRef: React.MutableRefObject<
    (actionType: ActionType, text: string, result: UndoneRedoneResult) => void
  >;
}) => {
  const [tab, setTab] = useTabs(["Sample Items", "Inventory", "Settings"]);
  const [active, setActive] = useState("");
  const [wt, setWt] = useState(String);
  const [ft, setFt] = useState(String);
  const [st, setSt] = useState(String);
  const [sb, setSb] = useState(Number);
  const [pt, setPt] = useState(String);
  const [pb, setPb] = useState(Number);
  const t = useTranslations("Showcase");

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

  handleActionRef.current = handleAction;

  const { handleMouseUp } = useShowcaseEditUnity();

  const handleTabChange = (active) => {
    if (active == tab) {
      return;
    }
    setActive(active);
    setTab(active);
  };

  useEffect(() => {
    if (settings) {
      setWt(settings.wallpaper.tint ?? "#ffffff");
      setFt(settings.floor.tint ?? "#ffffff");
      setSt(settings.lighting.sceneLight.tint ?? "#ffffff");
      setSb(settings.lighting.sceneLight.brightness ?? 0);
      setPt(settings.lighting.pointLight.tint ?? "#ffffff");
      setPb(settings.lighting.pointLight.brightness ?? 0);
    }
  }, [settings]);

  useEffect(() => {
    updateUnityViewSettings(
      wt,
      ft,
      st,
      sb,
      pt,
      pb,
      SettingsUpdatePhase.Updating,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wt, ft, st, sb, pt, pb]);

  return (
    <div
      className={`pointer-events-auto w-[424px] absolute top-[21px] bottom-4 flex flex-col items-center text-base-white  transition-transform duration-400 ease-in-out ${
        isVisible ? "translate-x-0 right-4" : "translate-x-full right-0"
      }`}
    >
      {showRestoreMenu && (
        <div
          className="absolute w-full h-full bg-secondary bg-opacity-75 backdrop-blur-sm 
            flex flex-col gap-6 justify-center items-center z-50 rounded-[20px] select-none"
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <span className="text-white text-[32px] font-bold">
            {t("ReturnItem")}
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
      <div className="tabs flex h-[56px] w-full overflow-hidden bg-[#3F3F3F] rounded-t-[24px]">
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
              {t("SampleItems")}
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
              {t("Inventory")}
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
              {t("Settings")}
            </span>
          </div>
        </ShowcaseTabSelector>
      </div>
      <div className="tab-content flex flex-col w-full h-screen-minus-170 bg-[#757575] backdrop-blur-[25px] rounded-b-3xl">
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
            <div className="overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div className="mx-auto">
                <Collapse title={t("Wallpaper")}>
                  <ColorPicker
                    mode={true}
                    initialColor={wt}
                    onColorChanged={(color) => {
                      setWt(color);
                    }}
                  />
                </Collapse>
                <div className="pb-8"></div>
                <Collapse title={t("Floor")}>
                  <ColorPicker
                    mode={true}
                    initialColor={ft}
                    onColorChanged={(color) => {
                      setFt(color);
                    }}
                  />
                </Collapse>
                <div className="pb-8"></div>
                <Collapse title={t("Lighting")}>
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
                        {t("SceneLight")}
                      </span>
                    </div>
                    <div className="p-2">
                      <ColorPicker
                        mode={false}
                        initialColor={st}
                        onColorChanged={(color) => {
                          setSt(color);
                        }}
                      />
                      <BrightnessPicker
                        initialValue={sb}
                        afterChangeHandle={(val) => {
                          setSb(val);
                          updateUnityViewSettings(
                            wt,
                            ft,
                            st,
                            val,
                            pt,
                            pb,
                            SettingsUpdatePhase.Ended,
                          );
                        }}
                        onBrightnessChanged={(val) => {
                          setSb(val);
                          updateUnityViewSettings(
                            wt,
                            ft,
                            st,
                            val,
                            pt,
                            pb,
                            SettingsUpdatePhase.Updating,
                          );
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
                        {t("PointLight")}
                      </span>
                    </div>
                    <div className="p-2">
                      <ColorPicker
                        mode={false}
                        initialColor={pt}
                        onColorChanged={(color) => {
                          setPt(color);
                        }}
                      />
                      <BrightnessPicker
                        initialValue={pb}
                        afterChangeHandle={(val) => {
                          updateUnityViewSettings(
                            wt,
                            ft,
                            st,
                            sb,
                            pt,
                            val,
                            SettingsUpdatePhase.Ended,
                          );
                        }}
                        onBrightnessChanged={(val) => {
                          setPb(val);
                          updateUnityViewSettings(
                            wt,
                            ft,
                            st,
                            sb,
                            pt,
                            val,
                            SettingsUpdatePhase.Updating,
                          );
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
