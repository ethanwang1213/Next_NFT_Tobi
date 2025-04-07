import { useShowcaseEditUnity } from "contexts/ShowcaseEditUnityContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const ShowcaseNameEditDialog = ({
  showcaseTitle,
  showcaseDescription,
  dialogRef,
  changeHandler,
}: {
  showcaseTitle: string;
  showcaseDescription: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (title: string, description: string) => void;
}) => {
  const [title, setTitle] = useState(showcaseTitle);
  const [description, setDescription] = useState(showcaseDescription);
  const { unityProvider, resumeUnityInputs } = useShowcaseEditUnity();
  const t = useTranslations("ContentShowcase");
  const l = useTranslations("GiftReceivingSettings");

  useEffect(() => {
    setTitle(showcaseTitle);
    setDescription(showcaseDescription);
  }, [showcaseTitle, showcaseDescription]);

  const contentInfoChangeHandler = (field: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field === "ShowcaseName" && e.target.value.length <= 40) {
      setTitle(e.target.value);
    }
    if (field === "ShowcaseDescription" && e.target.value.length <= 300) {
      setDescription(e.target.value);
    }
  };

  const isFormValid = title.trim() !== "" && description.trim() !== "";

  const handleCancel = () => {
    setTitle(showcaseTitle);
    setDescription(showcaseDescription);
    dialogRef.current.close();
    if (typeof resumeUnityInputs === "function") {
      resumeUnityInputs();
    }
  };

  const handleSave = () => {
    changeHandler(title, description);
    dialogRef.current.close();
    if (typeof resumeUnityInputs === "function") {
      resumeUnityInputs();
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[875px] rounded-3xl pt-7 flex flex-col gap-3 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-3 right-3">
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="flex justify-between items-center gap-4 mb-[20px]">
          <span className="text-base-black text-sm font-semibold w-[159px] text-right">
            {t("ShowcaseName")}
          </span>
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
                text-base-black text-sm leading-4 font-normal"
              value={title}
              onChange={(e) => contentInfoChangeHandler("ShowcaseName", e)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              {title.length}/40
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold w-[159px] text-right">
            {t("ShowcaseDescription")}
          </span>
          <div className="flex-1 relative">
            <textarea
              className="w-full rounded-[16px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
                text-base-black text-sm leading-4 font-normal resize-none h-[95px]"
              value={description}
              onChange={(e) => contentInfoChangeHandler("ShowcaseDescription", e)}
            />
            <span className="absolute right-4 top-4 -translate-y-1/2 pointer-events-none select-none text-[13px] hidden md:inline-block">
              {description.length}/300
            </span>
          </div>
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={handleCancel}
          >
            {l("Cancel")}
          </button>
          <button
            type="button"
            className={`px-4 py-2 bg-primary rounded-[64px] hover:shadow-xl hover:-top-[3px] transition-shadow text-base-white text-sm leading-4 font-semibold ${
              isFormValid ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={isFormValid ? handleSave : undefined}
            disabled={!isFormValid}
          >
            {l("SaveChanges")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ShowcaseNameEditDialog;
