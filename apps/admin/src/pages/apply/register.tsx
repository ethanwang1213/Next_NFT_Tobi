import clsx from "clsx";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { RubyCharacters } from "types/ruby";
import Button from "ui/atoms/Button";
import TripleToggleSwitch from "ui/molecules/TripleToggleSwitch";
import ConfirmInformation from "./confirm";
import ContentInformation from "./contentInfo";
import CopyrightInformation from "./copyrightInfo";
import UserInformation from "./userInfo";

const switchLabels = ["コンテンツ情報", "登録者情報", "その他"];

const Register = () => {
  const [switchValue, setSwitchValue] = useState(0);

  const router = useRouter();

  const [contentInfo, setContentInfo] = useState({
    name: "",
    ruby: "",
    url: "",
    genre: "",
    description: "",
  });

  const [userInfo, setUserInfo] = useState({
    last_name: "",
    first_name: "",
    last_name_ruby: "",
    first_name_ruby: "",
    birthday_year: "",
    birthday_month: "",
    birthday_date: "",
    post_code: "",
    prefectures: "",
    municipalities: "",
    street: "",
    building: "",
    phone: "",
    email: "",
  });

  const [copyrightInfo, setCopyrightInfo] = useState({ agreement: false });

  const contentInfoInputRefs = {
    name: useRef(),
    ruby: useRef(),
    genre: useRef(),
    description: useRef(),
  };

  const userInfoInputRefs = {
    last_name: useRef(),
    first_name: useRef(),
    last_name_ruby: useRef(),
    first_name_ruby: useRef(),
    birthday_year: useRef(),
    birthday_month: useRef(),
    birthday_date: useRef(),
    post_code: useRef(),
    prefectures: useRef(),
    municipalities: useRef(),
    street: useRef(),
    building: useRef(),
    phone: useRef(),
    email: useRef(),
  };

  const checkContentInfos = () => {
    // Check if any field is empty
    const emptyField = Object.keys(contentInfo).find((fieldName) => {
      return (
        (fieldName !== "url" && contentInfo[fieldName].trim() === "") ||
        (fieldName === "ruby" &&
          RegExp(`[^${RubyCharacters}]`).test(contentInfo[fieldName]))
      );
    });

    if (emptyField) {
      if (contentInfoInputRefs[emptyField].current) {
        contentInfoInputRefs[emptyField].current.focus();
      }
      return false;
    }

    return true;
  };

  const checkUserInfos = () => {
    // Check if any field is empty
    const emptyField = Object.keys(userInfo).find((fieldName) => {
      return (
        (fieldName !== "building" && userInfo[fieldName].trim() === "") ||
        (fieldName === "last_name_ruby" &&
          RegExp(`[^${RubyCharacters}]`).test(userInfo[fieldName])) ||
        (fieldName === "first_name_ruby" &&
          RegExp(`[^${RubyCharacters}]`).test(userInfo[fieldName])) ||
        (fieldName === "email" &&
          !/^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/.test(userInfo[fieldName]))
      );
    });

    if (emptyField) {
      if (userInfoInputRefs[emptyField].current) {
        userInfoInputRefs[emptyField].current.focus();
      }
      return false;
    }

    return true;
  };

  const handleNext = () => {
    switch (switchValue) {
      case 0:
        if (!checkContentInfos()) return;
        break;

      case 1:
        if (!checkUserInfos()) return;
        break;

      case 3:
        router.replace("/apply/finish");
        return;

      default:
        break;
    }

    setSwitchValue(switchValue + 1);
  };

  const handleBack = () => {
    switch (switchValue) {
      case 0:
        router.replace("/apply/terms");
        return;
    }
    setSwitchValue(switchValue - 1);
  };

  const toggleSwitchHandler = (value) => {
    if (value > 0 && value <= 2 && !checkContentInfos()) return false;
    if (value > 1 && value <= 3 && !checkUserInfos()) return false;
    setSwitchValue(value);
    return true;
  };

  return (
    <div>
      <div className="container mx-auto my-2 pt-16 px-0 md:px-20 font-normal">
        <div className="flex flex-row justify-center mb-2">
          <TripleToggleSwitch
            labels={switchLabels}
            onChange={toggleSwitchHandler}
            value={switchValue}
          />
        </div>
        <div className="pt-20">
          {switchValue === 0 && (
            <ContentInformation
              contentInfo={contentInfo}
              setContentInfo={setContentInfo}
              refs={contentInfoInputRefs}
            />
          )}
          {switchValue === 1 && (
            <UserInformation
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              refs={userInfoInputRefs}
            />
          )}
          {switchValue === 2 && (
            <CopyrightInformation
              copyrightInfo={copyrightInfo}
              setCopyrightInfo={setCopyrightInfo}
            />
          )}
          {switchValue === 3 && (
            <ConfirmInformation userInfo={userInfo} contentInfo={contentInfo} />
          )}
        </div>

        <div className="w-[568px] h-14 mx-auto my-10 flex flex-row justify-between">
          <Button
            type="button"
            className={`w-[268px] h-14 text-xl leading-[56px] text-center text-[#1779DE] 
              border border-[#1779DE] bg-transparent rounded-[30px] 
              relative enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow`}
            onClick={handleBack}
          >
            戻る
          </Button>
          <Button
            type="button"
            className={clsx(
              "w-[268px] h-14 text-xl leading-[56px] text-center text-white rounded-[30px]",
              switchValue === 2 && !copyrightInfo.agreement
                ? "bg-[#B3B3B3]"
                : "bg-[#1779DE]",
            )}
            onClick={handleNext}
            disabled={switchValue === 2 && !copyrightInfo.agreement}
          >
            {switchValue === 2
              ? "確認する"
              : switchValue === 3
                ? "申請"
                : "次へ"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
