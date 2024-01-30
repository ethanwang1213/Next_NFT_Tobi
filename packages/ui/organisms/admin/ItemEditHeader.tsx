import Breadcrumbs from "ui/molecules/Breadcrumbs";
import Link from "next/link";
import Button from "ui/atoms/Button";

const ItemEditHeader = () => {
  return (
    <div className="flex pt-9 pl-12 pr-7 h-28">
      <div className="flex-grow">
        <Breadcrumbs
          breadcrumbs={[
            { label: "商品管理", href: "/items" },
            {
              label: "アイテムを編集",
              href: `/items/edit`,
              active: true,
            },
          ]}
        />
      </div>
      <div>
        <Link href="/items">
          <Button
            label="キャンセル"
            type="reset"
            className="text-xl h-14 bg-[#E2E1E1] text-[#1779DE] rounded-[30px] mr-6 px-8"
          />
        </Link>
        <Link href="/items">
          <Button
            label="保存"
            type="submit"
            className="text-xl h-14 bg-[#1779DE] text-white rounded-[30px] px-10"
          />
        </Link>
      </div>
    </div>
  );
};

export default ItemEditHeader;
