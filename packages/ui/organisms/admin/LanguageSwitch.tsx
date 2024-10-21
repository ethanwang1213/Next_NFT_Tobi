import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LanguageSwitch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("JP");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language); // Update selected language
    setIsOpen(false); // Close dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4 text-[16px] w-48 border-r">
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center space-x-2 px-4" onClick={toggleDropdown}>
          <Image
            width={20}
            height={20}
            src="/admin/images/language.svg"
            alt="language icon"
            className="cursor-pointer"
          />
          <button className="p-2 rounded text-gray-500 font-medium">
            LANGUAGE
          </button>
        </div>

        {isOpen && (
          <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <li className="h-[40px] border-b">
              <button
                className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                  selectedLanguage === "JP" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => handleLanguageSelect("JP")}
              >
                <span className="font-bold">JP</span>
                <span className="font-medium">日本語</span>
              </button>
            </li>
            <li className="h-[40px]">
              <button
                className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                  selectedLanguage === "EN" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => handleLanguageSelect("EN")}
              >
                <span className="font-bold">EN</span>
                <span className="font-medium">ENGLISH</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitch;
