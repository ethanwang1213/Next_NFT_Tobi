import { fetchSampleItem } from "hooks/SampleActions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "ui/atoms/Button";
import CheckboxInput from "ui/molecules/CheckboxInput";
import DateTimeInput from "ui/molecules/DateTimeInput";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";
import { useSelect } from "downshift";
import clsx from "clsx";

const statusValues = [
  { value: 1, title: "Draft", color: "#093159" },
  { value: 2, title: "Private", color: "#505050" },
  { value: 3, title: "Viewing Only", color: "#37AD00" },
  { value: 4, title: "On Sale", color: "#DB6100" },
  { value: 5, title: "Unlisted", color: "#3F3F3F" },
  { value: 6, title: "Scheduled Publishing", color: "#277C00" },
  { value: 7, title: "Scheduled for Sale", color: "#9A4500" },
];

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sampleItem, setSampleItem] = useState(null);

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: statusValues,
    itemToString,
  });

  const fieldChangeHandler = (field, value) => {
    setSampleItem({ ...{ ...sampleItem, [field]: value } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSampleItem(id);
        setSampleItem(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  function itemToString(item) {
    return item ? item.title : "";
  }

  function StatusDropdownButton() {
    return (
      <div>
        <div
          className="w-64 h-12 px-6 text-[#000000] flex justify-between items-center cursor-pointer rounded-[48px]"
          style={{
            backgroundColor: `${
              selectedItem
                ? selectedItem.color
                : statusValues[sampleItem.status - 1].color
            }`,
          }}
          {...getToggleButtonProps()}
        >
          <span>
            {selectedItem
              ? selectedItem.title
              : statusValues[sampleItem.status - 1].title}
          </span>
          <span>{isOpen ? <>▲</> : <>▼</>}</span>
        </div>
        <ul
          className={`absolute w-72 bg-white mt-1 shadow-md p-0 z-10 ${
            !isOpen && "hidden"
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            statusValues.map((item, index) => (
              <li
                className={clsx(
                  highlightedIndex === index && "bg-blue-300",
                  selectedItem === item && "font-bold",
                  "py-2 px-3 shadow-sm flex flex-col",
                )}
                key={item.value}
                {...getItemProps({ item, index })}
              >
                <span>{item.title}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ItemEditHeader />

      {sampleItem && (
        <div className="container mx-auto px-1.5 py-12">
          <div className="flex gap-4">
            <div className="flex-grow flex flex-col gap-9">
              <div className="flex flex-col gap-4 pr-11">
                <h3 className="text-xl text-title-color">SAMPLE DETAIL</h3>
                <div className="flex flex-col gap-6">
                  <StyledTextInput
                    className=""
                    label="Sample Name*"
                    placeholder="Sample Name"
                    value={sampleItem.name}
                    changeHandler={(value) => fieldChangeHandler("name", value)}
                  />
                  <StyledTextArea
                    className=""
                    label="Description"
                    placeholder="Description"
                    value={sampleItem.description}
                    changeHandler={(value) =>
                      fieldChangeHandler("description", value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 pr-11">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-title-color">SAMPLE STATUS</h3>
                  <StatusDropdownButton />
                </div>
                {sampleItem.status == 6 ? (
                  <div className="flex flex-col gap-6 pl-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">Start Date (JST)</span>
                      <DateTimeInput
                        className=""
                        labelDate=""
                        labelTime=""
                        placeholder=""
                        value={sampleItem.release_date}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">End Date (JST)</span>
                      <DateTimeInput
                        className=""
                        labelDate=""
                        labelTime=""
                        placeholder=""
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col gap-6 mt-12">
                <h3 className="text-xl text-title-color">
                  PRICE & DETAILS SETTINGS
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <StyledTextInput
                    className=""
                    label="Price*"
                    placeholder="Price"
                    value={""}
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("price", value)
                    }
                  />
                  <div className="flex">
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                    />
                  </div>
                  <StyledTextInput
                    className=""
                    placeholder="Quantity Limit"
                    value=""
                    label="Quantity Limit"
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("quantityLimit", value)
                    }
                  />
                  <div className="flex justify-start gap-2">
                    <CheckboxInput className="" label="No Quantity Limit" />
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 mt-12">
                <h3 className="text-xl text-title-color">
                  LICENSE & COPYRIGHTS
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                    <StyledTextInput
                      className="flex-grow"
                      label="Copyrights*"
                      placeholder="Copyrights"
                      value={sampleItem.name}
                      changeHandler={(value) =>
                        fieldChangeHandler("name", value)
                      }
                    />
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                    />
                  </div>
                  <div className="flex items-start gap-6">
                    <StyledTextArea
                      className="flex-grow"
                      label="License"
                      placeholder="License"
                      value={sampleItem.description}
                      changeHandler={(value) =>
                        fieldChangeHandler("description", value)
                      }
                    />
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <Image
                  width={384}
                  height={384}
                  className="bg-[#2D94FF6B] rounded-[13px]"
                  src={sampleItem.defaultThumbnailUrl}
                  alt="thumbnail image"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: "#B3B3B3",
                    backgroundImage: `url('${sampleItem.defaultThumbnailUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                >
                  <Image
                    width={24}
                    height={24}
                    alt="upload"
                    src="/admin/images/upload-icon.svg"
                    className="absolute right-3 bottom-3"
                  />
                </div>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: "#B3B3B3",
                  }}
                  className="relative"
                >
                  <Image
                    width={24}
                    height={24}
                    alt="cancel"
                    src="/admin/images/cancel-icon.svg"
                    className="absolute right-3 bottom-3"
                  />
                </div>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "#B3B3B3",
                  }}
                  className="flex flex-col justify-center items-center"
                >
                  <span
                    className="h-14 text-[#717171C1]"
                    style={{ fontSize: 10, lineHeight: 3.6 }}
                  >
                    Drop your Image here
                  </span>
                  <Image
                    width={24}
                    height={24}
                    alt="upload"
                    src="/admin/images/upload-icon.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-11">
            <Link href="/items">
              <Button
                type="submit"
                className="text-xl h-14 bg-[#1779DE] text-white rounded-[30px] px-10"
              >
                SAVE
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
