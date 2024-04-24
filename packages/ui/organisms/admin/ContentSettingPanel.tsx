import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import StyledTextArea from "../../molecules/StyledTextArea";
import ContentNameConfirmDialog from "./ContentNameConfirmDialog";
import ContentNameEditDialog from "./ContentNameEditDialog";

const ContentSettingPanel = () => {
  // content setting data
  const [contentSetting, setContentSetting] = useState({
    name: "",
    description: "",
    license: "",
    copyrights: ["ゴラクバ！"],
  });
  const [changed, setChanged] = useState(false);

  const editDialogRef = useRef(null);
  const confirmDialogRef = useRef(null);
  const copyrightEditMenuRef = useRef(null);

  // fetch content setting from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await fetchContentSettings();
        const data = {
          name: "SETTING NAME",
          description: "",
          license: "CCO",
          copyrights: ["ゴラクバ！"],
        };
        setContentSetting(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fieldChangeHandler = useDebouncedCallback((field, value) => {
    setContentSetting({ ...{ ...contentSetting, [field]: value } });
    if (field == "name") {
      if (confirmDialogRef.current) {
        confirmDialogRef.current.showModal();
      }
    }
    setChanged(true);
  }, 300);

  return (
    <div className="flow-root mx-[50px] my-[60px]">
      <div className="max-w-[800px] min-w-[480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-secondary text-2xl font-bold">Content Name</h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            You can change the name of the content. A review is required after
            the change, and if approved, the name will be updated. Once changed,
            the name cannot be modified again for 3 months.
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
          <h2 className="text-secondary text-2xl font-bold">
            Copyright Holders
          </h2>
          <span className="text-neutral-400 text-xs font-medium py-2">
            Set the default copyright holders for each DigitalItem record. You
            can enter this like tags, and no re-review is required for this
            change.
          </span>
          <div className="w-[432px] flex flex-col gap-2">
            <input
              type="text"
              className="w-full h-12 outline-none rounded-lg border-2 border-secondary
                px-4 text-secondary text-sm font-medium"
              placeholder="add a Copyright holder tag"
            />
            {contentSetting.copyrights.map((copyright, index) => {
              return (
                <div
                  key={`copyright-item-${index}`}
                  className="flex justify-end items-center gap-1"
                >
                  <span
                    className="bg-[#009FF5] rounded px-2 min-w-[132px]
                      text-base-white text-sm leading-6 font-medium"
                  >
                    ©{copyright}
                  </span>
                  <Image
                    src="/admin/images/icon/more-vert-icon.png"
                    width={16}
                    height={16}
                    alt="more icon"
                    className="cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentSettingPanel };
