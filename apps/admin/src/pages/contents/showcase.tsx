import { useShowcaseEditUnityContext } from "hooks/useCustomUnityContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ShowcaseEditUnity } from "ui/molecules/CustomUnity";
import CustomToast from "ui/organisms/admin/CustomToast";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";

const Showcase = () => {
  const [showDetailView, setShowDetailView] = useState(true);
  const [showSmartFrame, setShowSmartFrame] = useState(true);
  const { customUnityProvider } = useShowcaseEditUnityContext();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const handleButtonClick = (msg) => {
    setMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const updateContainerWidth = () => {
      const height = document.querySelector(".w-full.h-full").clientHeight;
      const width = Math.ceil((height / 16) * 9);
      setContainerWidth(width);
    };

    // Update container width on mount and window resize
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full relative">
        <ShowcaseEditUnity
          customUnityProvider={customUnityProvider}
          loadData={null}
        />
        {showSmartFrame && (
          <div
            className="absolute top-0 left-0 right-0 flex justify-center h-[100%] bg-transparent"
            style={{
              width: `${containerWidth}px`,
              margin: "0 auto",
              borderColor: "#009FF5",
              borderWidth: "2px",
              borderStyle: "solid",
              left: `${318 - 504}px`,
            }}
          ></div>
        )}
        {showDetailView && <ShowcaseSampleDetail />}
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
                src={
                  showSmartFrame
                    ? "/admin/images/icon/crop-on-icon.svg"
                    : "/admin/images/icon/crop-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowSmartFrame(!showSmartFrame);
                  handleButtonClick(
                    showSmartFrame
                      ? "The smarphone frame is visibly"
                      : "The smarphone frame is disable",
                  );
                }}
              />
              <Image
                width={32}
                height={32}
                alt="toggle button"
                src={
                  showDetailView
                    ? "/admin/images/icon/visibility-on-icon.svg"
                    : "/admin/images/icon/visibility-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowDetailView(!showDetailView);
                  handleButtonClick(
                    showDetailView ? "The UI is hidden" : "The UI is shown",
                  );
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
        {showDetailView && <ShowcaseTabView />}
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
