import Image from "next/image";
import Link from "next/link";
import Button from "ui/atoms/Button";
import CheckboxInput from "ui/molecules/CheckboxInput";
import DateTimeInput from "ui/molecules/DateTimeInput";
import DigitInput from "ui/molecules/DigitInput";
import PriceInput from "ui/molecules/PriceInput";
import PublicSwitch from "ui/molecules/PublicSwitch";
import SizeInput from "ui/molecules/SizeInput";
import TextInput from "ui/molecules/TextInput";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";

const Edit = () => {
  return (
    <div>
      <ItemEditHeader />
      <div className="p-6">
        <PublicSwitch />
      </div>

      <div className="container mx-auto px-1.5 py-8">
        <div className="mb-8 text-2xl/[48x] text-[#717171]">
          アイテム詳細情報
        </div>
        <div className="flex flex-row">
          <div className="flex-grow">
            <div className="mr-4">
              <TextInput className="mb-4" placeholder="商品名" />
              <TextInput className="mb-4" placeholder="フリガナ" />
              <TextInput className="" placeholder="カテゴリ" />
            </div>
          </div>
          <Image
            width={179}
            height={179}
            className="mr-12"
            src="/admin/images/sample-edit.png"
            alt=""
          />
          <div
            style={{
              width: 179,
              height: 179,
              borderRadius: 13,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "#B3B3B3",
            }}
            className="flex justify-center relative"
          >
            <Image
              width={23}
              height={28}
              alt=""
              src="/admin/images/upload-icon.svg"
            />
            <span
              className="absolute h-14 bottom-0 text-[#717171C1]"
              style={{ fontSize: 10, lineHeight: 3.6 }}
            >
              画像をアップロードして追加
            </span>
          </div>
        </div>
        <div className="h-14 text-base/[56px] text-[#717171]">商品の説明</div>
        <textarea
          className="h-32 w-full pt-4 pb-3.5 pl-5 pr-11 border-2 border-[#717171]/50 rounded-lg resize-none outline-none"
          placeholder="ディスクリプション"
        />
        <div className="text-2xl/[48x] text-[#717171] mt-8">SAMPLEアイテム</div>
        <div className="flex">
          <a
            className="flex-grow h-12 mt-2 ml-6 underline text-xl/[48x] font-normal text-[#1779DE]"
            href=""
          >
            SAMPLE アイテムリストより選択
          </a>
          <div className="flex flex-col">
            <Image
              width={179}
              height={179}
              className="mr-12 inline-block"
              src="/admin/images/sample-edit.png"
              alt=""
            />
            <span className="h-12 mt-2 py-2 text-xl font-normal text-[#1779DE]">
              SAMPLEITEM1230
            </span>
          </div>
          <div className="w-44"></div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-[#717171]">
          価格と詳細設定
          <div className="mt-8 grid grid-cols-2 gap-8">
            <PriceInput className="" placeholder="価格" />
            <CheckboxInput
              className=""
              label="商品価格に税を適用する（消費税・VAT）"
              tooltip="This is VAT tooltip"
            />
            <DigitInput
              className=""
              placeholder="GTIN"
              tooltip="This is a GTIN description"
            />
            <TextInput
              className=""
              placeholder="SKU（商品番号）"
              tooltip="This is a SKU（商品番号） description"
            />
            <DigitInput className="" placeholder="販売個数" />
            <CheckboxInput
              className=""
              label="個数制限なし"
              tooltip="This is 個数制限なし tooltip"
            />
            <DateTimeInput className="" placeholder="販売開始日" />
            <DateTimeInput className="" placeholder="販売終了日" />
          </div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-[#717171]">
          サイズ
          <div className="mt-8 grid grid-cols-2 gap-8">
            <SizeInput className="" />
            <CheckboxInput
              className=""
              label="サイズを固定しない"
              tooltip="This is VAT tooltip"
            />
          </div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-[#717171]">
          公開予約設定
          <div className="mt-8 grid grid-cols-2 gap-8">
            <DateTimeInput className="" placeholder="公開予約" />
            <DateTimeInput className="" placeholder="非公開予約" />
          </div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-[#717171]">
          パッケージ
          <div className="mt-8 grid grid-cols-2 gap-8">
            <DateTimeInput className="" placeholder="パッケージから選ぶ" />
          </div>
        </div>
        <div className="text-center mt-11">
          <Link href="/items">
            <Button
              label="保存"
              type="submit"
              className="text-xl h-14 bg-[#1779DE] text-white rounded-[30px] px-10"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Edit;
