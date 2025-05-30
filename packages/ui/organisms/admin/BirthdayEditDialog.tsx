import ja from "date-fns/locale/ja";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "./CustomInput";

registerLocale("ja", ja);

const BirthdayEditDialog = ({
  initialValue,
  dialogRef,
  changeHandler,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  const [birthday, setBirthday] = useState<Date | null>(new Date());
  const datePickerRef = useRef(null);
  const t = useTranslations("Account");

  useEffect(() => {
    if (initialValue && initialValue.length > 0)
      setBirthday(new Date(initialValue));
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[440px] rounded-3xl pt-4 flex flex-col gap-3 relative overflow-visible">
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
        <div className="text-base-black text-lg font-semibold">
          Edit Birthday
        </div>
        <div className="text-neutral-700 text-sm font-normal mb-2">
          {t("HideBirthdayNote")}
        </div>
        <div className="my-12 flex items-center gap-4">
          <span className="text-base-black text-sm font-semibold">
            {t("Birthday")}
          </span>
          <DatePicker
            ref={datePickerRef}
            selected={birthday}
            onChange={(date: Date) => setBirthday(date)}
            dateFormat="yyyy/MM/dd"
            showPopperArrow={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            locale="ja"
            customInput={
              <CustomInput
                birthday={birthday}
                setBirthday={setBirthday}
                onClick={() => datePickerRef.current?.setOpen(true)}
              />
            }
            popperPlacement="top-start"
            popperClassName="custom-datepicker-popper"
          />
        </div>
        <div className="modal-action flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-[64px] border-2 border-primary
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-primary text-sm leading-4 font-semibold"
            onClick={() => dialogRef.current.close()}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              if (birthday) {
                changeHandler(
                  birthday.toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  }),
                );
              } else {
                changeHandler(null);
              }
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

export default BirthdayEditDialog;
