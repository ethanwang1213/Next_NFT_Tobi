import Image from "next/image";
import { MutableRefObject } from "react";

const SampleTypeComponent = (props: { name: string }) => {
  return (
    <div className="w-[400px] h-[80px] px-4 py-3 rounded-2xl hover:bg-neutral-200 flex items-center gap-2 cursor-pointer">
      <Image
        width={56}
        height={56}
        src="/admin/images/png/empty-image.png"
        alt="sample type icon"
        className="rounded-lg"
      />
      <div className="flex flex-col gap-1">
        <span className="text-neutral-900 text-sm font-semibold leading-4">
          {props.name}
        </span>
        <span className="text-neutral-900 text-sm font-normal leading-4">
          Re-usable components built using Figr Design System
        </span>
      </div>
    </div>
  );
};

const WorkspaceSampleCreateDialog = ({
  dialogRef,
  changeHandler,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[650px] rounded-3xl p-4 pt-8 flex gap-3">
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
        <div className="w-[188px] rounded-2xl bg-primary flex flex-col py-5 px-6">
          <Image
            width={24}
            height={24}
            alt="logo icon"
            src="/admin/images/tobiratory-logo-white.svg"
          />
          <span className="text-base-white text-lg font-semibold mt-6 mb-2">
            SAMPLE ITEMs
          </span>
          <span className="text-base-white text-sm font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
        </div>
        <div className="flex flex-col">
          <SampleTypeComponent name="Acrylic Stand" />
          <SampleTypeComponent name="Poster" />
          <SampleTypeComponent name="Message Card" />
          <SampleTypeComponent name="Acrylic Keyholder" />
          <SampleTypeComponent name="Can Badge" />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WorkspaceSampleCreateDialog;
