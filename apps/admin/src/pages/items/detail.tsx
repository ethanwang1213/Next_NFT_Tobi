import { auth } from "fetchers/firebase/client";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { fetchSampleItem } from "hooks/SampleActions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Button from "ui/atoms/Button";
import CheckboxInput from "ui/molecules/CheckboxInput";
import DateTimeInput from "ui/molecules/DateTimeInput";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import CopyrightMultiSelect from "ui/organisms/admin/CopyrightMultiSelect";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";
import StatusDropdownSelect from "ui/organisms/admin/StatusDropdownSelect";

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sampleItem, setSampleItem] = useState(null);

  const fileInputRef = useRef(null);
  const imageDropButtonRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    // Restore the background color when dropping
    event.target.style.backgroundColor = "#FFFFFF";
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // upload to the server
      uploadFileToFirestore(file);
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
      uploadFileToFirestore(file);
    }
  };

  const handleDragLeave = (event) => {
    event.target.style.backgroundColor = "#FFFFFF";
  };

  const uploadFileToFirestore = async (file) => {
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

  const fieldChangeHandler = (field, value) => {
    setSampleItem({ ...{ ...sampleItem, [field]: value } });
  };

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
                  <span className="h-14 text-[#717171C1] text-base text-center">
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
