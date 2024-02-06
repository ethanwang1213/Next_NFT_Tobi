import Image from "next/image";
import { OptionMark, RequireMark } from "ui/atoms/Marks";

const Row1 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
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
      <div className="w-52 h-12 flex-none flex flex-row items-center">
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

const Row3 = ({ label, children }) => {
  return (
    <div className="flex flex-row py-4 pl-6">
      <div className="w-52 h-12 flex-none flex flex-row items-center">
        <span className="text-base mr-4">{label}</span>
        {label.length ? <OptionMark /> : <></>}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

const ConfirmInformation = ({ contentInfo, userInfo }) => {
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
      <Row1 label="コンテンツ名">
        <span className="">{contentInfo.name}</span>
      </Row1>
      <Row2 label1="コンテンツ名" label2="フリガナ">
        <span className="">{contentInfo.ruby}</span>
      </Row2>
      <Row1 label="ジャンル">
        <span className="">{contentInfo.genre}</span>
      </Row1>
      <Row1 label="コンテンツの説明">
        <span className="">{contentInfo.description}</span>
      </Row1>
      <Row3 label="ホームページURL">
        <span className="">{contentInfo.url}</span>
      </Row3>
      <Row1 label="申請者氏名">
        <span className="">
          {userInfo.last_name} {userInfo.first_name}
        </span>
      </Row1>
      <Row2 label1="申請者氏名" label2="フリガナ">
        <span className="">
          {userInfo.last_name_ruby} {userInfo.first_name_ruby}
        </span>
      </Row2>
      <Row1 label="生年月日">
        <span className="">
          {userInfo.birthday_year}年 {userInfo.birthday_month}月{" "}
          {userInfo.birthday_date}日
        </span>
      </Row1>
      <Row1 label="住所">
        <span className="">
          {userInfo.post_code} {userInfo.prefectures} {userInfo.municipalities}{" "}
          {userInfo.street} {userInfo.building}
        </span>
      </Row1>
      <Row1 label="電話番号">
        <span className="">{userInfo.phone}</span>
      </Row1>
      <Row1 label="メールアドレス">
        <span className="">{userInfo.email}</span>
      </Row1>
    </div>
  );
};

export default ConfirmInformation;
