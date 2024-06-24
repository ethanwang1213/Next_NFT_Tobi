import clsx from "clsx";
import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Button from "ui/atoms/Button";
import DateTimeInput from "ui/molecules/DateTimeInput";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import CopyrightMultiSelect from "ui/organisms/admin/CopyrightMultiSelect";
import ItemEditHeader from "ui/organisms/admin/ItemEditHeader";
import MintConfirmDialog from "ui/organisms/admin/MintConfirmDialog";
import StatusConfirmDialog from "ui/organisms/admin/StatusConfirmDialog";
import StatusDropdownSelect, {
  getSampleStatusTitle,
} from "ui/organisms/admin/StatusDropdownSelect";
import { SampleStatus } from "ui/types/adminTypes";
import useFcmToken from "hooks/useFCMToken";

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [modified, setModified] = useState(false);
  const { token: fcmToken } = useFcmToken();

  const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
  const [confirmDialogDescriptions, setConfirmDialogDescriptions] = useState(
    [],
  );
  const [confirmDialogNotes, setConfirmDialogNotes] = useState([]);
  const [confirmDialogDisabled, setConfirmDialogDisabled] = useState(false);
  const statusConfirmDialogRef = useRef(null);
  const mintConfirmDialogRef = useRef(null);

  const apiUrl = "native/admin/samples";
  const {
    data: sampleItem,
    dataRef,
    loading,
    error,
    setData,
    setLoading,
    postData,
  } = useRestfulAPI(`${apiUrl}/${id}`);

  const fieldChangeHandler = useCallback(
    (field, value) => {
      setData({ ...sampleItem, [field]: value });
      setModified(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sampleItem],
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        fieldChangeHandler("customThumbnailUrl", URL.createObjectURL(file));
      }
    },
    [fieldChangeHandler],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const checkMandatoryFields = () => {
    if (
      sampleItem.status == SampleStatus.ViewingOnly ||
      sampleItem.status == SampleStatus.OnSale ||
      sampleItem.status == SampleStatus.ScheduledPublishing ||
      sampleItem.status == SampleStatus.ScheduledforSale
    ) {
      if (
        sampleItem.name == null ||
        sampleItem.name == "" ||
        sampleItem.description == null ||
        sampleItem.description == "" ||
        sampleItem.quantityLimit == null ||
        sampleItem.quantityLimit == 0 ||
        sampleItem.license == null ||
        sampleItem.license == "" ||
        sampleItem.copyrights == null ||
        sampleItem.copyrights.length == 0
      ) {
        return false;
      }
      if (
        sampleItem.status == SampleStatus.ScheduledPublishing ||
        sampleItem.status == SampleStatus.ScheduledforSale
      ) {
        if (sampleItem.startDate == null || sampleItem.endDate == null) {
          return false;
        }
      }
    }

    return true;
  };

  const showStatusConfirmDialog = () => {
    // check submit
    setConfirmDialogDisabled(!checkMandatoryFields());

    // set title
    setConfirmDialogTitle(
      `Changing from ${getSampleStatusTitle(
        dataRef.current.status > 5
          ? dataRef.current.status - 2
          : dataRef.current.status,
      ).toLowerCase()} to ${getSampleStatusTitle(
        sampleItem.status > 5 ? sampleItem.status - 2 : sampleItem.status,
      ).toLowerCase()}`,
    );

    // set content
    switch (dataRef.current.status) {
      case SampleStatus.Draft:
        switch (sampleItem.status) {
          case SampleStatus.ViewingOnly:
          case SampleStatus.ScheduledPublishing:
            setConfirmDialogDescriptions([
              "Once published, this item will be visible to all users.",
            ]);
            setConfirmDialogNotes([
              "Settings cannot be changed afterward (except for price).",
            ]);
            break;

          case SampleStatus.OnSale:
          case SampleStatus.ScheduledforSale:
            setConfirmDialogDescriptions([
              "In sales status, the item can be sold and distributed.",
            ]);
            setConfirmDialogNotes([
              "Settings cannot be changed afterward (except for price).",
            ]);
            break;

          default:
            return;
        }
        break;

      case SampleStatus.Private:
        switch (sampleItem.status) {
          case SampleStatus.ViewingOnly:
          case SampleStatus.ScheduledPublishing:
            setConfirmDialogDescriptions([
              "Once published, this item will be visible to all users.",
              "If intended for sale/distribution, please select the sales status (On Sale).",
            ]);
            setConfirmDialogNotes([
              "Settings cannot be changed afterward (except for price).",
              "You cannot revert to private status.",
            ]);
            break;

          case SampleStatus.OnSale:
          case SampleStatus.ScheduledforSale:
            setConfirmDialogDescriptions([
              "The item will be published and available for sale and distribution.",
            ]);
            setConfirmDialogNotes([
              "Settings cannot be changed afterward (except for price).",
              "You cannot revert to private status.",
            ]);
            break;

          default:
            return;
        }
        break;

      case SampleStatus.ViewingOnly:
      case SampleStatus.ScheduledPublishing:
        switch (sampleItem.status) {
          case SampleStatus.Unlisted:
            setConfirmDialogDescriptions([
              "This item will be hidden from the content page.",
            ]);
            setConfirmDialogNotes([]);
            break;

          case SampleStatus.OnSale:
          case SampleStatus.ScheduledforSale:
            setConfirmDialogDescriptions([
              "The item will be available for sale and distribution.",
            ]);
            setConfirmDialogNotes([]);
            break;

          default:
            return;
        }
        break;

      case SampleStatus.OnSale:
      case SampleStatus.ScheduledforSale:
        switch (sampleItem.status) {
          case SampleStatus.ViewingOnly:
          case SampleStatus.ScheduledPublishing:
            setConfirmDialogDescriptions([
              "The item will continue to be displayed to all users, but it will be sold or distributed.",
            ]);
            setConfirmDialogNotes([]);
            break;

          case SampleStatus.Unlisted:
            setConfirmDialogDescriptions([
              "This item will be hidden from the content page.",
            ]);
            setConfirmDialogNotes([]);
            break;

          default:
            return;
        }
        break;

      case SampleStatus.Unlisted:
        switch (sampleItem.status) {
          case SampleStatus.ViewingOnly:
          case SampleStatus.ScheduledPublishing:
            setConfirmDialogDescriptions([
              "This item will once again be visible to all users.",
            ]);
            setConfirmDialogNotes([]);
            break;

          case SampleStatus.OnSale:
          case SampleStatus.ScheduledforSale:
            setConfirmDialogDescriptions([
              "The item will be published and will also be available for sale and distribution.",
            ]);
            setConfirmDialogNotes([]);
            break;

          default:
            return;
        }
        break;

      default:
        return;
    }

    statusConfirmDialogRef.current.showModal();
  };

  const saveButtonHandler = async () => {
    if (dataRef.current.status != sampleItem.status) {
      showStatusConfirmDialog();
      return;
    }

    submitHandler();
  };

  const submitHandler = async () => {
    setLoading(true);

    const submitData = {
      name: sampleItem.name,
      description: sampleItem.description,
      customThumbnailUrl: sampleItem.customThumbnailUrl,
      isCustomThumbnailSelected: sampleItem.isCustomThumbnailSelected,
      price: parseInt(sampleItem.price ?? 0),
      status: sampleItem.status,
      startDate: sampleItem.startDate,
      endDate: sampleItem.endDate,
      quantityLimit: parseInt(sampleItem.quantityLimit),
      license: sampleItem.license,
      copyrights: sampleItem.copyrights,
    };

    if (submitData.customThumbnailUrl != dataRef.current.customThumbnailUrl) {
      submitData.customThumbnailUrl = await uploadImage(
        submitData.customThumbnailUrl,
        ImageType.SampleThumbnail,
      );
    }

    if (
      submitData.status != SampleStatus.ScheduledPublishing &&
      submitData.status != SampleStatus.ScheduledforSale
    ) {
      delete submitData.startDate;
      delete submitData.endDate;
    }

    if (await postData(`${apiUrl}/${sampleItem.id}`, submitData)) {
      setModified(false);
      dataRef.current = sampleItem;
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error.toString());
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const isReadOnly = useCallback(() => {
    if (
      dataRef.current.status == SampleStatus.ViewingOnly ||
      dataRef.current.status == SampleStatus.OnSale ||
      dataRef.current.status == SampleStatus.ScheduledPublishing ||
      dataRef.current.status == SampleStatus.ScheduledforSale
    ) {
      return true;
    }
    return false;
  }, [dataRef]);

  const mintConfirmDialogHandler = useCallback(
    async (value: string) => {
      if (value == "mint") {
        postData(`native/items/${id}/mint`, {
          fcmToken: fcmToken,
          amount: 1,
          modelUrl: sampleItem.modelUrl,
        });
      }
    },
    [postData, id, fcmToken, sampleItem],
  );

  return (
    <div className="mt-16 mb-12">
      <ItemEditHeader
        id={Array.isArray(id) ? id[0] : id}
        loading={loading}
        className="ml-8 mr-[104px]"
      />

      {sampleItem && (
        <div className="ml-24 mr-[104px] mt-16">
          <div className="flex gap-4">
            <div className="flex-grow flex flex-col gap-8">
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
                    readOnly={isReadOnly()}
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
                    readOnly={isReadOnly()}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 pr-11">
                {sampleItem.status == SampleStatus.ScheduledPublishing ||
                sampleItem.status == SampleStatus.ScheduledforSale ? (
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
                        readOnly={isReadOnly()}
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
                        readOnly={isReadOnly()}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col gap-6">
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
                    readOnly={isReadOnly()}
                  />
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="quantityLimit"
                      className="w-6 h-6"
                      checked={sampleItem.quantityLimit == -1}
                      onChange={(e) => {
                        if (!isReadOnly() && e.target.checked) {
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
              <div className="flex flex-col gap-6">
                <h3 className="text-xl text-secondary">LICENSE & COPYRIGHTS</h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                    <CopyrightMultiSelect
                      initialSelectedItems={sampleItem.copyrights}
                      handleSelectedItemChange={(changes) => {
                        fieldChangeHandler("copyrights", changes);
                      }}
                      readOnly={isReadOnly()}
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
                      readOnly={isReadOnly()}
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
            <div className="flex flex-col gap-6">
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
              <div className="flex gap-3">
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
                      src="/admin/images/icon/download-icon.svg"
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
                      src="/admin/images/icon/cancel-icon.svg"
                      className="absolute right-3 bottom-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        setData({
                          ...sampleItem,
                          ["isCustomThumbnailSelected"]: false,
                          ["customThumbnailUrl"]: "",
                        });
                      }}
                    />
                  ) : (
                    <Image
                      width={24}
                      height={24}
                      alt="cancel"
                      src="/admin/images/icon/empty-image-icon.svg"
                      className="absolute top-12 left-12"
                    />
                  )}
                </div>
                <div
                  {...getRootProps()}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 13,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "#B3B3B3",
                    backgroundColor: isDragActive ? "#B3B3B3" : "transparent",
                  }}
                  className="flex flex-col justify-center items-center gap-1 pt-2 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <span className="h-14 text-secondary-500 text-base text-center">
                    Drop your Image here
                  </span>
                  <Image
                    width={24}
                    height={24}
                    alt="upload"
                    src="/admin/images/icon/upload-icon.svg"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-secondary">STATUS</h3>
                <StatusDropdownSelect
                  initialStatus={dataRef.current.status}
                  handleSelectedItemChange={(changes) => {
                    fieldChangeHandler("status", changes.selectedItem.value);
                  }}
                />
              </div>
              <div className="text-center h-12">
                {loading ? (
                  <span className="loading loading-spinner loading-md mt-4 text-secondary-600" />
                ) : (
                  <Button
                    className={clsx(
                      "w-full text-xl h-12 text-white rounded-[30px] font-medium",
                      modified ? "bg-primary" : "bg-inactive",
                    )}
                    disabled={!modified}
                    onClick={saveButtonHandler}
                  >
                    Save
                  </Button>
                )}
              </div>
              <div className="text-center h-12">
                {sampleItem.status == SampleStatus.Draft && (
                  <Button
                    className={`w-full h-12 rounded-[30px] border-[3px] border-[#E96800]
                    flex justify-center items-center gap-4
                  `}
                    onClick={() => {
                      if (mintConfirmDialogRef.current) {
                        mintConfirmDialogRef.current.showModal();
                      }
                    }}
                  >
                    <Image
                      src="/admin/images/icon/mint_icon.svg"
                      width={16}
                      height={20}
                      alt="mint icon"
                    />
                    <span className="text-[#E96800] text-xl font-semibold">
                      Mint as an NFT
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <StatusConfirmDialog
        dialogRef={statusConfirmDialogRef}
        title={confirmDialogTitle}
        descriptions={confirmDialogDescriptions}
        notes={confirmDialogNotes}
        disabled={confirmDialogDisabled}
        saveHandler={submitHandler}
      />
      <MintConfirmDialog
        dialogRef={mintConfirmDialogRef}
        changeHandler={mintConfirmDialogHandler}
      />
    </div>
  );
};

export default Detail;
