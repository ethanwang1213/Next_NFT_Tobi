import React, { useState, useEffect, useRef } from 'react';

const PublishPopupMenu = ({ statusString }) => {
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
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Run this effect once on mount

  return (
    <div className="relative">
      <div className="whitespace-nowrap h-24 flex justify-center flex-col">
        <span className="relative">
          {statusString}
          <span className="absolute top-2/4 -mt-2 right-5 text-xs cursor-pointer" onClick={openPopup}>
            {statusString && statusString !== "下書き" ? "▼" : ""}
          </span>
        </span>
      </div>
      {isPopupOpen  && (
        <div ref={popupRef} className="absolute bg-[#07396C] text-white rounded-xl top-16 p-4 pl-6 w-36 z-10 text-left">
          <div className="">
            <input type="radio" id="radio1" name="radioGroup" defaultChecked={statusString==="公開" || statusString==="公開中"} autoFocus={false} />
            <label htmlFor="radio1" className="ml-2 text-base/8">公開</label>
          </div>
          <div className="">
            <input type="radio" id="radio2" name="radioGroup" defaultChecked={statusString==="非公開"} autoFocus={false} />
            <label htmlFor="radio2" className="ml-2 text-base/8">非公開</label>
          </div>
          <div className="">
            <input type="radio" id="radio3" name="radioGroup" defaultChecked={statusString==="予約公開"} autoFocus={false} />
            <label htmlFor="radio3" className="ml-2 text-base/8">予約公開</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishPopupMenu;
