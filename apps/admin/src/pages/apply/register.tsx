import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import TripleToggleSwitch from "ui/molecules/TripleToggleSwitch";
import ConfirmInformation from "./confirm";
import ContentInformation from "./contentInfo";
import CopyrightInformation from "./copyrightInfo";
import UserInformation from "./userInfo";

const Register = () => {
  const [step, setStep] = useState(1);

  const [switchLabels, setSwitchLabels] = useState({
    left: { title: "コンテンツ情報" },
    center: { title: "登録者情報" },
    right: { title: "その他" },
  });
  const [switchPosition, setSwitchPosition] = useState("left");

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

  const handleNext = () => {
    let emptyField = "";

    switch (step) {
      case 1:
        // Check if any field is empty
        emptyField = Object.keys(contentInfo).find(
          (fieldName) =>
            fieldName !== "url" && contentInfo[fieldName].trim() === "",
        );

        if (emptyField) {
          contentInfoInputRefs[emptyField].current.focus();
          return;
        }
        setSwitchPosition("center");

        break;
      case 2:
        // Check if any field is empty
        emptyField = Object.keys(userInfo).find(
          (fieldName) => userInfo[fieldName].trim() === "",
        );

        if (emptyField) {
          userInfoInputRefs[emptyField].current.focus();
          return;
        }
        setSwitchPosition("right");

        break;

      default:
        break;
    }

    if (step === 4) router.replace("/apply/finish");
    else setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    switch (step) {
      case 1:
        router.replace("/apply/terms");
        return;
      case 2:
        setSwitchPosition("left");
        break;
      case 3:
        setSwitchPosition("center");
        break;
    }
    setStep((prevStep) => prevStep - 1);
  };

  const toggleSwitchHandler = useCallback((value) => {
    value == "left" ? setStep(1) : value == "center" ? setStep(2) : setStep(3);
    setSwitchPosition(value);
  }, []);

  // console.log("register is rendered");

  return (
    <div>
      <div className="container mx-auto my-2 pt-16 px-0 md:px-20 font-normal">
        <div className="flex flex-row justify-center mb-2">
          <TripleToggleSwitch
            labels={switchLabels}
            toggleSwitchHandler={toggleSwitchHandler}
            initPosition={switchPosition}
            // passedPositions={switchPositions}
          />
        </div>
        <div className="pt-20">
          {step === 1 && (
            <ContentInformation
              contentInfo={contentInfo}
              setContentInfo={setContentInfo}
              refs={contentInfoInputRefs}
            />
          )}
          {step === 2 && (
            <UserInformation
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              refs={userInfoInputRefs}
            />
          )}
          {step === 3 && (
            <CopyrightInformation
              copyrightInfo={copyrightInfo}
              setCopyrightInfo={setCopyrightInfo}
            />
          )}
          {step === 4 && (
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
            disabled={step === 3 && !copyrightInfo.agreement}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
