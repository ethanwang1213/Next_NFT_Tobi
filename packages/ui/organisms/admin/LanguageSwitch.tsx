import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const LanguageSwitch = () => {
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(locale || "jp"); // Initialize with the current locale
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLanguageSelect = (language: string) => {
    if (language !== locale) {
      setSelectedLanguage(language);

      const basePath = "/admin";
      const currentPath = asPath.replace(basePath, "");
      router.push({ pathname: currentPath, query }, undefined, {
        locale: language,
      });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Close the dropdown when clicking outside
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
        <div
          className="flex items-center space-x-2 px-4 cursor-pointer"
          onClick={toggleDropdown}
        >
          <Image
            width={20}
            height={20}
            src="/admin/images/language.svg"
            alt="language icon"
          />
          <button className="p-2 rounded text-gray-500 font-semibold">
            LANGUAGE
          </button>
          <Image
            src="/admin/images/icon/expand.svg"
            width={12}
            height={12}
            alt="drop"
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <li className="h-[40px] border-b">
              <button
                className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                  selectedLanguage === "jp" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => handleLanguageSelect("jp")}
              >
                <span className="font-black">JP</span>
                <span className="font-medium">日本語</span>
              </button>
            </li>
            <li className="h-[40px]">
              <button
                className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                  selectedLanguage === "en" ? "text-blue-500" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => handleLanguageSelect("en")}
              >
                <span className="font-black">EN</span>
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
