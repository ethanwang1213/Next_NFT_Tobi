import Image from "next/image";
import { RequireMark } from "ui/atoms/Marks";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";

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
  const userInfoChangeHandler = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  return (
    <div>
      <div className="mb-6 text-title-color flex flex-row items-center">
        <span className="text-2xl/[48x] mr-10">登録者情報</span>
        <Image
          src="/admin/images/info-icon-2.svg"
          width={16}
          height={16}
          alt=""
          className=""
        />
        <span className="text-[12px]/[48x] ml-4">
          申請されている方の情報をご記入ください
        </span>
      </div>
      <Row1 label="申請者氏名">
        <div className="flex flex-row justify-between">
          <StyledTextInput
            className="flex-1"
            label="姓"
            placeholder="姓"
            value={userInfo.last_name}
            changeHandler={(value) => userInfoChangeHandler("last_name", value)}
            inputRef={refs["last_name"]}
          />
          <span className="w-8"></span>
          <StyledTextInput
            className="flex-1"
            label="名"
            placeholder="名"
            value={userInfo.first_name}
            changeHandler={(value) =>
              userInfoChangeHandler("first_name", value)
            }
            inputRef={refs["first_name"]}
          />
        </div>
      </Row1>
      <Row2 label1="申請者氏名" label2="フリガナ">
        <div className="flex flex-row justify-between">
          <StyledTextInput
            className="flex-1"
            label="セイ"
            placeholder="セイ"
            value={userInfo.last_name_ruby}
            changeHandler={(value) =>
              userInfoChangeHandler("last_name_ruby", value)
            }
            inputRef={refs["last_name_ruby"]}
          />
          <span className="w-8"></span>
          <StyledTextInput
            className="flex-1"
            label="メイ"
            placeholder="メイ"
            value={userInfo.first_name_ruby}
            changeHandler={(value) =>
              userInfoChangeHandler("first_name_ruby", value)
            }
            inputRef={refs["first_name_ruby"]}
          />
        </div>
      </Row2>
      <Row1 label="生年月日">
        <div className="flex flex-row items-baseline">
          <StyledTextInput
            className="w-32"
            label=""
            placeholder=""
            inputMask={TextKind.Digit}
            value={userInfo.birthday_year}
            changeHandler={(value) =>
              userInfoChangeHandler("birthday_year", value)
            }
            inputRef={refs["birthday_year"]}
          />
          <span className="mx-4">年</span>
          <StyledTextInput
            className="w-24"
            label=""
            placeholder=""
            inputMask={TextKind.Digit}
            value={userInfo.birthday_month}
            changeHandler={(value) =>
              userInfoChangeHandler("birthday_month", value)
            }
            inputRef={refs["birthday_month"]}
          />
          <span className="mx-4">月</span>
          <StyledTextInput
            className="w-24"
            label=""
            placeholder=""
            inputMask={TextKind.Digit}
            value={userInfo.birthday_date}
            changeHandler={(value) =>
              userInfoChangeHandler("birthday_date", value)
            }
            inputRef={refs["birthday_date"]}
          />
          <span className="mx-4">日</span>
        </div>
      </Row1>
      <Row1 label="住所">
        <StyledTextInput
          className="w-48"
          label="郵便番号"
          placeholder="郵便番号"
          value={userInfo.post_code}
          changeHandler={(value) => userInfoChangeHandler("post_code", value)}
          inputRef={refs["post_code"]}
        />
      </Row1>
      <Row1 label="">
        <StyledTextInput
          className="w-48"
          label="都道府県"
          placeholder="都道府県"
          value={userInfo.prefectures}
          changeHandler={(value) => userInfoChangeHandler("prefectures", value)}
          inputRef={refs["prefectures"]}
        />
      </Row1>
      <Row1 label="">
        <StyledTextInput
          className="flex-1"
          label="市区町村"
          placeholder="市区町村"
          value={userInfo.municipalities}
          changeHandler={(value) =>
            userInfoChangeHandler("municipalities", value)
          }
          inputRef={refs["municipalities"]}
        />
      </Row1>
      <Row1 label="">
        <StyledTextInput
          className="flex-1"
          label="番地"
          placeholder="番地"
          value={userInfo.street}
          changeHandler={(value) => userInfoChangeHandler("street", value)}
          inputRef={refs["street"]}
        />
      </Row1>
      <Row1 label="">
        <StyledTextInput
          className="flex-1"
          label="建物名・部屋番号"
          placeholder="建物名・部屋番号"
          value={userInfo.building}
          changeHandler={(value) => userInfoChangeHandler("building", value)}
          inputRef={refs["building"]}
        />
      </Row1>
      <Row1 label="電話番号">
        <StyledTextInput
          className="w-64"
          label="ハイフン無し"
          placeholder="ハイフン無し"
          value={userInfo.phone}
          changeHandler={(value) => userInfoChangeHandler("phone", value)}
          inputRef={refs["phone"]}
        />
      </Row1>
      <Row1 label="メールアドレス">
        <StyledTextInput
          className="flex-1"
          label="tobiratory@example.com"
          placeholder="tobiratory@example.com"
          value={userInfo.email}
          changeHandler={(value) => userInfoChangeHandler("email", value)}
          inputRef={refs["email"]}
        />
      </Row1>
    </div>
  );
};

export default UserInformation;
