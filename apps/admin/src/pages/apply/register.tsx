import { useState } from "react";
import Button from "ui/atoms/Button";
import TripleToggleSwitch from "ui/molecules/TripleToggleSwitch";
import ConfirmInformation from "./confirm";
import ContentInformation from "./content";
import CopyrightInformation from "./copyright";
import UserInformation from "./user";

const Register = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  console.log("step", step);

  let content;
  switch (step) {
    case 1:
      content = <ContentInformation />;
      break;
    case 2:
      content = <UserInformation />;
      break;
    case 3:
      content = <CopyrightInformation />;
      break;
    case 4:
      content = <ConfirmInformation />;
      break;
    // Add more cases for additional steps
    default:
      content = <ContentInformation />;
  }

  return (
    <div>
      <div className="container mx-auto my-2 pt-16 px-0 md:px-20 font-normal">
        <div className="flex flex-row justify-center mb-2">
          <TripleToggleSwitch
            labels={{
              left: { title: "コンテンツ情報", value: 1 },
              center: { title: "登録者情報", value: 2 },
              right: { title: "その他", value: 3 },
            }}
          />
        </div>
        <div className="pt-20">{content}</div>

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
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
