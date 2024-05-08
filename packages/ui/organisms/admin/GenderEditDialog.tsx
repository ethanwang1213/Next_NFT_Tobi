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
  return (
    <div className="ml-12 py-2 flex items-center">
      <label
        className="w-48 text-sm text-base-black font-normal"
        htmlFor={`id-${name}-${value}`}
      >
        {value}
      </label>
      <input
        type="radio"
        id={`id-${name}-${value}`}
        className="tobiratory-radio-2"
        name={name}
        checked={initValue == value}
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
  const [gender, setGender] = useState("");

  useEffect(() => {
    setGender(initialValue);
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
          Your gender will not be displayed on public profile.
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
            value="Custome"
            initValue={gender}
            clickHandler={() => setGender("Custome")}
          />
          <GenderComponent
            name="gender"
            value="no answer"
            initValue={gender}
            clickHandler={() => setGender("no answer")}
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
              dialogRef.current.close();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary rounded-[64px] 
              hover:shadow-xl hover:-top-[3px] transition-shadow
              text-base-white text-sm leading-4 font-semibold"
            onClick={() => {
              changeHandler(gender);
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

export default GenderEditDialog;
