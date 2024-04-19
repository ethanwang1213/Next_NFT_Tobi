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

const UserInformation = ({ userInfo, setUserInfo, refs }) => {
  const userInfoChangeHandler = (field, e) => {
    setUserInfo({ ...userInfo, [field]: e.target.value.substring(0, 255) });
  };

  const handleYearChange = (event) => {
    // Ensure that only numeric characters are allowed for the year
    let inputYear = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    inputYear = parseInt(inputYear) || 0;
    if (inputYear > 3000) inputYear = 3000;

    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthdayYear: inputYear });
  };

  const handleMonthChange = (event) => {
    // Ensure that only numeric characters are allowed for the month
    let inputMonth = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    inputMonth = parseInt(inputMonth) || 0;
    if (inputMonth > 12) inputMonth = 12;
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthdayMonth: inputMonth });
  };

  const handleDateChange = (event) => {
    // Ensure that only numeric characters are allowed for the date
    let inputDate = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    inputDate = parseInt(inputDate) || 0;
    if (inputDate > 31) inputDate = 31;
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, birthdayDate: inputDate });
  };

  const handlePhoneChange = (event) => {
    // Ensure that only numeric characters are allowed for the date
    const inputPhone = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    // Apply any additional masking or validation logic as needed
    setUserInfo({ ...userInfo, phone: inputPhone });
  };

  const fieldColor = (value: string) => {
    return value === "" ? "text-placeholder-color" : "text-input-color";
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
            value={userInfo.lastName}
            onChange={(e) => userInfoChangeHandler("lastName", e)}
            ref={refs["lastName"]}
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
            value={userInfo.firstName}
            onChange={(e) => userInfoChangeHandler("firstName", e)}
            ref={refs["firstName"]}
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
            value={userInfo.birthdayYear || ""}
            onChange={handleYearChange}
            ref={refs["birthdayYear"]}
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
            value={userInfo.birthdayMonth || ""}
            onChange={handleMonthChange}
            ref={refs["birthdayMonth"]}
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
            value={userInfo.birthdayDate || ""}
            onChange={handleDateChange}
            ref={refs["birthdayDate"]}
          />
          <span className="mx-4">日</span>
        </div>
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
      <Row1 label="住所">
        <input
          id="user_building"
          className={clsx(
            "flex-1 w-full h-12 pl-5",
            "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
            "text-sm font-normal text-input-color",
            "placeholder:text-placeholder-color placeholder:font-normal",
          )}
          placeholder="建物名・部屋番号（任意）"
          value={userInfo.building}
          onChange={(e) => userInfoChangeHandler("building", e)}
          ref={refs["building"]}
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
        <div className={"flex flex-row"}>
          <input
            id="user_province"
            className={clsx(
              "w-[108px] h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="都道府県"
            value={userInfo.province}
            onChange={(e) => userInfoChangeHandler("province", e)}
            ref={refs["province"]}
          />
          <input
            id="user_postal_code"
            className={clsx(
              "w-[108px] h-12 ml-[25px] pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="郵便番号"
            value={userInfo.postalCode}
            onChange={(e) => userInfoChangeHandler("postalCode", e)}
            ref={refs["postalCode"]}
          />
        </div>
      </Row1>
      <Row1 label={""}>
        <select
          id={"user_country"}
          className={`select select-bordered w-[153px] rounded-lg border-2 border-input-color hover:border-hover-color focus:border-focus-color ${fieldColor(
            userInfo.country,
          )}`}
          value={userInfo.country}
          onChange={(e) => userInfoChangeHandler("country", e)}
          ref={refs["country"]}
        >
          <option value={""} disabled selected>
            国
          </option>
          <option value={"japan"}>日本</option>
        </select>
      </Row1>
    </div>
  );
};

export default UserInformation;
