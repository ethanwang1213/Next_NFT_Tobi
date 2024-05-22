import { useShowcaseEditUnityContext } from "hooks/useCustomUnityContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ShowcaseEditUnity } from "ui/molecules/CustomUnity";
import CustomToast from "ui/organisms/admin/CustomToast";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";

const Showcase = () => {
  const [sampleDetailView, setSampleDetailView] = useState(true);
  const [showcaseTabView, setShowcaseTabView] = useState(true);
  const { customUnityProvider } = useShowcaseEditUnityContext();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const handleButtonClick = (msg) => {
    setMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full relative">
        <ShowcaseEditUnity
          customUnityProvider={customUnityProvider}
          loadData={null}
        />
        {sampleDetailView && <ShowcaseSampleDetail />}
        {/* Align component in the center */}
        {/* 318px: width of left component. 504px: width of right component. */}
        <div
          className="w-[336px] mt-[72px] absolute"
          style={{ left: "calc(318px + (100% - 318px - 504px - 336px) / 2)" }}
        >
          {showToast && <CustomToast message={message}></CustomToast>}
        </div>
        <div
          className="w-[336px] bottom-0 absolute"
          style={{ left: "calc(318px + (100% - 318px - 504px - 336px) / 2)" }}
        >
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8">
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/undo-icon.svg"
                className="cursor-pointer"
                onClick={() =>
                  handleButtonClick("undo: Deleted Sample Item A ")
                }
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer"
                onClick={() =>
                  handleButtonClick("redo: Deleted Sample Item A ")
                }
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/crop-icon.svg"
                className="cursor-pointer"
                onClick={() => handleButtonClick("crop button is clicked")}
              />
              <Image
                width={32}
                height={32}
                alt="toggle button"
                src="/admin/images/icon/visibility-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  setSampleDetailView(!sampleDetailView);
                  setShowcaseTabView(!showcaseTabView);
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/help-icon.svg"
                className="cursor-pointer"
                onClick={() => handleButtonClick("help button is clicked")}
              />
            </div>
          </div>
        </div>
        {showcaseTabView && <ShowcaseTabView />}
        <div className="fixed mt-[24px] ml-[38px]">
          <Link
            href="/contents"
            className="rounded-lg bg-gray-400 bg-opacity-50 flex items-center gap-2 text-white backdrop-blur-md p-2"
          >
            <Image
              width={32}
              height={32}
              alt="Link back Icon"
              src="/admin/images/icon/arrow-back-icon.svg"
            />
            <span>Exit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
