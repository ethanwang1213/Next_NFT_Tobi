import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const GenderComponent = ({
  name,
  value,
  initValue,
  clickHandler,
}: {
  name: string;
  value: string;
  initValue: string;
  clickHandler: () => void;
}) => {
  const t = useTranslations("Account");
  return (
    <div className="ml-12 py-2 flex items-center">
      <label
        className="w-48 text-sm text-base-black font-normal"
        htmlFor={`id-${name}-${value}`}
      >
        {t(value)}
      </label>
      <input
        type="radio"
        id={`id-${name}-${value}`}
        className="tobiratory-radio-2"
        name={name}
        checked={initValue === value}
        onChange={(e) => {
          if (e.target.checked) clickHandler();
        }}
      />
    </div>
  );
};

const GenderEditDialog = ({
  initialValue,
  dialogRef,
  changeHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const [gender, setGender] = useState<string>("");
  const [customGender, setCustomGender] = useState<string>("");
  const t = useTranslations("Account");

  useEffect(() => {
    if (
      initialValue === "Male" ||
      initialValue === "Female" ||
      initialValue === "NoAnswer"
    ) {
      setGender(initialValue);
      setCustomGender("");
    } else {
      setGender("Custom");
      setCustomGender(initialValue);
    }
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[400px] rounded-3xl pt-4 flex flex-col gap-3 relative">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-4 right-4">
            <Image
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="text-base-black text-lg font-semibold">Edit Gender</div>
        <div className="text-neutral-700 text-sm font-normal mb-2">
          {t("HideGenderNote")}
        </div>
        <div className="flex flex-col gap-2">
          <GenderComponent
            name="gender"
            value="Male"
            initValue={gender}
            clickHandler={() => setGender("Male")}
          />
          <GenderComponent
            name="gender"
            value="Female"
            initValue={gender}
            clickHandler={() => setGender("Female")}
          />
          <GenderComponent
            name="gender"
            value="Custom"
            initValue={gender}
            clickHandler={() => setGender("Custom")}
          />
          {gender === "Custom" && (
            <div className="ml-12 py-2 flex items-center">
              <input
                type="text"
                name="gender"
                className="outline-none text-sm text-base-black w-48"
                onChange={(e) => setCustomGender(e.target.value)}
                value={customGender}
                placeholder={t("Custom")}
              />
            </div>
          )}
          <GenderComponent
            name="gender"
            value="NoAnswer"
            initValue={gender}
            clickHandler={() => setGender("NoAnswer")}
          />
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => {
              setGender(initialValue);
              setCustomGender("");
              dialogRef.current.close();
            }}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              const finalGender =
                gender === "Custom" && customGender ? customGender : gender;
              changeHandler(finalGender);
              dialogRef.current.close();
            }}
          >
            OK
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default GenderEditDialog;
