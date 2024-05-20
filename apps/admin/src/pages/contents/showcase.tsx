import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";

const Showcase = () => {
  const [sampleDetailView, setSampleDetailView] = useState(true);
  const [showcaseTabView, setShowcaseTabView] = useState(true);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full flex justify-between">
        {sampleDetailView && <ShowcaseSampleDetail />}
        <div className="flex-1 relative">
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8">
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/undo-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("undo button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("redo button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/crop-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("crop button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
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
                onClick={() => {
                  console.log("help button is clicked");
                }}
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
