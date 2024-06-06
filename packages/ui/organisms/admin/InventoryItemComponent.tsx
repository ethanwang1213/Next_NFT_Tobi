import Image from "next/image";

const InventoryItemComponent = (props: {
  imageUrl: string;
  selectHandler: () => void;
  dragStartHandler: () => void;
}) => {
  return (
    <Image
      width={80}
      height={80}
      src={props.imageUrl}
      alt="Inventory Icon"
      className="rounded-[8px] cursor-pointer"
      style={{
        maxWidth: 80,
        maxHeight: 80,
        objectFit: "contain",
      }}
      onClick={props.selectHandler}
      onDragStart={props.dragStartHandler}
    />
  );
};

export { InventoryItemComponent };
