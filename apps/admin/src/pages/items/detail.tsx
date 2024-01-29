import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "ui/atoms/Button";
import CheckboxInput from "ui/molecules/CheckboxInput";
import DateTimeInput from "ui/molecules/DateTimeInput";
import PublicSwitch from "ui/molecules/PublicSwitch";
import SizeInput from "ui/molecules/SizeInput";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import StyledTextArea from "ui/molecules/StyledTextArea";
import { fetchSampleItem } from "ui/organisms/admin/actions/SampleActions";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sampleItem, setSampleItem] = useState(fetchSampleItem(id));

  const fieldChangeHandler = (field, value) => {
    setSampleItem({ ...{ ...sampleItem, [field]: value } });
  };

  return (
    <div>
      <ItemEditHeader />
      <div className="p-6">
        <PublicSwitch />
      </div>

      <div className="container mx-auto px-1.5 py-8">
        <div className="mb-8 text-2xl/[48x] text-title-color">
          アイテム詳細情報
        </div>
        <div className="flex flex-row">
          <div className="flex-grow">
            <div className="mr-4">
              <StyledTextInput
                className="mb-4"
                label="商品名"
                placeholder="商品名"
                value={sampleItem.name}
                changeHandler={(value) => fieldChangeHandler("name", value)}
                tooltip="test tooltip"
              />
              <StyledTextInput
                className="mb-4"
                label="フリガナ"
                placeholder="フリガナ"
                value={sampleItem.ruby}
                changeHandler={(value) => fieldChangeHandler("ruby", value)}
              />
              <StyledTextInput
                className=""
                label="カテゴリ"
                placeholder="カテゴリ"
                value={sampleItem.category}
                changeHandler={(value) => fieldChangeHandler("category", value)}
              />
            </div>
          </div>
          <Image
            width={179}
            height={179}
            className="mr-12"
            src={sampleItem.image_url}
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
        <div className="h-14 text-base/[56px] text-title-color">商品の説明</div>
        <StyledTextArea
          className=""
          label="ディスクリプション"
          placeholder="ディスクリプション"
          value=""
          changeHandler={(value) => fieldChangeHandler("desc", value)}
        />
        <div className="text-2xl/[48x] text-title-color mt-8">
          SAMPLEアイテム
        </div>
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
              src={sampleItem.image_url}
              alt=""
            />
            <span className="h-12 mt-2 py-2 text-xl font-normal text-[#1779DE]">
              SAMPLEITEM1230
            </span>
          </div>
          <div className="w-44"></div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-title-color">
          価格と詳細設定
          <div className="mt-8 grid grid-cols-2 gap-8">
            <StyledTextInput
              className=""
              label="価格"
              placeholder="価格"
              value={sampleItem.price.toString(10)}
              inputMask={TextKind.Digit}
              changeHandler={(value) => fieldChangeHandler("price", value)}
            />
            <CheckboxInput
              className=""
              label="商品価格に税を適用する（消費税・VAT）"
              tooltip="This is VAT tooltip"
            />
            <StyledTextInput
              className=""
              value=""
              label="GTIN"
              placeholder="GTIN"
              tooltip="This is a GTIN description"
              inputMask={TextKind.Digit}
              changeHandler={(value) => fieldChangeHandler("gtin", value)}
            />
            <StyledTextInput
              className=""
              label="SKU（商品番号）"
              placeholder="SKU（商品番号）"
              value=""
              tooltip="This is a SKU（商品番号） description"
              changeHandler={(value) => fieldChangeHandler("sku", value)}
            />
            <StyledTextInput
              className=""
              placeholder="販売個数"
              value=""
              label="販売個数"
              inputMask={TextKind.Digit}
              changeHandler={(value) => fieldChangeHandler("sales", value)}
            />
            <CheckboxInput
              className=""
              label="個数制限なし"
              tooltip="This is 個数制限なし tooltip"
            />
            <DateTimeInput
              className=""
              labelDate="販売開始日"
              labelTime="時間"
              placeholder="販売開始日"
              value={sampleItem.release_date}
            />
            <DateTimeInput
              className=""
              labelDate="販売終了日"
              labelTime="時間"
              placeholder="販売終了日"
            />
          </div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-title-color">
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
        <div className="mt-12 text-2xl/[48x] text-title-color">
          公開予約設定
          <div className="mt-8 grid grid-cols-2 gap-8">
            <DateTimeInput
              className=""
              labelDate="公開予約"
              labelTime="時間"
              placeholder="公開予約"
            />
            <DateTimeInput
              className=""
              labelDate="非公開予約"
              labelTime="時間"
              placeholder="非公開予約"
            />
          </div>
        </div>
        <div className="mt-12 text-2xl/[48x] text-title-color">
          パッケージ
          <div className="mt-8 grid grid-cols-2 gap-8">
            <StyledTextInput
              className=""
              value=""
              label="パッケージから選ぶ"
              placeholder="パッケージから選ぶ"
            />
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

export default Detail;
