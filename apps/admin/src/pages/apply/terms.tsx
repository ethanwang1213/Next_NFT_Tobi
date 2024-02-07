import { useRouter } from "next/router";
import { useState } from "react";

const Terms = () => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleButtonClicked = () => {
    router.replace("/apply/register");
  };
  return (
    <div className="container h-full flex flex-col items-center mx-auto py-20 text-center font-normal text-base text-[#717171]">
      <div className="text-[40px] leading-[60px]">
        Tobiratory Creator Program
      </div>
      <div className="text-[40px] leading-[60px]">利用規約</div>
      <textarea
        className="w-full h-[24rem] mt-6 outline-none border border-[#717171]"
        readOnly
        value={`Terms of Use
        Welcome to Tobiratory Creator Program!
        If you have any questions or concerns about these Terms of Use, please contact us at [Contact Email].
        Thank you for using Tobiratory Creator Program!
        `}
      />
      <div className="flex flex-row items-center mt-6">
        <input
          type="checkbox"
          className="w-6 h-6 mr-3 outline-none"
          onChange={handleCheckboxChange}
          id="checkbox"
        />
        <label
          className={`text-base font-normal ${
            isChecked ? "text-black" : "text-[#717171]"
          }`}
          htmlFor="checkbox"
        >
          利用規約・プライバシーポリシーに同意する。
        </label>
      </div>
      <button
        type="button"
        className={`w-[16rem] h-[3.5rem] rounded-[30px] mt-6 text-xl leading-[3.5rem] text-white
          ${isChecked ? "bg-[#1779DE] " : "bg-[#B3B3B3]"} 
          relative enabled:hover:shadow-xl enabled:hover:-top-[3px] transition-shadow`}
        disabled={!isChecked}
        onClick={handleButtonClicked}
      >
        申請フォームへ
      </button>
    </div>
  );
};

export default Terms;
