import clsx from "clsx";
import {
  decodeBase64ToBinary,
  ImageType,
  uploadData,
  uploadImage,
} from "fetchers/UploadActions";
import { useNftModelGeneratorUnityContext } from "hooks/useCustomUnityContext/useNftModelGeneratorUnityContext";
import useFcmToken from "hooks/useFCMToken";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Button from "ui/atoms/Button";
import { NftModelGeneratorUnity } from "ui/molecules/CustomUnity";
import StyledTextArea from "ui/molecules/StyledTextArea";
import StyledTextInput, { TextKind } from "ui/molecules/StyledTextInput";
import CopyrightMultiSelect from "ui/organisms/admin/CopyrightMultiSelect";
import MintConfirmDialog from "ui/organisms/admin/MintConfirmDialog";
import MintConfirmDialog1 from "ui/organisms/admin/MintConfirmDialog1";
import RadioButtonGroup from "ui/organisms/admin/RadioButtonGroup";
import ScheduleCalendar from "ui/organisms/admin/ScheduleCalendar";
import StatusConfirmDialog from "ui/organisms/admin/StatusConfirmDialog";
import StatusDropdownSelect from "ui/organisms/admin/StatusDropdownSelect";

import {
  DigitalItemStatus,
  getDigitalItemStatusTitle,
  ScheduleItem,
} from "ui/types/adminTypes";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`admin/messages/${locale}.json`)).default,
    },
  };
}

const MintNotification = ({ title, text }) => {
  return (
    <div className="p-[10px] bg-secondary-900 flex flex-col items-center gap-4">
      <span className="text-base text-base-white font-bold text-center">
        {title}
      </span>
      <span className="text-sm text-base-white font-normal text-center">
        {text}
      </span>
    </div>
  );
};

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
  const [status, setStatus] = useState(-1);
  const statusConfirmDialogRef = useRef(null);
  const mintConfirmDialogRef = useRef(null);
  const mintConfirmDialogRef1 = useRef(null);

  const handleNftModelGenerated = async (
    itemId: number,
    nftModelBase64: string,
  ) => {
    const binaryData = decodeBase64ToBinary(nftModelBase64);
    const modelUrl = await uploadData(binaryData);
    const result = await postData(`native/items/${id}/mint`, {
      fcmToken: fcmToken,
      amount: 1,
      modelUrl: modelUrl,
    });

    if (!result) {
      toast(
        <MintNotification
          title={s("MintFailed")}
          text={s("MintFailedLimitExceeded")}
        />,
        {
          className: "mint-notification",
        },
      );
    } else {
      trackSampleMint(digitalItem.type);
    }
  };

  const { unityProvider, isSceneOpen, requestNftModelGeneration } =
    useNftModelGeneratorUnityContext({
      onNftModelGenerated: handleNftModelGenerated,
    });

  const apiUrl = "native/admin/digital_items";
  const {
    data: digitalItem,
    dataRef,
    loading,
    error,
    setData,
    setLoading,
    postData,
  } = useRestfulAPI(`${apiUrl}/${id}`);

  useEffect(() => {
    if (status === -1 && digitalItem) {
      setStatus(digitalItem.status);
    }
  }, [status, digitalItem]);

  const t = useTranslations("Item");
  const b = useTranslations("ItemDetail");
  const l = useTranslations("License");
  const s = useTranslations("Showcase");

  const actions = [
    l("Actions.0"),
    l("Actions.1"),
    l("Actions.2"),
    l("Actions.3"),
    l("Actions.4"),
    l("Actions.5"),
  ];

  const fieldChangeHandler = useCallback(
    (field, value) => {
      setData({ ...digitalItem, [field]: value });
      setModified(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [digitalItem],
  );

  const trackSampleMint = useCallback((sampleType: number) => {
    const sampleTypeLabels: { [key: number]: string } = {
      1: "Poster",
      2: "AcrylicStand",
      3: "CanBadge",
      4: "MessageCard",
      5: "UserUploadedModel",
    };

    const eventLabel = sampleTypeLabels[sampleType] || "unknown";
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "mint_sample", {
        event_category: "MintedCount",
        event_label: eventLabel,
        value: 1,
      });
    }
  }, []);

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
      digitalItem.status == DigitalItemStatus.ViewingOnly ||
      digitalItem.status == DigitalItemStatus.OnSale
    ) {
      if (
        digitalItem.name == null ||
        digitalItem.name == "" ||
        digitalItem.description == null ||
        digitalItem.description == "" ||
        digitalItem.quantityLimit == null ||
        digitalItem.quantityLimit == 0 ||
        digitalItem.license == null ||
        digitalItem.license == "" ||
        digitalItem.copyrights == null ||
        digitalItem.copyrights.length == 0
      ) {
        return false;
      }
    }

    return true;
  };

  const showStatusConfirmDialog = () => {
    // check submit
    setConfirmDialogDisabled(!checkMandatoryFields());
    // set title
    setConfirmDialogTitle(
      `${b("ChangingFrom")} ${getDigitalItemStatusTitle(
        dataRef.current.status,
        t,
      ).toLowerCase()} ${b("ChangingTo")} ${getDigitalItemStatusTitle(
        digitalItem.status,
        t,
      ).toLowerCase()}`,
    );

    // set content
    switch (dataRef.current.status) {
      case DigitalItemStatus.Draft:
        switch (digitalItem.status) {
          case DigitalItemStatus.ViewingOnly:
            setConfirmDialogDescriptions([b("PublishedVisible")]);
            setConfirmDialogNotes([b("SettingsImmutable")]);
            break;

          case DigitalItemStatus.OnSale:
            setConfirmDialogDescriptions([b("SalesStatus")]);
            setConfirmDialogNotes([b("SettingsImmutable")]);
            break;

          default:
            return;
        }
        break;

      case DigitalItemStatus.Private:
        switch (digitalItem.status) {
          case DigitalItemStatus.ViewingOnly:
            setConfirmDialogDescriptions([
              b("PublishedVisible"),
              b("SelectSalesStatus"),
            ]);
            setConfirmDialogNotes([
              b("SettingsImmutable"),
              b("CannotRevertPrivate"),
            ]);
            break;

          case DigitalItemStatus.OnSale:
            setConfirmDialogDescriptions([b("PublishedForSale")]);
            setConfirmDialogNotes([
              b("SettingsImmutable"),
              b("CannotRevertPrivate"),
            ]);
            break;

          default:
            return;
        }
        break;

      case DigitalItemStatus.ViewingOnly:
        switch (digitalItem.status) {
          case DigitalItemStatus.Unlisted:
            setConfirmDialogDescriptions([b("HiddenContentPage")]);
            setConfirmDialogNotes([]);
            break;

          case DigitalItemStatus.OnSale:
            setConfirmDialogDescriptions([b("SalesStatus")]);
            setConfirmDialogNotes([]);
            break;

          default:
            return;
        }
        break;

      case DigitalItemStatus.OnSale:
        switch (digitalItem.status) {
          case DigitalItemStatus.ViewingOnly:
            setConfirmDialogDescriptions([b("DisplayedButSold")]);
            setConfirmDialogNotes([]);
            break;

          case DigitalItemStatus.Unlisted:
            setConfirmDialogDescriptions([b("HiddenContentPage")]);
            setConfirmDialogNotes([]);
            break;

          default:
            return;
        }
        break;

      case DigitalItemStatus.Unlisted:
        switch (digitalItem.status) {
          case DigitalItemStatus.ViewingOnly:
            setConfirmDialogDescriptions([b("VisibleToAll")]);
            setConfirmDialogNotes([]);
            break;

          case DigitalItemStatus.OnSale:
            setConfirmDialogDescriptions([b("DisplayedButSold")]);
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

  const checkSchedules = useCallback((values: ScheduleItem[]) => {
    if (values.length < 2) {
      return true;
    }

    let prevStatus = null;
    for (const schedule of values) {
      if (prevStatus == null) {
        prevStatus = schedule;
        continue;
      } else {
        if (
          prevStatus.status != schedule.status &&
          prevStatus.datetime != schedule.datetime
        ) {
          prevStatus = schedule;
          continue;
        } else {
          return false;
        }
      }
    }

    return true;
  }, []);

  const saveButtonHandler = async () => {
    if (!checkSchedules(digitalItem.schedules)) {
      toast("Status change invalid: Cannot change to the same status.");
      return;
    }

    if (dataRef.current.status != digitalItem.status) {
      showStatusConfirmDialog();
      return;
    }

    submitHandler();
  };

  const sanitizeLicense = (license) => {
    return {
      com: license.com,
      adp: license.adp,
      der: license.der,
      dst: license.dst,
      mer: license.mer,
      ncr: license.ncr,
    };
  };

  const submitHandler = async () => {
    setLoading(true);

    const submitData = {
      name: digitalItem.name,
      description: digitalItem.description,
      customThumbnailUrl: digitalItem.customThumbnailUrl,
      isCustomThumbnailSelected: digitalItem.isCustomThumbnailSelected,
      price: parseInt(digitalItem.price ?? 0),
      ...(digitalItem.status > 2 && { status: digitalItem.status }),
      startDate: digitalItem.startDate,
      endDate: digitalItem.endDate,
      quantityLimit: parseInt(digitalItem.quantityLimit),
      license: sanitizeLicense(digitalItem.license),
      copyrights: digitalItem.copyrights,
      schedules: digitalItem.schedules,
    };

    if (submitData.customThumbnailUrl != dataRef.current.customThumbnailUrl) {
      submitData.customThumbnailUrl = await uploadImage(
        submitData.customThumbnailUrl,
        ImageType.SampleThumbnail,
      );
    }

    if (await postData(`${apiUrl}/${digitalItem.id}`, submitData)) {
      setModified(false);
      dataRef.current = digitalItem;
      const channel = new BroadcastChannel("dataUpdateChannel");
      channel.postMessage("dataUpdated");
      channel.close();
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
      dataRef.current.status == DigitalItemStatus.ViewingOnly ||
      dataRef.current.status == DigitalItemStatus.OnSale
    ) {
      return true;
    }
    return false;
  }, [dataRef]);

  const mintConfirmDialogHandler = useCallback(
    async (value: string) => {
      if (value == "mint") {
        requestNftModelGeneration({
          itemId: digitalItem.id,
          modelType: digitalItem.type,
          modelUrl: digitalItem.modelUrl,
          imageUrl: digitalItem.materialUrl || digitalItem.customThumbnailUrl,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postData, id, fcmToken, digitalItem],
  );

  return (
    <div className="mt-16 mb-12">
      <div className={`ml-8 mr-[104px] h-12 flex items-center gap-4`}>
        <Link href="/items">
          <NextImage
            src="/admin/images/icon/arrow_back.svg"
            width={32}
            height={32}
            alt="back icon"
          />
        </Link>
        <span className="flex-1 text-secondary-600 text-[32px] font-semibold">
          {b("DetailSetting")}
        </span>
        {digitalItem && (
          <span className="text-xl text-secondary font-bold">
            {t("Status")}
          </span>
        )}
        {digitalItem && (
          <StatusDropdownSelect
            initialStatus={dataRef.current.status}
            handleSelectedItemChange={(changes) => {
              fieldChangeHandler("status", changes.selectedItem.value);
            }}
          />
        )}

        {loading ? (
          <div className="w-[182px] h-10 flex justify-center items-center">
            <span className="loading loading-spinner loading-md text-secondary-600" />
          </div>
        ) : (
          <Button
            className={clsx(
              "w-[182px] text-xl h-10 text-white rounded-[30px] font-medium",
              modified ? "bg-primary" : "bg-inactive",
            )}
            disabled={!modified}
            onClick={saveButtonHandler}
          >
            {b("Save")}
          </Button>
        )}
      </div>

      {digitalItem && (
        <div className="ml-24 mr-[104px] mt-16">
          <div className="flex gap-40">
            <div className="flex-grow flex flex-col gap-8">
              <div className="flex flex-col gap-4 pr-11">
                <h3 className="text-[20px] text-secondary font-bold">
                  {b("DetailSetting")}
                </h3>
                <div className="flex flex-col gap-6">
                  <StyledTextInput
                    className=""
                    label={b("ItemName")}
                    placeholder={b("ItemName")}
                    value={digitalItem.name}
                    changeHandler={(value) => fieldChangeHandler("name", value)}
                    maxLen={50}
                    readOnly={isReadOnly()}
                  />
                  <StyledTextArea
                    className=""
                    label={b("Description")}
                    placeholder={b("Description")}
                    value={digitalItem.description}
                    changeHandler={(value) =>
                      fieldChangeHandler("description", value)
                    }
                    maxLen={1300}
                    readOnly={isReadOnly()}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] text-secondary font-bold">
                  {b("PriceDetailsSettings")}
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <StyledTextInput
                    className=""
                    label={b("Price")}
                    placeholder={b("Price")}
                    value={`${digitalItem.price ? digitalItem.price : 0}`}
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("price", value)
                    }
                  />
                  <div className="flex">
                    <NextImage
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_price_info"
                      data-tooltip-id={`tooltip_price_info`}
                      data-tooltip-content={b("OnlyZero")}
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
                        zIndex: 1,
                      }}
                    />
                  </div>
                  <StyledTextInput
                    className=""
                    placeholder={b("QuantityLimit")}
                    value={`${
                      digitalItem.quantityLimit
                        ? digitalItem.quantityLimit != -1
                          ? digitalItem.quantityLimit
                          : ""
                        : ""
                    }`}
                    label={b("QuantityLimit")}
                    inputMask={TextKind.Digit}
                    changeHandler={(value) =>
                      fieldChangeHandler("quantityLimit", value)
                    }
                    readOnly={isReadOnly() || digitalItem.quantityLimit == -1}
                  />
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="quantityLimit"
                      className="w-6 h-6"
                      checked={digitalItem.quantityLimit == -1}
                      onChange={(e) => {
                        if (!isReadOnly()) {
                          if (e.target.checked) {
                            fieldChangeHandler("quantityLimit", -1);
                          } else {
                            fieldChangeHandler("quantityLimit", 0);
                          }
                        }
                      }}
                    />
                    <label
                      className="text-sm text-secondary font-normal"
                      htmlFor="quantityLimit"
                    >
                      {b("NoLimit")}
                    </label>
                    <NextImage
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_quantity_info"
                      data-tooltip-id={`tooltip_quantity_info`}
                      data-tooltip-content={b("CheckBoxMaxLimit")}
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
                        zIndex: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] text-secondary font-bold">
                  {b("Copyrights")}
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                    <CopyrightMultiSelect
                      initialSelectedItems={digitalItem.copyrights}
                      handleSelectedItemChange={(changes) => {
                        fieldChangeHandler("copyrights", changes);
                      }}
                      readOnly={isReadOnly()}
                    />
                    <NextImage
                      src="/admin/images/info-icon-2.svg"
                      width={16}
                      height={16}
                      alt="information"
                      id="image_copyright_info"
                      data-tooltip-id={`tooltip_copyright_info`}
                      data-tooltip-content={b("ExampleCopyright")}
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
                        zIndex: 1,
                      }}
                    />
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="md:flex flex-row justify-between">
                        <p className="md:w-auto w-[80%] sm:mr-8 text-[20px] font-bold">
                          {b("License")}
                        </p>
                      </div>
                      <div className="px-6 mt-2">
                        <div className="border rounded-lg p-6 border-primary text-primary">
                          <p className="text-[14px] font-bold">
                            {l("ProhibitedActions")}
                          </p>
                          <div className="text-[12px]">
                            {actions.map((action, index) => (
                              <p key={index}>&bull; {action}</p>
                            ))}
                          </div>
                        </div>
                        <div className="mt-8">
                          <RadioButtonGroup
                            title={l("CommercialUse")}
                            initialValue={digitalItem.license.com}
                            onChange={(value) =>
                              fieldChangeHandler("com", value)
                            }
                          />
                          <hr className="pb-3 border-primary" />
                          <RadioButtonGroup
                            title={l("Adaptation")}
                            initialValue={digitalItem.license.adp}
                            onChange={(value) =>
                              fieldChangeHandler("adp", value)
                            }
                          />
                          <hr className="pb-3 border-primary" />
                          <RadioButtonGroup
                            title={l("Derivative")}
                            initialValue={digitalItem.license.der}
                            onChange={(value) =>
                              fieldChangeHandler("der", value)
                            }
                          />
                          <hr className="pb-3 border-primary" />
                          <RadioButtonGroup
                            title={l("Merchandising")}
                            initialValue={digitalItem.license.mer}
                            onChange={(value) =>
                              fieldChangeHandler("mer", value)
                            }
                          />
                          <hr className="pb-3 border-primary" />

                          <RadioButtonGroup
                            title={l("Distribution")}
                            initialValue={digitalItem.license.dst}
                            onChange={(value) =>
                              fieldChangeHandler("dst", value)
                            }
                          />
                          <hr className="pb-3 border-primary" />
                          <RadioButtonGroup
                            title={l("CreditOmission")}
                            initialValue={digitalItem.license.ncr}
                            onChange={(value) =>
                              fieldChangeHandler("ncr", value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 pr-11">
                <h3 className="text-[20px] text-secondary font-bold">
                  {b("Schedule")}
                </h3>
                <ScheduleCalendar
                  originStatus={dataRef.current.status}
                  currentStatus={digitalItem.status}
                  schedules={digitalItem.schedules}
                  changeHandler={(v) => fieldChangeHandler("schedules", v)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-10">
              <div>
                <NextImage
                  width={384}
                  height={384}
                  className="bg-[#2D94FF6B] rounded-[13px]"
                  src={
                    digitalItem.isCustomThumbnailSelected
                      ? digitalItem.customThumbnailUrl
                      : digitalItem.defaultThumbnailUrl
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
                    borderColor: digitalItem.isCustomThumbnailSelected
                      ? "#B3B3B3"
                      : "#98C6F4",
                    backgroundImage: `url('${digitalItem.defaultThumbnailUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                  onClick={() => {
                    fieldChangeHandler("isCustomThumbnailSelected", false);
                  }}
                >
                  <a
                    href={digitalItem.defaultThumbnailUrl}
                    download
                    className="absolute right-3 bottom-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                    }}
                  >
                    <NextImage
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
                    borderColor: !digitalItem.isCustomThumbnailSelected
                      ? "#B3B3B3"
                      : "#98C6F4",
                    backgroundImage: `url('${digitalItem.customThumbnailUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                  onClick={() => {
                    if (
                      digitalItem.customThumbnailUrl &&
                      digitalItem.customThumbnailUrl.length > 0
                    ) {
                      fieldChangeHandler("isCustomThumbnailSelected", true);
                    }
                  }}
                >
                  {digitalItem.customThumbnailUrl &&
                  digitalItem.customThumbnailUrl.length > 0 ? (
                    <NextImage
                      width={24}
                      height={24}
                      alt="cancel"
                      src="/admin/images/icon/cancel-icon.svg"
                      className="absolute right-3 bottom-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        setData({
                          ...digitalItem,
                          ["isCustomThumbnailSelected"]: false,
                          ["customThumbnailUrl"]: "",
                        });
                      }}
                    />
                  ) : (
                    <NextImage
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
                    {b("DropImage")}
                  </span>
                  <NextImage
                    width={24}
                    height={24}
                    alt="upload"
                    src="/admin/images/icon/upload-icon.svg"
                  />
                </div>
              </div>
              <div className="text-center h-12">
                <Link
                  href={`/workspace/?id=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="w-full h-12 rounded-[30px] border-[3px] border-primary-500 
                      flex justify-center items-center gap-2"
                  >
                    <NextImage
                      src="/admin/images/icon/preview.svg"
                      width={32}
                      height={32}
                      alt="preview icon"
                    />
                    <span className="w-[260px] text-primary-500 text-xl font-medium text-center">
                      {b("PreviewWorkspace")}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="text-center h-12">
                <div className="hidden">
                  <NftModelGeneratorUnity
                    unityProvider={unityProvider}
                    isSceneOpen={isSceneOpen}
                  />
                </div>
                <Button
                  className={`w-full h-12 rounded-[30px] border-[3px] border-[#E96800]
                    flex justify-center items-center gap-2
                  `}
                  onClick={() => {
                    if (digitalItem.status == DigitalItemStatus.Draft) {
                      if (mintConfirmDialogRef1.current) {
                        mintConfirmDialogRef1.current.showModal();
                      }
                    } else {
                      if (mintConfirmDialogRef.current) {
                        mintConfirmDialogRef.current.showModal();
                      }
                    }
                  }}
                >
                  <NextImage
                    src="/admin/images/icon/mint_icon.svg"
                    width={16}
                    height={20}
                    alt="mint icon"
                  />
                  <span className="w-[260px] text-[#E96800] text-xl font-semibold text-center">
                    {b("MintNFT")}
                  </span>
                </Button>
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
      <MintConfirmDialog1
        dialogRef={mintConfirmDialogRef1}
        changeHandler={mintConfirmDialogHandler}
      />
    </div>
  );
};

export default Detail;
