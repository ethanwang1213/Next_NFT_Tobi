import Image from "next/image";

const SampleDetailViewPanel = () => {
  return (
    <div
      className="absolute top-0 left-0 w-[316px] bg-[#001327] min-h-full
    flex flex-col justify-center items-center gap-6 text-base-white px-4 pt-6 pb-10"
    >
      <span className="text-base font-semibold ">Content Name</span>
      <span className="text-2xl font-bold">Item Title</span>
      <Image
        width={160}
        height={160}
        src="/admin/images/png/empty-image.png"
        alt="image"
      />
      <span className="text-[10px] font-normal text-center">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Creator
          </span>
          <span className="text-[10px] font-medium">sample</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Copyright
          </span>
          <span className="text-[10px] font-medium">©sample</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            License
          </span>
          <span className="text-[10px] font-medium flex-1">
            sample sample sample sample sample sample sample sample sample
            sample sample sample sample sample sample sample sample sample
            sample sample sample sample sample sample sample sample sample
            sample
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Date Acquired
          </span>
          <div className="text-[10px] font-medium">
            2023/08/02
            <br />
            Owned for 366 days
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            History
          </span>
          <div className="flex-1 flex gap-1">
            <Image
              width={12}
              height={12}
              src="/admin/images/icon/account-gray.svg"
              alt="account"
            />
            <Image
              width={12}
              height={12}
              src="/admin/images/icon/account-gray.svg"
              alt="account"
            />
            <Image
              width={12}
              height={12}
              src="/admin/images/icon/account-gray.svg"
              alt="account"
            />
            <Image
              width={12}
              height={12}
              src="/admin/images/icon/account-gray.svg"
              alt="account"
            />
            <Image
              width={12}
              height={12}
              src="/admin/images/icon/account-gray.svg"
              alt="account"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] font-medium w-[116px] text-right">
            Serial Number
          </span>
          <span className="text-[10px] font-medium">TBR0123456789</span>
        </div>
        <div className="absolute bottom-3 right-3">
          <Image
            width={21}
            height={24}
            src="/admin/images/icon/delete-icon.svg"
            alt="delete icon"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default SampleDetailViewPanel;
