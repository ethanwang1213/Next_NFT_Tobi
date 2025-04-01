import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { RequireMark } from "ui/atoms/Marks";

const Row1 = ({ label, children }) => {
  return (
    <div className="sm:flex flex-row sm:py-4 py-3 sm:pl-6">
      <div
        className={`w-52 h-12 flex-none flex flex-row items-center mr-4 ${
          label ? "" : "sm:block hidden"
        }`}
      >
        <span className="text-base mr-4">{label}</span>
        {label.length ? <RequireMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const UserInformation = ({ userInfo, setUserInfo, refs }) => {
  const userInfoChangeHandler = (field, e) => {
    const limits = {
      lastName: 25,
      firstName: 25,
      email: 100,
      building: 100,
      street: 100,
      city: 50,
      province: 50,
      postalCode: 10,
    };
    if (limits[field] && e.target.value.length <= limits[field]) {
      setUserInfo({ ...userInfo, [field]: e.target.value });
    }
  };

  const t = useTranslations("TCP");

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
    if (inputPhone.length > 9 && inputPhone.length < 16)
      setUserInfo({ ...userInfo, phone: inputPhone });
  };

  const fieldColor = (value: string) => {
    return value === "" ? "text-placeholder-color" : "text-input-color";
  };

  return (
    <div>
      <div className="mb-6 text-title-color flex flex-col items-center">
        <span className="sm:text-[40px] font-medium">
          {t("RegistrantInfo")}
        </span>
        <div className="flex flex-row items-center">
          <Image
            src="/admin/images/info-icon-2.svg"
            width={16}
            height={16}
            alt="information"
            className=""
          />
          <span className="text-[12px]/[48x] ml-[7px]">
            {t("EnterApplicantInfo")}
          </span>
        </div>
      </div>
      <Row1 label={t("ApplicantName")}>
        <div className="flex flex-row justify-between gap-8">
          <div className="relative flex-1">
            <input
              id="user_last_name"
              className={clsx(
                "w-full h-12 pl-5",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal pr-20",
              )}
              placeholder={t("LastName")}
              value={userInfo.lastName}
              onChange={(e) => userInfoChangeHandler("lastName", e)}
              ref={refs["lastName"]}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              0 | 25
            </span>
          </div>

          <div className="relative flex-1">
            <input
              id="user_first_name"
              className={clsx(
                "w-full h-12 pl-5 pr-20",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              placeholder={t("FirstName")}
              value={userInfo.firstName}
              onChange={(e) => userInfoChangeHandler("firstName", e)}
              ref={refs["firstName"]}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              0 | 25
            </span>
          </div>
        </div>
      </Row1>
      <Row1 label={t("DateOfBirth")}>
        <div className="flex flex-row items-end min-w-[260px] w-[49%]">
          <div className="flex flex-row items-end w-[110px]">
            <input
              id="user_birthday_year"
              className={clsx(
                "w-full h-12 pr-5 text-right",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              value={userInfo.birthdayYear || ""}
              onChange={handleYearChange}
              ref={refs["birthdayYear"]}
              placeholder="2022"
            />
            <span className="mx-4">/</span>
          </div>
          <div className="flex flex-row items-end w-[95px]">
            <input
              id="user_birthday_month"
              className={clsx(
                "w-full h-12 pr-5 text-right",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              value={userInfo.birthdayMonth || ""}
              onChange={handleMonthChange}
              ref={refs["birthdayMonth"]}
              placeholder="05"
            />
            <span className="mx-4">/</span>
          </div>
          <div className="flex flex-row items-end w-[55px]">
            <input
              id="user_birthday_date"
              className={clsx(
                "w-full h-12 pr-5 text-right",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              value={userInfo.birthdayDate || ""}
              onChange={handleDateChange}
              ref={refs["birthdayDate"]}
              placeholder="21"
            />
          </div>
        </div>
      </Row1>
      <Row1 label={t("MailAddress")}>
        <div className="relative flex-1 min-w-[286px] w-[49%]">
          <input
            id="user_email"
            className={clsx(
              "h-12 w-full pl-5 pr-20",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder="tobiratory@example.com"
            value={userInfo.email}
            onChange={(e) => userInfoChangeHandler("email", e)}
            ref={refs["email"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            0 | 100
          </span>
        </div>
      </Row1>
      <Row1 label={t("PhoneNumber")}>
        <div className="relative min-w-[286px] w-[49%]">
          <input
            id="user_phone"
            className={clsx(
              "w-full h-12 pl-5 pr-20",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("NoHyphens")}
            value={userInfo.phone}
            onChange={handlePhoneChange}
            ref={refs["phone"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            0 | 15
          </span>
        </div>
      </Row1>
      <Row1 label={t("Address")}>
        <div className="relative">
          <input
            id="user_building"
            className={clsx(
              "flex-1 w-full h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("BuildingRoom")}
            value={userInfo.building}
            onChange={(e) => userInfoChangeHandler("building", e)}
            ref={refs["building"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            0 | 100
          </span>
        </div>
      </Row1>
      <Row1 label="">
        <div className="relative">
          <input
            id="user_street"
            className={clsx(
              "flex-1 w-full h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("Street")}
            value={userInfo.street}
            onChange={(e) => userInfoChangeHandler("street", e)}
            ref={refs["street"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            0 | 100
          </span>
        </div>
      </Row1>
      <Row1 label="">
        <div className="relative">
          <input
            id="user_city"
            className={clsx(
              "flex-1 w-full h-12 pl-5",
              "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
              "text-sm font-normal text-input-color",
              "placeholder:text-placeholder-color placeholder:font-normal",
            )}
            placeholder={t("City")}
            value={userInfo.city}
            onChange={(e) => userInfoChangeHandler("city", e)}
            ref={refs["city"]}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
            0 | 50
          </span>
        </div>
      </Row1>
      <Row1 label="">
        <div className={"flex gap-1"}>
          <div className="relative min-w-[286px] w-[49%]">
            <input
              id="user_province"
              className={clsx(
                "h-12 pl-5 w-full pr-20",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              placeholder={t("StatePrefecture")}
              value={userInfo.province}
              onChange={(e) => userInfoChangeHandler("province", e)}
              ref={refs["province"]}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              0 | 50
            </span>
          </div>
          <div className="relative min-w-[286px] w-[49%]">
            <input
              id="user_postal_code"
              className={clsx(
                "w-full pr-20 h-12 ml-[25px] pl-5",
                "outline-none border-2 rounded-lg border-input-color hover:border-hover-color focus:border-focus-color",
                "text-sm font-normal text-input-color",
                "placeholder:text-placeholder-color placeholder:font-normal",
              )}
              placeholder={t("PostalCode")}
              value={userInfo.postalCode}
              onChange={(e) => userInfoChangeHandler("postalCode", e)}
              ref={refs["postalCode"]}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              0 | 50
            </span>
          </div>
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
            {t("Country")}
          </option>
          <option value={"japan"}>日本</option>
        </select>
      </Row1>
    </div>
  );
};

export default UserInformation;
