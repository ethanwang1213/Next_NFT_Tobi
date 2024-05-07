import ja from "date-fns/locale/ja";
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
  const [birthday, setBirthday] = useState(new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    // if (initialValue && initialValue.length > 0)
    //   setBirthday(new Date(initialValue));
  }, [initialValue]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[440px] rounded-3xl pt-4 flex flex-col gap-3 relative">
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
          Your birthday will not be displayed on public profile.
        </div>
        <div className="my-2 flex justify-between items-center gap-4">
          <span className="text-base-black text-sm font-semibold">
            Birthday
          </span>
          <span
            className="flex-1 rounded-[64px] border-[1px] border-neutral-200 py-2 pl-3 pr-12 outline-none
              text-base-black text-sm leading-4 font-normal"
            onClick={() => {
              if (datePickerRef.current && datePickerRef.current.input) {
                datePickerRef.current.input.click();
              }
            }}
          >
            {birthday.toLocaleString("ja-JP", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </span>
          <DatePicker
            ref={datePickerRef}
            selected={birthday}
            onChange={(date) => {
              setBirthday(date);
            }}
            dateFormat="yyyy/MM/dd"
            showPopperArrow={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="hidden"
            popperPlacement="auto"
            popperClassName=""
            locale="ja"
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
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler(
                birthday.toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }),
              );
              dialogRef.current.close();
            }}
          >
            Save changes
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
