import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  onChange: (value: boolean) => void;
  initialValue: boolean;
}

const RadioButtonGroup: React.FC<Props> = ({
  title,
  onChange,
  initialValue,
}) => {
  const [selectedOption, setSelectedOption] = useState<boolean>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true"; // Convert string to boolean
    setSelectedOption(value);
    onChange(value);
  };

  useEffect(() => {
    setSelectedOption(initialValue);
  }, [initialValue]);

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
            value="true"
            checked={selectedOption === true}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span
            className={`pl-2 ${selectedOption === true ? "text-primary" : ""}`}
          >
            OK
          </span>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            value="false"
            checked={selectedOption === false}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span
            className={`pl-2 ${selectedOption === false ? "text-primary" : ""}`}
          >
            NG
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadioButtonGroup;
