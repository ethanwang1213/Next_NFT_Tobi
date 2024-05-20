import { Metadata } from "next";
import { useState } from "react";
import SampleDetailViewPanel from "ui/organisms/admin/SampleDetailViewPanel";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ワークスペース",
};

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(true);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full relative">
        {showDetailView && <SampleDetailViewPanel />}
        <div className="fixed bottom-12 w-full flex justify-center">
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
                console.log("visibility button is clicked");
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
        <div
          className="fixed bottom-16 right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("add button is clicked");
          }}
        >
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/add-icon.svg"
            alt="icon button"
          />
        </div>
        <div
          className="fixed bottom-[178px] right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("list button is clicked");
          }}
        >
          <Image
            width={48}
            height={48}
            src="/admin/images/icon/list-icon.svg"
            alt="icon button"
          />
        </div>
      </div>
    </div>
  );
}
