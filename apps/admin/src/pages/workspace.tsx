import { Metadata } from "next";
import { useRef, useState } from "react";
import WorkspaceSampleDetailPanel from "ui/organisms/admin/WorkspaceSampleDetailPanel";
import WorkspaceSampleCreateDialog from "ui/organisms/admin/WorkspaceSampleCreateDialog";
import WorkspaceSampleListPanel from "ui/organisms/admin/WorkspaceSampleListPanel";
import WorkspaceMaterialDialog from "ui/organisms/admin/WorkspaceMaterialDialog";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ワークスペース",
};

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const sampleCreateDialogRef = useRef(null);
  const materialDialogRef = useRef(null);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full flex relative">
        <WorkspaceSampleCreateDialog
          dialogRef={sampleCreateDialogRef}
          changeHandler={null}
        />
        <WorkspaceMaterialDialog
          dialogRef={materialDialogRef}
          changeHandler={null}
        />
        {showDetailView && <WorkspaceSampleDetailPanel />}
        {
          <WorkspaceSampleListPanel
            closeHandler={() => setShowListView(false)}
            isOpen={showListView}
          />
        }

        <div className="flex-grow h-12 flex justify-center">
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
                setShowDetailView(!showDetailView);
              }}
            />
            <Image
              width={32}
              height={32}
              alt="undo button"
              src="/admin/images/icon/help-icon.svg"
              className="cursor-pointer"
              onClick={() => {
                if (materialDialogRef.current) {
                  materialDialogRef.current.showModal();
                }
              }}
            />
          </div>
        </div>
        <div
          className="fixed bottom-16 right-16 w-18 h-[72px] rounded-full bg-secondary 
            flex justify-center items-center cursor-pointer"
          onClick={() => {
            if (sampleCreateDialogRef.current) {
              sampleCreateDialogRef.current.showModal();
            }
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
            setShowListView(!showListView);
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
