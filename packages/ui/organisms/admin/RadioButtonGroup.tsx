import Image from "next/image";
import { useState } from "react";

interface Props {
  title: string;
  onChange: (value: string) => void;
}

const RadioButtonGroup: React.FC<Props> = ({ title, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<String>("OK");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div>
      <div className="flex justify-start items-center text-[15px] font-bold gap-2">
        <p>{title}</p>
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt="information"
        />
      </div>
      <div className="p-4">
        <div className="mb-5 text-[16px] flex items-center">
          <input
            type="radio"
            value="OK"
            checked={selectedOption === "OK"}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span
            className={`pl-2 ${
              selectedOption === "OK" ? "text-primary" : ""
            }`}
          >
            OK
          </span>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            value="NG"
            checked={selectedOption === "NG"}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span
            className={`pl-2 ${
              selectedOption === "NG" ? "text-primary" : ""
            }`}
          >
            NG
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadioButtonGroup;
