import { ReactNode } from "react";
import { ItemType } from "@/types/ItemType";

type Props = {
  imageId: string;
  itemType: ItemType;
  children: ReactNode;
  onClick: () => void;
};

/**
 * 生成するグッズのタイプを選択する用のボタン
 * @param param0
 * @returns
 */
const ItemTypeButton = ({ imageId, itemType, children, onClick }: Props) =>
  itemType === "ACRYLIC_STAND" ? (
    <button
      type="button"
      className="item-type-button"
      onClick={onClick}
    >
      <label htmlFor={`my-modal-${imageId}`} className="cursor-pointer">
        {children}
      </label>
    </button>
  ) : (
    <button
      type="button"
      className="item-type-button"
      onClick={onClick}
    >
      {children}
    </button>
  );

export default ItemTypeButton;
