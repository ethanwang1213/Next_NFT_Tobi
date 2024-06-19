import Image from "next/image";

const BoxComponent = ({
  clickBox,
  box,
}: {
  clickBox: (id: number, title: string) => void;
  box: any;
}) => {
  const data = box;
  return (
    <div
      className="rounded-[8px] cursor-pointer bg-white bg-opacity-50 flex flex-wrap w-20 h-20"
      onClick={() => {
        clickBox(data.id, data.name);
      }}
    >
      {data?.items?.map((item, index) => {
        if (index > 3) return;
        return (
          <div key={item.id} className={`p-1`}>
            <Image
              width={data.items.length == 1 ? 72 : 32}
              height={data.items.length == 1 ? 72 : 32}
              src={item.image}
              alt="Inventory Icon"
              style={{
                maxWidth: data.items.length == 1 ? 72 : 32,
                maxHeight: data.items.length == 1 ? 72 : 32,
                objectFit: "contain",
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export { BoxComponent };
