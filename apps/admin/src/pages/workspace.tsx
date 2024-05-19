import { Metadata } from "next";
import { useState } from "react";
import SampleDetailViewPanel from "ui/organisms/admin/SampleDetailViewPanel";

export const metadata: Metadata = {
  title: "ワークスペース",
};

export default function Index() {
  const [showDetailView, setShowDetailView] = useState(true);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full relative">
        {showDetailView && <SampleDetailViewPanel />}
      </div>
    </div>
  );
}
