import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Checkbox from "ui/atoms/Checkbox";

const FilterPopupMenu = ( {preference, changeHandler} ) => {
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
    <div className="relative">
      <div className="flex items-center px-8">
        <Image
          src="/admin/images/filter-icon.svg"
          alt="Popup Image"
          onClick={openPopup}
          width={36}
          height={36}
          style={{ marginTop: 11, marginBottom: 9, marginRight: 33 }}
        />
        <span className="text-base text-[#717171C1]">アイテムを検索</span>
      </div>
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute bg-[#07396C] text-white rounded-xl p-2 z-10"
        >
          <div className="px-4">
            <Checkbox
              id="checkbox1"
              checked={preference["checkbox1"]}
              onChange={() => changeHandler('checkbox1')}
            />
            <label htmlFor="checkbox1" className="ml-2 text-base/8">
              出品中
            </label>
          </div>
          <div className="px-4">
            <Checkbox
              id="checkbox2"
              checked={preference["checkbox2"]}
              onChange={() => changeHandler('checkbox2')}
            />
            <label htmlFor="checkbox2" className="ml-2 text-base/8">
              未出品
            </label>
          </div>
          <div className="px-4">
            <Checkbox
              id="checkbox3"
              checked={preference["checkbox3"]}
              onChange={() => changeHandler('checkbox3')}
            />
            <label htmlFor="checkbox3" className="ml-2 text-base/8">
              公開
            </label>
          </div>
          <div className="px-4">
            <Checkbox
              id="checkbox4"
              checked={preference["checkbox4"]}
              onChange={() => changeHandler('checkbox4')}
            />
            <label htmlFor="checkbox4" className="ml-2 text-base/8">
              非公開
            </label>
          </div>
          <div className="px-4">
            <Checkbox
              id="checkbox5"
              checked={preference["checkbox5"]}
              onChange={() => changeHandler('checkbox5')}
            />
            <label htmlFor="checkbox5" className="ml-2 text-base/8">
              下書き
            </label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox6" name="checkbox6" />
            <label htmlFor="checkbox6" className="ml-2 text-base/8">
              金額
            </label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio1" name="radioGroup" />
            <label htmlFor="radio1" className="ml-2 text-base/8">
              昇順
            </label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio2" name="radioGroup" />
            <label htmlFor="radio2" className="ml-2 text-base/8">
              降順
            </label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox7" name="checkbox7" />
            <label htmlFor="checkbox7" className="ml-2 text-base/8">
              公開日
            </label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio3" name="radioGroup" />
            <label htmlFor="radio3" className="ml-2 text-base/8">
              昇順
            </label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio4" name="radioGroup" />
            <label htmlFor="radio4" className="ml-2 text-base/8">
              降順
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopupMenu;
