import { auth } from "fetchers/firebase/client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { fetchSampleItem, updateSampleItem } from "fetchers/SampleActions";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import DateTimeInput from "ui/molecules/DateTimeInput";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import CopyrightMultiSelect from "ui/organisms/admin/CopyrightMultiSelect";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";
import StatusDropdownSelect, {
  SampleStatus,
} from "ui/organisms/admin/StatusDropdownSelect";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { useDebouncedCallback } from "use-debounce";

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sampleItem, setSampleItem] = useState(null);
  const [changed, setChanged] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const fileInputRef = useRef(null);
  const imageDropButtonRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    // Restore the background color when dropping
    event.target.style.backgroundColor = "#FFFFFF";
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // upload to the server
      uploadFileToFireStorage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    // Change the background color when dragging over
    event.target.style.backgroundColor = "#B3B3B3";
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // upload to the server
      uploadFileToFireStorage(file);
    }
  };

  const handleDragLeave = (event) => {
    event.target.style.backgroundColor = "#FFFFFF";
  };

  const uploadFileToFireStorage = async (file) => {
    try {
      // Get file extension
      const fileName = file.name;
      const extension = fileName.substring(fileName.lastIndexOf(".") + 1);

      // Create a root reference
      const storage = getStorage();

      // Generate a unique filename for the file
      const storageFileName = `${Date.now()}.${extension}`;

      // Upload the file to Firebase Storage
      const fileRef = ref(
        storage,
        `thumbnails/${auth.currentUser.uid}/${storageFileName}`,
      );

      await uploadBytes(fileRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(fileRef);
      fieldChangeHandler("customThumbnailUrl", downloadURL);
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Error uploading file:", error);
    }
  };

  const fieldChangeHandler = useDebouncedCallback((field, value) => {
    setSampleItem({ ...{ ...sampleItem, [field]: value } });
    setChanged(true);
  }, 300);

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the click event of the file input
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

  const submitData = async () => {
    console.log("sampleItem", sampleItem);
    if (sampleItem.status != SampleStatus.Draft) {
      if (
        sampleItem.name == null ||
        sampleItem.name.length == 0 ||
        sampleItem.quantityLimit == null ||
        sampleItem.quantityLimit == 0 ||
        sampleItem.license == null ||
        sampleItem.license.length == 0 ||
        sampleItem.copyrights == null ||
        sampleItem.license.copyrights == 0
      ) {
        setErrMsg(
          "You cannot set it to 'Viewing Only' if mandatory fields are not filled in.",
        );
        return;
      }
      if (
        sampleItem.status == SampleStatus.ScheduledPublishing ||
        sampleItem.status == SampleStatus.ScheduledforSale
      ) {
        if (sampleItem.startDate == null || sampleItem.endDate == null) {
          setErrMsg(
            "You cannot set it to 'Viewing Only' if mandatory fields are not filled in.",
          );
          return;
        }
      }
    }

    if (errMsg.length > 0) {
      setErrMsg("");
    }

    const result = await updateSampleItem(sampleItem);
    if (result) {
      setChanged(false);
    }
  };

  return (
    <div>
      <ItemEditHeader
        activeName={sampleItem && sampleItem.name ? sampleItem.name : "No Name"}
      />

      {sampleItem && (
        <div className="container mx-auto px-1.5 py-12">
          <div className="flex gap-4">
            <div className="flex-grow flex flex-col gap-9">
              <div className="flex flex-col gap-4 pr-11">
                <h3 className="text-xl text-secondary">SAMPLE DETAIL</h3>
                <div className="flex flex-col gap-6">
                  <StyledTextInput
                    className=""
                    label="Sample Name*"
                    placeholder="Sample Name"
                    value={sampleItem.name}
                    changeHandler={(value) => fieldChangeHandler("name", value)}
                    maxLen={50}
                  />
                  <StyledTextArea
                    className=""
                    label="Description"
                    placeholder="Description"
                    value={sampleItem.description}
                    changeHandler={(value) =>
                      fieldChangeHandler("description", value)
                    }
                    maxLen={1300}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 pr-11">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl text-secondary">SAMPLE STATUS</h3>
                  <StatusDropdownSelect
                    initialIndex={sampleItem.status - 1}
                    handleSelectedItemChange={(changes) => {
                      fieldChangeHandler("status", changes.selectedItem.value);
                    }}
                  />
                </div>
                {sampleItem.status == 6 || sampleItem.status == 7 ? (
                  <div className="flex flex-col gap-6 pl-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">Start Date (JST)</span>
                      <DateTimeInput
                        className=""
                        labelDate="Date"
                        labelTime="Time"
                        placeholder=""
                        value={sampleItem.startDate}
                        changeHandler={(v) => {
                          fieldChangeHandler("startDate", v);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">End Date (JST)</span>
                      <DateTimeInput
                        className=""
                        labelDate="Date"
                        labelTime="Time"
                        placeholder=""
                        value={sampleItem.endDate}
                        changeHandler={(v) => {
                          fieldChangeHandler("endDate", v);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col gap-6 mt-12">
                <h3 className="text-xl text-secondary">
                  PRICE & DETAILS SETTINGS
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <StyledTextInput
                    className=""
                    label="Price*"
                    placeholder="Price"
                    value={`${sampleItem.price ? sampleItem.price : 0}`}
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("price", value)
                    }
                    readOnly={true}
                  />
                  <div className="flex">
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_price_info"
                      data-tooltip-id={`tooltip_price_info`}
                      data-tooltip-content={`only ￥0 can be set`}
                    />
                    <Tooltip
                      id={`tooltip_price_info`}
                      data-tooltip-id={`image_price_info`}
                      place="right"
                      noArrow={false}
                      border="1px solid #717171"
                      style={{
                        whiteSpace: "pre-line",
                        backgroundColor: "#FFFFFF",
                        color: "#1779DE",
                        width: "140px",
                        fontSize: "12px",
                        lineHeight: "18px",
                        paddingLeft: "8px",
                        paddingRight: "6px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <StyledTextInput
                    className=""
                    placeholder="Quantity Limit"
                    value={`${
                      sampleItem.quantityLimit
                        ? sampleItem.quantityLimit != -1
                          ? sampleItem.quantityLimit
                          : ""
                        : ""
                    }`}
                    label="Quantity Limit"
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("quantityLimit", value)
                    }
                  />
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="quantityLimit"
                      className="w-6 h-6"
                      checked={sampleItem.quantityLimit == -1}
                      onChange={(e) => {
                        if (e.target.checked) {
                          fieldChangeHandler("quantityLimit", -1);
                        }
                      }}
                    />
                    <label
                      className="text-sm text-secondary font-normal"
                      htmlFor="quantityLimit"
                    >
                      No Quantity Limit
                    </label>
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_quantity_info"
                      data-tooltip-id={`tooltip_quantity_info`}
                      data-tooltip-content={`Please check the box if you do not want to set a maximum sales limit.`}
                    />
                    <Tooltip
                      id={`tooltip_quantity_info`}
                      data-tooltip-id={`image_quantity_info`}
                      place="right"
                      noArrow={false}
                      border="1px solid #717171"
                      style={{
                        whiteSpace: "pre-line",
                        backgroundColor: "#FFFFFF",
                        color: "#1779DE",
                        width: "424px",
                        fontSize: "12px",
                        lineHeight: "18px",
                        paddingLeft: "8px",
                        paddingRight: "6px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 mt-12">
                <h3 className="text-xl text-secondary">LICENSE & COPYRIGHTS</h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                    <CopyrightMultiSelect
                      initialSelectedItems={sampleItem.copyrights}
                      handleSelectedItemChange={(changes) => {
                        fieldChangeHandler("copyrights", changes);
                      }}
                    />
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_copyright_info"
                      data-tooltip-id={`tooltip_copyright_info`}
                      data-tooltip-content={`ex. ©Tobiratory`}
                    />
                    <Tooltip
                      id={`tooltip_copyright_info`}
                      data-tooltip-id={`image_copyright_info`}
                      place="right"
                      noArrow={false}
                      border="1px solid #717171"
                      style={{
                        whiteSpace: "pre-line",
                        backgroundColor: "#FFFFFF",
                        color: "#1779DE",
                        width: "140px",
                        fontSize: "12px",
                        lineHeight: "18px",
                        paddingLeft: "8px",
                        paddingRight: "6px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </div>
                  <div className="flex items-start gap-6">
                    <StyledTextArea
                      className="flex-grow"
                      label="License"
                      placeholder="License"
                      value={sampleItem.license}
                      changeHandler={(value) =>
                        fieldChangeHandler("license", value)
                      }
                    />
                    <Image
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      className="pt-2"
                      id="image_license_info"
                      data-tooltip-id={`tooltip_license_info`}
                      data-tooltip-content={`Please enter the license notation in this field. \n ex) "CC0" or detailed license information.`}
                    />
                    <Tooltip
                      id={`tooltip_license_info`}
                      data-tooltip-id={`image_license_info`}
                      place="right"
                      noArrow={false}
                      border="1px solid #717171"
                      style={{
                        whiteSpace: "pre-line",
                        backgroundColor: "#FFFFFF",
                        color: "#1779DE",
                        width: "420px",
                        fontSize: "12px",
                        lineHeight: "18px",
                        paddingLeft: "8px",
                        paddingRight: "6px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
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
                  src={
                    sampleItem.isCustomThumbnailSelected
                      ? sampleItem.customThumbnailUrl
                      : sampleItem.defaultThumbnailUrl
                  }
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
                    borderColor: sampleItem.isCustomThumbnailSelected
                      ? "#B3B3B3"
                      : "#98C6F4",
                    backgroundImage: `url('${sampleItem.defaultThumbnailUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                  onClick={() => {
                    fieldChangeHandler("isCustomThumbnailSelected", false);
                  }}
                >
                  <a
                    href={sampleItem.defaultThumbnailUrl}
                    download
                    className="absolute right-3 bottom-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                    }}
                  >
                    <Image
                      width={24}
                      height={24}
                      alt="download"
                      src="/admin/images/download-icon.svg"
                    />
                  </a>
                </div>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: !sampleItem.isCustomThumbnailSelected
                      ? "#B3B3B3"
                      : "#98C6F4",
                    backgroundImage: `url('${sampleItem.customThumbnailUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                  onClick={() => {
                    if (
                      sampleItem.customThumbnailUrl &&
                      sampleItem.customThumbnailUrl.length > 0
                    ) {
                      fieldChangeHandler("isCustomThumbnailSelected", true);
                    }
                  }}
                >
                  {sampleItem.customThumbnailUrl &&
                  sampleItem.customThumbnailUrl.length > 0 ? (
                    <Image
                      width={24}
                      height={24}
                      alt="cancel"
                      src="/admin/images/cancel-icon.svg"
                      className="absolute right-3 bottom-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        setSampleItem({
                          ...{
                            ...sampleItem,
                            ["isCustomThumbnailSelected"]: false,
                            ["customThumbnailUrl"]: "",
                          },
                        });
                      }}
                    />
                  ) : (
                    <Image
                      width={24}
                      height={24}
                      alt="cancel"
                      src="/admin/images/empty-image-icon.svg"
                      className="absolute top-12 left-12"
                    />
                  )}
                </div>
                <div
                  ref={imageDropButtonRef}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "#B3B3B3",
                  }}
                  className="flex flex-col justify-center items-center gap-1 pt-2"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <span className="h-14 text-secondary-500 text-base text-center">
                    Drop your Image here
                  </span>
                  <Image
                    width={24}
                    height={24}
                    alt="upload"
                    src="/admin/images/upload-icon.svg"
                    className="cursor-pointer"
                    onClick={handleImageClick}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl text-[#FF4747] py-8">{errMsg}</div>
            <Button
              type="submit"
              className={clsx(
                "text-xl h-14 text-white rounded-[30px] px-10",
                changed ? "bg-primary" : "bg-inactive",
              )}
              disabled={!changed}
              onClick={submitData}
            >
              SAVE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
