import Image from "next/image";

const InventoryItemComponent = (data: { imageUrl: string }) => {
  return (
    <Image
      width={80}
      height={80}
      src={data.imageUrl}
      alt="Inventory Icon"
      className="rounded-[8px] cursor-pointer"
      style={{
        maxWidth: 80,
        maxHeight: 80,
        objectFit: "contain",
      }}
    />
  );
};

export { InventoryItemComponent };
