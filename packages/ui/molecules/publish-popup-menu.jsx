import React, { useState } from 'react';
import Popup from 'reactjs-popup';

const PublishPopupMenu = ({ statusString }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <td className="whitespace-nowrap px-3 h-24 mt-1 flex items-center">
      <span className="text-center min-w-16">
        {statusString}
      </span>
      <span className="ml-2 text-xs cursor-pointer" onClick={() => setIsPopupOpen(true)}>
        {statusString && statusString !== "下書き" ? "▼" : ""}
      </span>
      <Popup open={isPopupOpen} closeOnDocumentClick onClose={() => setIsPopupOpen(false)}>
        {/* Your popup menu content goes here */}
        <div className="absolute bg-[#07396C] text-white rounded-xl p-4 w-32 z-10">
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
      </Popup>
    </td>
  );
};

export default PublishPopupMenu;
