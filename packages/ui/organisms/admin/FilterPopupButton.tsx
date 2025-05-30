import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import DigitalItemFilterMenu from "./DigitalItemFilterMenu";

const FilterPopupButton = (props) => {
  // State to track whether the popup menu is open or closed
  const [isPopupOpen, setPopupOpen] = useState(false);
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
    <div className="relative inline-block">
      <div className="flex items-center px-8">
        <Image
          src="/admin/images/icon/filter-icon.svg"
          alt="Popup Image"
          onClick={openPopup}
          width={36}
          height={36}
          className="my-2.5"
        />
      </div>
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute bg-primary-900 text-white rounded-xl px-6 py-4 z-10"
        >
          <DigitalItemFilterMenu {...props} />
        </div>
      )}
    </div>
  );
};

export default FilterPopupButton;
