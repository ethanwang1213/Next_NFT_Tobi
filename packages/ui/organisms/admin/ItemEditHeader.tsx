import Link from "next/link";
import Button from "ui/atoms/Button";
import NextImage from "next/image";

const ItemEditHeader = ({
  id,
  loading,
  className,
}: {
  id: string;
  loading: boolean;
  className: string;
}) => {
  return (
    <div className={`${className} h-12 flex items-center gap-3`}>
      <Link href="/items">
        <NextImage
          src="/admin/images/icon/arrow_back.svg"
          width={32}
          height={32}
          alt="back icon"
        />
      </Link>
      <span className="flex-1 text-secondary-600 text-[32px] font-semibold">
        ITEM DETAIL
      </span>
      {loading ? (
        <span className="loading loading-spinner loading-md text-secondary-600" />
      ) : (
        <div>
          <Link href={`/workspace/${id}`}>
            <Button
              className="w-[384px] h-12 rounded-[30px] border-primary-500 border-[3px] 
                flex justify-center items-center gap-3"
            >
              <NextImage
                src="/admin/images/icon/preview.svg"
                width={32}
                height={32}
                alt="preview icon"
              />
              <span className="text-primary-500 text-2xl font-medium">
                Preview in Workspace
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemEditHeader;
