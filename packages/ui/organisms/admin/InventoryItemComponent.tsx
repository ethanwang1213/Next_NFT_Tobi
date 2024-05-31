import Image from "next/image";

const InventoryItemComponent = (data: { imageUrl: string }) => {
  return (
    <div className="rounded-[8px] bg-no-repeat bg-center cursor-pointer bg-contain flex flex-wrap w-20 h-20">
      <Image
        width={80}
        height={80}
        src={data.imageUrl}
        alt="Inventory Icon"
        style={{
          maxWidth: 80,
          maxHeight: 80,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export { InventoryItemComponent };
