import {
  fetchContentsInformation,
  updateContentsInformation,
} from "fetchers/ContentsActions";
import { deleteCopyright, updateCopyright } from "fetchers/SampleActions";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import StyledTextArea from "../../molecules/StyledTextArea";
import ContentNameConfirmDialog from "./ContentNameConfirmDialog";
import ContentNameEditDialog from "./ContentNameEditDialog";
import CopyrightEditMenu from "./CopyrightEditMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContentSettingPanel = ({
  cancelFlag,
  publishFlag,
  changeHandler,
}: {
  cancelFlag: number;
  publishFlag: number;
  changeHandler: () => void;
}) => {
  // content setting data
  const [contentSetting, setContentSetting] = useState({
    name: "",
    description: "",
    license: "",
    copyright: [],
  });
  const [popupMenuOpen, setPopupMenuOpen] = useState(false);
  const [popupMenuPosition, setPopupMenuPosition] = useState({
    x: 0,
    y: 0,
    id: 0,
    text: "",
  });

  const contentSettingRef = useRef(contentSetting);
  const modifiedRef = useRef(false);

  const editDialogRef = useRef(null);
  const confirmDialogRef = useRef(null);
  const popupMenuRef = useRef(null);
  const rootElementRef = useRef(null);

  // fetch content setting from server
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupMenuRef.current &&
        !popupMenuRef.current.contains(event.target)
      ) {
        setPopupMenuOpen(false);
      }
    }

    const fetchData = async () => {
      try {
        const data = await fetchContentsInformation();
        if (data != null) {
          contentSettingRef.current = data;
          setContentSetting(data);
        } else {
          toastErrorMessage(
            "Failed to load content information. Please check the error.",
          );
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        toastErrorMessage(error.toString());
      }
    };

    fetchData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fieldChangeHandler = useDebouncedCallback((field, value) => {
    setContentSetting({ ...{ ...contentSetting, [field]: value } });
    if (field == "name") {
      if (confirmDialogRef.current) {
        confirmDialogRef.current.showModal();
      }
    }
    modifiedRef.current = true;
    changeHandler();
  }, 300);

  const itemChangedHandler = async (type, id, prevValue, value) => {
    let newElements = [...contentSetting.copyright];

    // get indexes
    const elementIndex = newElements.findIndex(
      (value) => value.name == prevValue,
    );

    if (type == "update") {
      let update = true;
      // call API
      if (id > 0) {
        update = await updateCopyright(id, value);
      }
      // update UI
      if (update) {
        // change element name
        newElements[elementIndex].name = value;
        fieldChangeHandler("copyright", newElements);
      }
    }

    if (type == "delete") {
      let update = true;
      // call API
      if (id > 0) {
        update = await deleteCopyright(id);
      }
      // update UI
      if (update) {
        // delete element
        newElements = newElements.filter(
          (value, index) => index != elementIndex,
        );
        fieldChangeHandler("copyright", newElements);
      }
    }

    setPopupMenuOpen(false);
  };

  const updateData = async () => {
    const postData = {
      name: contentSetting.name,
      description: contentSetting.description,
      license: contentSetting.license,
      copyrightHolders: contentSetting.copyright,
    };
    if (postData.name == contentSettingRef.current.name) delete postData.name;

    const result = await updateContentsInformation(postData);
    if (result != null) {
      contentSettingRef.current = contentSetting;
    } else {
      toastErrorMessage("Failed to update the content information. Please check error.");
    }
  };

  useEffect(() => {
    if (cancelFlag > 0 && modifiedRef.current) {
      setContentSetting(contentSettingRef.current);
      modifiedRef.current = false;
    }
  }, [cancelFlag]);

  useEffect(() => {
    if (publishFlag > 0 && modifiedRef.current) {
      updateData();
      modifiedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishFlag]);

  const toastErrorMessage = (value: string) => {
    toast(value, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">Content Name</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          You can change the name of the content. A review is required after the
          change, and if approved, the name will be updated. Once changed, the
          name cannot be modified again for 3 months.
        </span>
        <div
          className="bg-secondary-300 rounded-lg border-2 border-secondary 
              flex items-center"
        >
          <span
            className="flex-1 h-12 border-r-2 border-secondary 
                px-6 text-secondary-700 text-sm leading-[48px] font-normal"
          >
            {contentSetting.name}
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
            initialValue={contentSetting.name}
            dialogRef={editDialogRef}
            changeHandler={(v) => fieldChangeHandler("name", v)}
          />
          <ContentNameConfirmDialog dialogRef={confirmDialogRef} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">
          Content Description
        </h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          You can freely edit the description of the content.
        </span>
        <StyledTextArea
          className=""
          label="Description"
          placeholder="Description"
          value={contentSetting.description}
          changeHandler={(value) => fieldChangeHandler("description", value)}
          maxLen={1300}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">License</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          Set the default license for each DigitalItem record.
        </span>
        <StyledTextArea
          className=""
          label="License"
          placeholder="License"
          value={contentSetting.license}
          changeHandler={(value) => fieldChangeHandler("license", value)}
          maxLen={1300}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-secondary text-2xl font-bold">Copyright Holders</h2>
        <span className="text-neutral-400 text-xs font-medium py-2">
          Set the default copyright holders for each DigitalItem record. You can
          enter this like tags, and no re-review is required for this change.
        </span>
        <div
          ref={rootElementRef}
          className="w-[432px] flex flex-col gap-2 relative"
        >
          <input
            type="text"
            className="w-full h-12 outline-none rounded-lg border-2 border-secondary
                px-4 text-secondary text-sm font-medium"
            placeholder="add a Copyright holder tag"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                // Handle the Enter key press event here
                const inputElement = event.target as HTMLInputElement;
                const value = inputElement.value;
                const copyright = contentSetting.copyright;
                copyright.push({ id: null, name: value });
                fieldChangeHandler("copyright", copyright);

                inputElement.value = "";
              }
            }}
          />
          {contentSetting.copyright.map((copyright, index) => {
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
                      x: targetDomRect.right - rootDomRect.left,
                      y: targetDomRect.top - rootDomRect.top,
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
                menuRef={popupMenuRef}
                id={popupMenuPosition.id}
                name={popupMenuPosition.text}
                nofityHandler={itemChangedHandler}
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export { ContentSettingPanel };
