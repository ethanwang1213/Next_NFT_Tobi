import ja from "date-fns/locale/ja";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
              <div className="relative">
                <input
                  value={birthday ? birthday.toLocaleDateString("ja-JP") : ""}
                  readOnly
                  className="rounded-full w-full border border-neutral-200 py-3 pl-3 pr-10 outline-none text-black text-sm leading-4"
                  placeholder="YYYY/MM/DD"
                />
                {birthday && (
                  <button
                    type="button"
                    onClick={() => setBirthday(null)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label="Clear date"
                  >
                    <span
                      role="img"
                      aria-label="clear"
                      className="flex items-center justify-center w-5 h-5 bg-primary rounded-full text-base-white text-[10px] font-semibold"
                      style={{ lineHeight: "1" }}
                    >
                      <Image
                        src="/admin/images/icon/close2.svg"
                        width={16}
                        height={16}
                        className="invert text-white font-semibold"
                        alt="close icon"
                      />
                    </span>
                  </button>
                )}
              </div>
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
