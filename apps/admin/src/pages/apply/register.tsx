import { getMessages } from "admin/messages/messages";
import clsx from "clsx";
import { useAuth } from "contexts/AdminAuthProvider";
import { useTcpRegistration } from "fetchers/businessAccount";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  EMAIL_REGEX,
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const Register = () => {
  const t = useTranslations("TCP");
  const switchLabels = [t("Content"), t("Registrant"), t("Other")];
  const [switchValue, setSwitchValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = "native/my/business";
  const { data } = useRestfulAPI(apiUrl);

  const router = useRouter();
  const { finishBusinessAccountRegistration, user } = useAuth();

  useEffect(() => {
    if (data) {
      setContentInfo({
        name: data.content?.name,
        url: data.content?.url,
        description: data.content?.description,
      });
      setUserInfo({
        lastName: data.user?.lastName,
        firstName: data.user?.firstName,
        birthdayYear: data.user?.birthdayYear,
        birthdayMonth: data.user?.birthdayMonth,
        birthdayDate: data.user?.birthdayDate,
        email: data.user?.email,
        phone: data.user?.phone,
        building: data.user?.building,
        street: data.user?.street,
        city: data.user?.city,
        province: data.user?.province,
        postalCode: data.user?.postalCode,
        country: data.user?.country,
      });
      setCopyrightInfo({
        agreement: true,
        copyrightHolder: data.copyright?.copyrightHolder[0] || [],
        file1: "",
        file2: "",
        file3: "",
        file4: "",
        license: {
          com: data.copyright?.license?.com || true,
          adp: data.copyright?.license?.adp || true,
          der: data.copyright?.license?.der || true,
          mer: data.copyright?.license?.mer || true,
          dst: data.copyright?.license?.dst || true,
          ncr: data.copyright?.license?.ncr || true,
        },
      });
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [switchValue]);

  const [contentInfo, setContentInfo] = useState<TcpContent>({
    name: user.name,
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
    copyrightHolder: [],
    file1: "",
    file2: "",
    file3: "",
    file4: "",
    license: {
      com: true,
      adp: true,
      der: true,
      mer: true,
      dst: true,
      ncr: true,
    },
  });

  const [registerTcp, validateCopyrightFile, response, loading] =
    useTcpRegistration(setError);

  useEffect(() => {
    if (!response) {
      return;
    }

    finishBusinessAccountRegistration();
    router.replace("/apply/contentApproval");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, router]);

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
        (fieldName === "email" && !EMAIL_REGEX.test(userInfo[fieldName]))
      );
    });

    if (emptyField) {
      if (emptyField === "email") {
        setError(t("invalidEmailFormat"));
      }
      if (userInfoInputRefs[emptyField].current) {
        userInfoInputRefs[emptyField].current.focus();
      }
      return false;
    }

    return true;
  };

  const checkCopyrightInfos = () => {
    if (!copyrightInfo.agreement || !copyrightInfo.copyrightHolder) {
      return false;
    }

    const fileFields = ["file1", "file2", "file3", "file4"];
    const invalidField = fileFields.find((fileField) => {
      if (!copyrightInfo[fileField]) {
        return false;
      }
      try {
        validateCopyrightFile(copyrightInfo[fileField]);
      } catch (err) {
        // To prevent "Too many re-renders," call setError only when the message changes.
        if (error !== err.message) {
          setError(err.message);
        }
        return true;
      }
      return false;
    });

    if (invalidField) {
      return false;
    }

    // To prevent "Too many re-renders," call setError only when the message changes.
    if (error) {
      setError(null);
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

  const trackCreateContent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "create_content", {
        event_category: "Content Creation",
        event_label: "TCP Content",
        value: 1,
      });
    }
  };

  const postTCPData = async () => {
    const data: TcpFormType = {
      content: contentInfo,
      user: userInfo,
      copyright: copyrightInfo,
    };
    trackCreateContent();
    registerTcp(data);
  };

  const handleBack = () => {
    switch (switchValue) {
      case 0:
        router.replace("/apply/terms");
        return;
      case 2:
        setError(null);
        break;
      case 3:
        setError(null);
        break;
    }
    setSwitchValue(switchValue - 1);
  };

  const toggleSwitchHandler = (value) => {
    setError(null);
    if (value > 0 && value <= 2 && !checkContentInfos()) return false;
    if (value > 1 && value <= 3 && !checkUserInfos()) return false;
    setSwitchValue(value);
    return true;
  };

  const isButtonDisabled = () => {
    if (switchValue === 2 && !checkCopyrightInfos()) {
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
      <div className="md:container px-6 mx-auto my-2 sm:py-16 py-8 md:px-20 font-normal">
        <div className="flex flex-row justify-center mb-2">
          {switchValue !== 3 && (
            <TripleToggleSwitch
              labels={switchLabels}
              onChange={toggleSwitchHandler}
              value={switchValue}
            />
          )}
        </div>
        <div className="md:pt-16 pt-6">
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
            />
          )}
        </div>

        <div
          className={
            "flex justify-center items-center font-medium h-10 text-[16px] text-attention"
          }
        >
          {error}
        </div>

        <LoadingButton
          nextLabel={
            switchValue === 2
              ? t("Confirm")
              : switchValue === 3
                ? t("Submit")
                : t("Next")
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
  const t = useTranslations("LogInSignUp");

  if (loading) {
    return (
      <div className="w-full md:w-[568px] h-14 mx-auto my-10 flex flex-row justify-center">
        <span className={"loading loading-spinner text-info loading-md"} />
      </div>
    );
  }
  return (
    <div className="md:w-[568px] md:h-14 h-[35px] mx-auto flex flex-row justify-center gap-4">
      <Button
        type="button"
        className={`md:w-[268px] sm:w-[188px] w-[127px] md:h-14 h-[35px] text-[15px] md:text-xl md:leading-[56px] text-center text-primary 
              border border-primary bg-transparent rounded-[30px] 
              relative enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow`}
        onClick={handleBack}
      >
        {t("Back")}
      </Button>
      <Button
        type="button"
        className={clsx(
          `md:w-[268px] sm:w-[188px] w-[127px] md:h-14 h-[35px] md:text-xl text-[15px] md:leading-[56px] text-center text-white rounded-[30px] ${color}`,
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
