import Image from "next/image";
import { useEffect, useState } from "react";
import { TabPanel, useTabs } from "react-headless-tabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
}: {
  clickSampleItem: (item: SampleItem) => void;
  dragSampleItem: (item: SampleItem) => void;
  clickNftItem: (item: NftItem) => void;
  dragNftItem: (item: NftItem) => void;
  showRestoreMenu: boolean;
  settings: any;
  updateUnityViewSettings: (
    wt: string,
    ft: string,
    st: string,
    sb: number,
    pt: string,
    pb: number,
  ) => void;
}) => {
  const [tab, setTab] = useTabs(["Sample Items", "Inventory", "Settings"]);
  const [wt, setWt] = useState(String);
  const [ft, setFt] = useState(String);
  const [st, setSt] = useState(String);
  const [sb, setSb] = useState(Number);
  const [pt, setPt] = useState(String);
  const [pb, setPb] = useState(Number);

  const handleTabChange = (active) => {
    if (active == tab) {
      return;
    }
    setTab(active);
  };

  useEffect(() => {
    if (settings != undefined) {
      setWt(settings.wallpaper.tint ?? "#717171");
      setFt(settings.floor.tint ?? "#717171");
      setSt(settings.lighting.sceneLight.tint ?? "#717171");
      setSb(settings.lighting.sceneLight.brightness ?? 1);
      setPt(settings.lighting.pointLight.tint ?? "#717171");
      setPb(settings.lighting.pointLight.brightness ?? 1);
    }
  }, [settings]);

  const updateUnityTheme = () => {
    updateUnityViewSettings(wt, ft, st, sb, pt, pb);
  };

  return (
    <div
      className="w-[432px] min-h-full absolute right-0
        flex flex-col items-center text-base-white"
    >
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
      <nav className="flex h-16 w-full">
        <ShowcaseTabSelector
          isActive={tab === "Sample Items"}
          onClick={() => handleTabChange("Sample Items")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/sample-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Sample Items</span>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Inventory"}
          onClick={() => handleTabChange("Inventory")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/inventory-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Inventory</span>
        </ShowcaseTabSelector>
        <ShowcaseTabSelector
          isActive={tab === "Settings"}
          onClick={() => handleTabChange("Settings")}
        >
          <Image
            width={16}
            height={16}
            alt="Sample Tab Icon"
            src="/admin/images/icon/setting-icon.svg"
            className="mr-3"
          />
          <span className="text-sm font-semibold leading-6">Settings</span>
        </ShowcaseTabSelector>
      </nav>
      <div className="pl-8 pr-8 pt-12 pb-12 w-full flex-1 flex flex-col bg-gray-600 bg-opacity-50 backdrop-blur-[25px]">
        {/* <div
          className="h-[calc(100vh-312px)] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="pl-8 pr-8 pt-12 pb-12"> */}
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
            className="h-[calc(100vh-410px)] overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="max-w-2xl mx-auto">
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
                <div className="pl-2 pr-[68px] py-4">
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
                      onBrightnessChanged={(val) => {
                        setSb(val);
                        updateUnityTheme();
                      }}
                    />
                  </div>
                  <div className="h-[1px] bg-white"></div>
                </div>
                <div className="pl-2 pr-[68px] pt-4">
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
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="dark"
        />
      </div>
      {/* </div>
      </div> */}
      <ShowcaseUnityUISetting />
    </div>
  );
};

export default ShowcaseTabView;
