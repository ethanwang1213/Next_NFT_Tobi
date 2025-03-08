import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { DefaultLocale, Locale } from "types/localeTypes";
import ColorizedSvg from "ui/atoms/ColorizedSvg";

const LanguageSwitch = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, route } = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(
    locale || DefaultLocale,
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
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
            {selectedLanguage
              ? selectedLanguage === "en"
                ? "ENGLISH"
                : "日本語"
              : "LANGUAGE"}
          </button>
          <ColorizedSvg
            url={"/admin/images/icon/down-arrow-icon.svg"}
            className={`transition-transform duration-300 w-[12px] h-[12px] bg-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-30">
            <li className="h-[40px] border-b">
              <Link href={route} locale={Locale.JA} passHref>
                <button
                  className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                    selectedLanguage === Locale.JA
                      ? "text-blue-500"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                  onClick={() => handleLanguageSelect(Locale.JA)}
                >
                  <span className="font-black">JA</span>
                  <span className="font-medium">日本語</span>
                </button>
              </Link>
            </li>
            <li className="h-[40px]">
              <Link href={route} locale={Locale.EN} passHref>
                <button
                  className={`block px-4 py-2 w-full flex justify-start items-center gap-4 ${
                    selectedLanguage === Locale.EN
                      ? "text-blue-500"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                  onClick={() => handleLanguageSelect(Locale.EN)}
                >
                  <span className="font-black">EN</span>
                  <span className="font-medium">ENGLISH</span>
                </button>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitch;
