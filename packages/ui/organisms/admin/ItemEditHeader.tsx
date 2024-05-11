import Link from "next/link";
import Button from "ui/atoms/Button";
import Breadcrumbs from "ui/molecules/Breadcrumbs";

const ItemEditHeader = ({
  activeName,
  saveHandler,
}: {
  activeName: string;
  saveHandler: () => void;
}) => {
  return (
    <div className="flex pt-9 pl-12 pr-7 h-28">
      <div className="flex-grow">
        <Breadcrumbs
          breadcrumbs={[
            { label: "SAMPLES", href: "/items" },
            {
              label: activeName,
              href: "",
              active: true,
            },
          ]}
        />
      </div>
      <div>
        <Link href="/items">
          <Button
            type="reset"
            className="text-xl h-14 bg-transparent border-primary border-2 text-primary rounded-[30px] mr-6 px-8"
          >
            CANCEL
          </Button>
        </Link>
        <Button
          type="submit"
          className="text-xl h-14 bg-primary text-white rounded-[30px] px-10"
          onClick={saveHandler}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};

export default ItemEditHeader;
