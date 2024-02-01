import Link from "next/link";
import { useState } from "react";
import Button from "ui/atoms/Button";

const Terms = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
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
        Last Updated: [Date]
        Welcome to Tobiratory Creator Program!
        1. Acceptance of Terms
           By accessing or using Tobiratory Creator Program, you agree to comply with and be bound by these Terms of Use. If you do not agree with these terms, please do not use the application.
        2. Changes to Terms
           We reserve the right to modify or update these Terms of Use at any time. The latest version will be posted on this page. Your continued use of Tobiratory Creator Program after changes constitute your acceptance of the revised terms.
        3. User Registration
           Some features of Tobiratory Creator Program may require user registration. You agree to provide accurate and complete information during the registration process and to update such information to keep it current.
        4. User Content
           Users may contribute content to Tobiratory Creator Program. By submitting content, you grant Tobiratory.inc a worldwide, royalty-free, non-exclusive license to use, reproduce, modify, publish, distribute, and display the content.
        5. Prohibited Activities
           Users must not engage in activities that violate the law or infringe on the rights of others. Prohibited activities include but are not limited to: (a) unauthorized access to Tobiratory Creator Program; (b) distribution of malicious software; (c) harassment, abuse, or any form of harmful behavior towards others.
        6. Intellectual Property
           Tobiratory.inc retains all rights, title, and interest in and to Tobiratory Creator Program, including all content, trademarks, and copyrights. You may not reproduce, distribute, or create derivative works without our express consent.
        7. Disclaimer of Warranties
           Tobiratory Creator Program is provided "as is" and "as available" without warranties of any kind, either express or implied. Tobiratory.inc disclaims all warranties, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
        8. Limitation of Liability
           Tobiratory.inc shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use or inability to use Tobiratory Creator Program.
        9. Indemnification
           You agree to indemnify and hold Tobiratory.inc, its officers, directors, employees, and agents harmless from and against any claims, liabilities, damages, losses, and expenses arising out of your use of Tobiratory Creator Program.
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
      <Link href={"/apply/info"}>
        <Button
          label="申請フォームへ"
          type="button"
          className={`w-[16rem] h-[3.5rem] text-xl leading-[3.5rem] text-white
        ${isChecked ? "bg-[#1779DE] " : "bg-[#B3B3B3]"} 
        rounded-[30px] mt-6`}
          disabled={!isChecked}
        />
      </Link>
    </div>
  );
};

export default Terms;
