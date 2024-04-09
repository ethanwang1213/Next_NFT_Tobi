import clsx from "clsx";
import { useTcpRegistration } from "fetchers/businessAccount";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  TcpContent,
  TcpCopyright,
  TcpFormType,
  TcpUser,
} from "types/adminTypes";
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

  const [contentInfo, setContentInfo] = useState<TcpContent>({
    name: "",
    url: "",
    description: "",
  });

  const [userInfo, setUserInfo] = useState<TcpUser>({
    lastName: "",
    firstName: "",
    birthdayYear: 0,
    birthdayMonth: 0,
    birthdayDate: 0,
    email: "",
    phone: "",
    building: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  });

  type CopyrightInfo = TcpCopyright & {
    agreement: boolean;
  };

  const [copyrightInfo, setCopyrightInfo] = useState<CopyrightInfo>({
    agreement: false,
    copyrightHolders: [],
    license: "",
    file1: "",
    file2: "",
    file3: "",
    file4: "",
  });
  const [originalContentDeclaration, setOriginalContentDeclaration] =
    useState(false);

  const [registerTcp, submissionResponse, loading, submissionError] =
    useTcpRegistration();

  useEffect(() => {
    if (!submissionResponse) {
      return;
    }
    router.replace("/apply/finish");
  }, [submissionResponse]);

  const contentInfoInputRefs = {
    name: useRef(),
    description: useRef(),
  };

  const userInfoInputRefs = {
    lastName: useRef(),
    firstName: useRef(),
    birthdayYear: useRef(),
    birthdayMonth: useRef(),
    birthdayDate: useRef(),
    country: useRef(),
    postalCode: useRef(),
    province: useRef(),
    city: useRef(),
    street: useRef(),
    building: useRef(),
    phone: useRef(),
    email: useRef(),
  };

  const copyrightInfoInputRefs = {
    copyrightHolders: useRef(),
    license: useRef(),
  };

  const checkContentInfos = () => {
    // Check if any field is empty
    const emptyField = Object.keys(contentInfo).find((fieldName) => {
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
    const emptyField = Object.keys(userInfo).find((fieldName) => {
      if (typeof userInfo[fieldName] === "number") {
        return userInfo[fieldName] === 0;
      }
      return (
        (fieldName !== "building" && userInfo[fieldName].trim() === "") ||
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

  const checkCopyrightInfos = () => {
    if (
      !copyrightInfo.agreement ||
      copyrightInfo.copyrightHolders.length === 0
    ) {
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

      case 2:
        if (!checkCopyrightInfos()) return;
        break;

      case 3:
        postTCPData();
        return;

      default:
        break;
    }

    setSwitchValue(switchValue + 1);
  };

  const postTCPData = async () => {
    const data: TcpFormType = {
      content: contentInfo,
      user: userInfo,
      copyright: copyrightInfo,
    };
    registerTcp(data);
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

  const isButtonDisabled = () => {
    if (switchValue === 2 && !checkCopyrightInfos()) {
      return true;
    } else if (switchValue === 3 && !originalContentDeclaration) {
      return true;
    }
    return false;
  };

  const nextButtonColor = () => {
    if (isButtonDisabled()) {
      return "bg-inactive";
    }
    return "bg-primary";
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
              refs={copyrightInfoInputRefs}
            />
          )}
          {switchValue === 3 && (
            <ConfirmInformation
              userInfo={userInfo}
              contentInfo={contentInfo}
              copyrightInfo={copyrightInfo}
              originalContentDeclaration={originalContentDeclaration}
              setOriginalContentDeclaration={setOriginalContentDeclaration}
            />
          )}
        </div>

        <div className={"font-medium text-[16px] text-attention text-center"}>
          {submissionError}
        </div>

        <LoadingButton
          nextLabel={
            switchValue === 2 ? "確認する" : switchValue === 3 ? "申請" : "次へ"
          }
          color={nextButtonColor()}
          disabled={isButtonDisabled()}
          loading={loading}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      </div>
    </div>
  );
};

const LoadingButton = ({
  nextLabel,
  color,
  disabled,
  loading,
  handleBack,
  handleNext,
}) => {
  if (loading) {
    return (
      <div className="w-[568px] h-14 mx-auto my-10 flex flex-row justify-center">
        <span className={"loading loading-spinner text-info loading-md"} />
      </div>
    );
  }
  return (
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
          `w-[268px] h-14 text-xl leading-[56px] text-center text-white rounded-[30px] ${color}`,
        )}
        onClick={handleNext}
        disabled={disabled}
      >
        {nextLabel}
      </Button>
    </div>
  );
};

export default Register;
