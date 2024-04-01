import clsx from "clsx";
import Image from "next/image";
import { RequireMark } from "ui/atoms/Marks";

const Row1 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-44 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label}</span>
        {label.length ? <RequireMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const Row2 = ({ label1, label2, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-44 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">
          {label1}
          {label2.length ? (
            <>
              <br />
              {label2}
            </>
          ) : null}
        </span>
        {label1 ? <RequireMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const UserInformation = ({ userInfo, setUserInfo, refs }) => {
  const userInfoChangeHandler = (field, e) => {
    setUserInfo({ ...userInfo, [field]: e.target.value });
  };

  const handleYearChange = (event) => {
    // Ensure that only numeric characters are allowed for the year
    let inputYear = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (parseInt(inputYear) > 3000) inputYear = "3000";
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthday_year: inputYear });
  };

  const handleMonthChange = (event) => {
    // Ensure that only numeric characters are allowed for the month
    let inputMonth = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (parseInt(inputMonth) > 12) inputMonth = "12";
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthday_month: inputMonth });
  };

  const handleDateChange = (event) => {
    // Ensure that only numeric characters are allowed for the date
    let inputDate = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (parseInt(inputDate) > 31) inputDate = "31";
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthday_date: inputDate });
  };

  const handlePhoneChange = (event) => {
    // Ensure that only numeric characters are allowed for the date
    let inputPhone = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, phone: inputPhone });
  };

  return (
    <div>
      <div className="mb-6 text-title-color flex flex-row items-center">
        <span className="text-2xl/[48x] mr-10">登録者情報</span>
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt="information"
          className=""
        />
        <span className="text-[12px]/[48x] ml-4">
          申請されている方の情報をご記入ください
        </span>
      </div>
      <Row1 label="申請者氏名">
        <div className="flex flex-row justify-between">
          <input
            id="user_last_name"
            className={clsx(
              "flex-1 w-full h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="姓"
            value={userInfo.last_name}
            onChange={(e) => userInfoChangeHandler("last_name", e)}
            ref={refs["last_name"]}
          />
          <span className="w-8"></span>
          <input
            id="user_first_name"
            className={clsx(
              "flex-1 w-full h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="名"
            value={userInfo.first_name}
            onChange={(e) => userInfoChangeHandler("first_name", e)}
            ref={refs["first_name"]}
          />
        </div>
      </Row1>
      <Row1 label="生年月日">
        <div className="flex flex-row items-end">
          <input
            id="user_birthday_year"
            className={clsx(
              "w-32 h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            value={userInfo.birthday_year}
            onChange={handleYearChange}
            ref={refs["birthday_year"]}
          />
          <span className="mx-4">年</span>
          <input
            id="user_birthday_month"
            className={clsx(
              "w-24 h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            value={userInfo.birthday_month}
            onChange={handleMonthChange}
            ref={refs["birthday_month"]}
          />
          <span className="mx-4">月</span>
          <input
            id="user_birthday_date"
            className={clsx(
              "w-24 h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            value={userInfo.birthday_date}
            onChange={handleDateChange}
            ref={refs["birthday_date"]}
          />
          <span className="mx-4">日</span>
        </div>
      </Row1>
      <Row1 label="住所">
        <input
          id="user_post_code"
          className={clsx(
            "w-48 h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="郵便番号"
          value={userInfo.post_code}
          onChange={(e) => userInfoChangeHandler("post_code", e)}
          ref={refs["post_code"]}
        />
      </Row1>
      <Row1 label="">
        <input
          id="user_province"
          className={clsx(
            "w-48 h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="都道府県"
          value={userInfo.province}
          onChange={(e) => userInfoChangeHandler("province", e)}
          ref={refs["province"]}
        />
      </Row1>
      <Row1 label="">
        <input
          id="user_city"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="市区町村"
          value={userInfo.city}
          onChange={(e) => userInfoChangeHandler("city", e)}
          ref={refs["city"]}
        />
      </Row1>
      <Row1 label="">
        <input
          id="user_street"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="番地"
          value={userInfo.street}
          onChange={(e) => userInfoChangeHandler("street", e)}
          ref={refs["street"]}
        />
      </Row1>
      <Row1 label="">
        <input
          id="user_building"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="建物名・部屋番号"
          value={userInfo.building}
          onChange={(e) => userInfoChangeHandler("building", e)}
          ref={refs["building"]}
        />
      </Row1>
      <Row1 label="電話番号">
        <input
          id="user_phone"
          className={clsx(
            "w-64 h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="ハイフン無し"
          value={userInfo.phone}
          onChange={handlePhoneChange}
          ref={refs["phone"]}
        />
      </Row1>
      <Row1 label="メールアドレス">
        <input
          id="user_email"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="tobiratory@example.com"
          value={userInfo.email}
          onChange={(e) => userInfoChangeHandler("email", e)}
          ref={refs["email"]}
        />
      </Row1>
    </div>
  );
};

export default UserInformation;
