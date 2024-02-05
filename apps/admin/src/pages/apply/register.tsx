import { useRouter } from "next/router";
import { useRef, useState } from "react";
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
    let emptyField;
    emptyField = Object.keys(contentInfo).find((fieldName) => {
      return fieldName !== "url" && contentInfo[fieldName].trim() === "";
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
    let emptyField;
    emptyField = Object.keys(userInfo).find(
      (fieldName) =>
        fieldName !== "building" && userInfo[fieldName].trim() === "",
    );
    if (emptyField == undefined) {
      // check email format
      emptyField = /^[\w\-._+]+@[\w\-._]+\.[A-Za-z]+/.test(userInfo["email"])
        ? undefined
        : "email";
    }
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
    console.log(value);
    if (value > 0 && value <= 2 && !checkContentInfos()) return false;
    if (value > 1 && value <= 3 && !checkUserInfos()) return false;
    setSwitchValue(value);
    return true;
  };

  console.log("register is rendered", switchValue);

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

        <div className="w-[568px] h-14 mx-auto mt-10 flex flex-row justify-between">
          <Button
            label="戻る"
            type="button"
            className="w-[268px] h-14 text-xl leading-[56px] text-center border border-[#1779DE] bg-transparent text-[#1779DE] rounded-[30px]"
            onClick={handleBack}
          ></Button>
          <Button
            label="次へ"
            type="button"
            className="w-[268px] h-14 text-xl leading-[56px] text-center bg-[#1779DE] text-white rounded-[30px]"
            onClick={handleNext}
            disabled={switchValue === 2 && !copyrightInfo.agreement}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
