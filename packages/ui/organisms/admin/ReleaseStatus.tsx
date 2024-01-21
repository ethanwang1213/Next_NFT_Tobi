import React, { useState, useEffect, useRef } from "react";
import ReleasePopupMenu from "./ReleasePopupMenu";

const ReleaseStatus = ({ value, date }: { value: string; date: string }) => {
  // State to track whether the popup menu is open or closed
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [pubStatus, setPubStatus] = useState(value);
  const [pubDate, setPubDate] = useState(date);

  const popupRef = useRef(null);

  // Function to toggle the popup menu
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Clicked outside the popup, so close it
        closePopup();
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Run this effect once on mount

  return (
    <div className="relative">
      <div className="whitespace-nowrap h-24 flex justify-center flex-col">
        <span className="relative">
          {pubStatus}
          <span
            className="absolute top-2/4 -mt-2 right-5 text-xs cursor-pointer"
            onClick={openPopup}
          >
            {pubStatus && pubStatus !== "下書き" ? "▼" : ""}
          </span>
        </span>
      </div>
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute bg-[#07396C] text-white rounded-xl top-16 p-4 pl-6 z-10 text-left"
        >
          <ReleasePopupMenu {...{ pubStatus, pubDate }} />
        </div>
      )}
    </div>
  );
};

export default ReleaseStatus;
