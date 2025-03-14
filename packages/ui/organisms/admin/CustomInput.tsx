import Image from "next/image";
import React from "react";

interface CustomInputProps {
  birthday: Date | null;
  setBirthday: (date: Date | null) => void;
  onClick: () => void;
}
const CustomInput: React.FC<CustomInputProps> = ({
  birthday,
  setBirthday,
  onClick,
}) => {
  return (
    <div className="relative">
      <input
        value={birthday ? birthday.toLocaleDateString("ja-JP") : ""}
        readOnly
        className="rounded-full w-full border border-neutral-200 py-3 pl-3 pr-10 outline-none text-black text-sm leading-4"
        placeholder="YYYY/MM/DD"
        onClick={onClick}
      />
      {birthday && (
        <button
          type="button"
          onClick={() => setBirthday(null)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          aria-label="Clear date"
        >
          <Image
            src="/admin/images/icon/closeButton.svg"
            width={16}
            height={16}
            alt="close icon"
          />
        </button>
      )}
    </div>
  );
};

export default CustomInput;
