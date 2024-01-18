import Image from "next/image";
import React, { useState } from "react";

const FilterPopupMenu = () => {
  // State to track whether the popup menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the popup menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center py-2 px-8">
        <Image
          src="/admin/images/filter-icon.svg"
          alt="Popup Image"
          onClick={toggleMenu}
          width={36}
          height={36}
          className="inline mr-8"
        />
        <span className="text-base text-[#717171C1]">アイテムを検索</span>
      </div>
      {isMenuOpen && (
        <div className="absolute bg-[#07396C] text-white rounded-xl p-2 z-10">
          <div className="px-4">
            <input type="checkbox" id="checkbox1" name="checkbox1" />
            <label htmlFor="checkbox1" className="ml-2 text-base/8">出品中</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox2" name="checkbox2" />
            <label htmlFor="checkbox2" className="ml-2 text-base/8">未出品</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox3" name="checkbox3" />
            <label htmlFor="checkbox3" className="ml-2 text-base/8">公開</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox4" name="checkbox4" />
            <label htmlFor="checkbox4" className="ml-2 text-base/8">非公開</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox5" name="checkbox5" />
            <label htmlFor="checkbox5" className="ml-2 text-base/8">下書き</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox6" name="checkbox6" />
            <label htmlFor="checkbox6" className="ml-2 text-base/8">金額</label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio1" name="radioGroup" />
            <label htmlFor="radio1" className="ml-2 text-base/8">昇順</label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio2" name="radioGroup" />
            <label htmlFor="radio2" className="ml-2 text-base/8">降順</label>
          </div>
          <div className="px-4">
            <input type="checkbox" id="checkbox7" name="checkbox7" />
            <label htmlFor="checkbox7" className="ml-2 text-base/8">公開日</label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio3" name="radioGroup" />
            <label htmlFor="radio3" className="ml-2 text-base/8">昇順</label>
          </div>
          <div className="px-4 pl-9">
            <input type="radio" id="radio4" name="radioGroup" />
            <label htmlFor="radio4" className="ml-2 text-base/8">降順</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopupMenu;
