import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import StyledTextArea from "ui/molecules/StyledTextArea";
import RadioButtonGroup from "ui/organisms/admin/RadioButtonGroup";
import ContentNameConfirmDialog from "./ContentNameConfirmDialog";
import ContentNameEditDialog from "./ContentNameEditDialog";
import CopyrightEditMenu from "./CopyrightEditMenu";

const ContentNameEditComponent = ({ initialValue, changeHandler }) => {
  const [name, setName] = useState("");
  const editDialogRef = useRef(null);

  useEffect(() => setName(initialValue), [initialValue]);

  return (
    <div
      className="bg-secondary-300 rounded-lg border-2 border-secondary 
        flex items-center"
    >
      <span
        className="flex-1 h-12 border-r-2 border-secondary 
          px-6 text-secondary-700 text-sm leading-[48px] font-normal"
      >
        {name}
      </span>
      <Image
        src="/admin/images/icon/pencil.svg"
        width={32}
        height={32}
        alt="edit icon"
        className="mx-4 cursor-pointer"
        onClick={(e) => {
          editDialogRef.current.showModal();
        }}
      />
      <ContentNameEditDialog
        initialValue={name}
        dialogRef={editDialogRef}
        changeHandler={changeHandler}
      />
    </div>
  );
};

const CopyrightHolderComponent = ({ initialItems, changeHandler }) => {
  const apiUrl = "native/admin/copyrights";
  const [popupMenuOpen, setPopupMenuOpen] = useState(false);
  const [popupMenuPosition, setPopupMenuPosition] = useState({
    x: 0,
    y: 0,
    id: 0,
    text: "",
  });
  const [items, setItems] = useState(null);
  const { error, postData, deleteData } = useRestfulAPI(null);
  const t = useTranslations("ContentSettings");
  const rootElementRef = useRef(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const itemChangedHandler = async (type, id, prevValue, value) => {
    setPopupMenuOpen(false);

    let newElements = [...items];

    // get indexes
    const elementIndex = newElements.findIndex(
      (value) => value.name == prevValue,
    );

    if (type == "update") {
      let update = true;
      // call API
      if (id > 0) {
        update = await postData(`${apiUrl}/${id}`, { name: value });
        if (!update) toast(error);
      }
      // update UI
      if (update) {
        // change element name
        newElements[elementIndex].name = value;
        changeHandler(newElements);
      }
    }

    if (type == "delete") {
      let update = true;
      // call API
      if (id > 0) {
        update = await deleteData(`${apiUrl}/${id}`);
      }
      // update UI
      if (update) {
        // delete element
        newElements = newElements.filter(
          (value, index) => index != elementIndex,
        );
        changeHandler(newElements);
      }
    }
  };

  return (
    <div
      ref={rootElementRef}
      className="w-[432px] flex flex-col gap-2 relative"
    >
      <input
        type="text"
        className="w-full h-12 outline-none rounded-lg border-2 border-secondary
          px-4 text-secondary text-sm font-medium"
        placeholder={t("AddCopyrightHolder")}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // Handle the Enter key press event here
            const inputElement = event.target as HTMLInputElement;
            const value = inputElement.value;
            const copyright = items;
            copyright.push({ id: null, name: value });
            changeHandler(copyright);

            inputElement.value = "";
          }
        }}
      />
      {items &&
        items.map((copyright, index) => {
          return (
            <div
              key={`copyright-item-${index}-${copyright.id}`}
              className="flex justify-end items-center gap-1"
            >
              <span
                className="bg-[#009FF5] rounded px-2 min-w-[132px]
                text-base-white text-sm leading-6 font-medium"
              >
                ©{copyright.name}
              </span>
              <Image
                src="/admin/images/icon/more-vert-icon.png"
                width={16}
                height={16}
                alt="more icon"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  const rootDomRect = (
                    rootElementRef.current as HTMLElement
                  ).getBoundingClientRect();
                  const targetDomRect = (
                    e.target as HTMLElement
                  ).getBoundingClientRect();

                  setPopupMenuPosition({
                    x: targetDomRect.right - rootDomRect.left + 10,
                    y: targetDomRect.top - rootDomRect.top - 80,
                    id: copyright.id,
                    text: copyright.name,
                  });
                  setPopupMenuOpen(true);
                }}
              />
            </div>
          );
        })}
      {popupMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: popupMenuPosition.y,
            left: popupMenuPosition.x,
            zIndex: 1,
          }}
        >
          <CopyrightEditMenu
            id={popupMenuPosition.id}
            name={popupMenuPosition.text}
            nofityHandler={itemChangedHandler}
            closeHandler={() => setPopupMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

const ContentSettingPanel = ({
  cancelFlag,
  publishFlag,
  changeHandler,
}: {
  cancelFlag: number;
  publishFlag: number;
  changeHandler: () => void;
}) => {
  const apiUrl = "native/admin/content";
  const { data, dataRef, error, setData, putData, restoreData } =
    useRestfulAPI(apiUrl);
  const t = useTranslations("ContentSettings");
  const l = useTranslations("License");

  const modifiedRef = useRef(false);
  const confirmDialogRef = useRef(null);

  const fieldChangeHandler = (field, value) => {
    if (field == "name") {
      if (confirmDialogRef.current) {
        confirmDialogRef.current.showModal();
      }
    } else if (["com", "adp", "der", "mer", "dst", "ncr"].includes(field)) {
      setData({
        ...data,
        license: {
          ...data.license,
          [field]: value,
        },
      });
    } else {
      setData({ ...data, [field]: value });
    }
    modifiedRef.current = true;
    changeHandler();
  };

  const actions = [
    l("Actions.0"),
    l("Actions.1"),
    l("Actions.2"),
    l("Actions.3"),
    l("Actions.4"),
    l("Actions.5"),
  ];

  useEffect(() => {
    if (cancelFlag > 0 && modifiedRef.current) {
      // remove new copyright items
      dataRef.current.copyright = dataRef.current.copyright.filter(
        (item) => item.id !== null,
      );
      restoreData();
      modifiedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelFlag]);

  useEffect(() => {
    const submitHandler = async () => {
      const submitData = {
        name: data.name,
        description: data.description,
        license: {
          com: data.license.com,
          adp: data.license.adp,
          der: data.license.der,
          mer: data.license.mer,
          dst: data.license.dst,
          ncr: data.license.ncr,
        },
        copyrightHolders: data.copyright,
      };
      if (dataRef.current) {
        if (dataRef.current.name == submitData.name) delete submitData.name;
      }
      if (await putData(apiUrl, submitData, [])) {
        modifiedRef.current = false;
      } else {
        if (error) {
          if (error instanceof String) {
            toast(error);
          } else {
            toast(error.toString());
          }
        }
      }
    };

    if (publishFlag > 0 && modifiedRef.current) {
      submitHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishFlag]);

  return (
    data && (
      <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            {t("ContentName")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("ChangeContentNameGuidelines")}
          </span>
          <ContentNameEditComponent
            initialValue={data.name}
            changeHandler={(v) => fieldChangeHandler("name", v)}
          />
          <ContentNameConfirmDialog dialogRef={confirmDialogRef} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            {t("ContentDescription")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("EditDescription")}
          </span>
          <StyledTextArea
            className=""
            label="Description"
            placeholder="Description"
            value={data.description}
            changeHandler={(value) => fieldChangeHandler("description", value)}
            maxLen={1300}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="md:flex flex-row justify-between">
            <div className="flex flex-col md:text-nowrap">
              <p className="md:w-auto w-[80%] sm:mr-8 text-[24px] font-bold">
                {t("DefaultLicenseSetting")}
              </p>
              <span className="text-[12px] font-medium text-neutral-400 py-2">
                {t("SetDefaultLicense")}
              </span>
            </div>
          </div>
          <div className="px-6 mt-2">
            <div className="border rounded-lg p-6 border-primary text-primary">
              <p className="text-[14px] font-bold">{l("ProhibitedActions")}</p>
              <div className="text-[12px]">
                {actions.map((action, index) => (
                  <p key={index}>&bull; {action}</p>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <RadioButtonGroup
                title={l("CommercialUse")}
                initialValue={data.license.com}
                onChange={(value) => fieldChangeHandler("com", value)}
              />
              <hr className="pb-3 border-primary" />
              <RadioButtonGroup
                title={l("Adaptation")}
                initialValue={data.license.adp}
                onChange={(value) => fieldChangeHandler("adp", value)}
              />
              <hr className="pb-3 border-primary" />
              <RadioButtonGroup
                title={l("Derivative")}
                initialValue={data.license.der}
                onChange={(value) => fieldChangeHandler("der", value)}
              />
              <hr className="pb-3 border-primary" />
              <RadioButtonGroup
                title={l("Merchandising")}
                initialValue={data.license.mer}
                onChange={(value) => fieldChangeHandler("mer", value)}
              />
              <RadioButtonGroup
                title={l("Distribution")}
                initialValue={data.license.dst}
                onChange={(value) => fieldChangeHandler("dst", value)}
              />
              <hr className="pb-3 border-primary" />
              <RadioButtonGroup
                title={l("CreditOmission")}
                initialValue={data.license.ncr}
                onChange={(value) => fieldChangeHandler("ncr", value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">
            {t("CopyrightHolders")}
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            {t("SetDefaultCopyrightHolders")}
          </span>
          <CopyrightHolderComponent
            initialItems={data.copyright}
            changeHandler={(value) => fieldChangeHandler("copyright", value)}
          />
        </div>
      </div>
    )
  );
};

export { ContentSettingPanel };
