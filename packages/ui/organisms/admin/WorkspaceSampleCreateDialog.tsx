import Image from "next/image";
import { MutableRefObject, useEffect, useState } from "react";

const SampleTypeComponent = (props: {
  name: string;
  clickHandler: (value: string) => void;
}) => {
  return (
    <div
      className="h-[80px] px-4 py-3 rounded-2xl hover:bg-neutral-200 flex items-center gap-2 cursor-pointer"
      onClick={() => props.clickHandler(props.name)}
    >
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

const SampleTypeListComponent = (props: {
  selectTypeHandler: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <SampleTypeComponent
        name="Acrylic Stand"
        clickHandler={props.selectTypeHandler}
      />
      <SampleTypeComponent
        name="Poster"
        clickHandler={props.selectTypeHandler}
      />
      <SampleTypeComponent
        name="Message Card"
        clickHandler={props.selectTypeHandler}
      />
      <SampleTypeComponent
        name="Acrylic Keyholder"
        clickHandler={props.selectTypeHandler}
      />
      <SampleTypeComponent
        name="Can Badge"
        clickHandler={props.selectTypeHandler}
      />
    </div>
  );
};

const loadmapTitles = {
  acrylicstand: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    {
      title: "Crop",
      description: "ポスターにしたい範囲で切り抜きしてください",
    },
    { title: "Generate", description: "" },
  ],
  poster: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    {
      title: "Crop",
      description: "ポスターにしたい範囲で切り抜きしてください",
    },
    { title: "Generate", description: "" },
  ],
  messagecard: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    {
      title: "Crop",
      description: "ポスターにしたい範囲で切り抜きしてください",
    },
    { title: "Generate", description: "" },
  ],
  acrylickeyholder: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    { title: "Create the body", description: "" },
    { title: "Attach the chain", description: "" },
    { title: "Generate", description: "" },
  ],
  canbadge: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    {
      title: "Crop",
      description: "ポスターにしたい範囲で切り抜きしてください",
    },
    { title: "Generate", description: "" },
  ],
};

const LoadMapComponent = (props: {
  sampleType: string | null;
  step: number;
}) => {
  console.log("LoadMapComponent", props.step);
  return (
    <div className="flex flex-col py-5 px-6">
      <Image
        width={24}
        height={24}
        alt="logo icon"
        src="/admin/images/tobiratory-logo-white.svg"
      />
      <span className="text-base-white text-lg font-semibold mt-6">
        {props.step === 0 ? "Sample Item Generator" : "ITEM CREATE"}
      </span>
      {props.step > 0 && (
        <span className="text-base-white text-sm font-light">
          {`- ${props.sampleType}`}
        </span>
      )}
      {props.step === 0 ? (
        <span className="text-base-white text-sm font-normal mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </span>
      ) : (
        <div className="mt-5 flex flex-col">
          {loadmapTitles[
            props.sampleType.toLocaleLowerCase().split(" ").join("")
          ].map((loadmap, index) => {
            return (
              <div key={`loadmap-${index}`} className="flex flex-col">
                <span
                  className={`text-base-white text-sm font-normal
                    ${
                      props.step === index + 1
                        ? "text-base-white"
                        : "text-base-white/25"
                    } `}
                >
                  {`${
                    index === 0
                      ? "①"
                      : index === 1
                        ? "②"
                        : index === 2
                          ? "③"
                          : "④"
                  } ${loadmap.title}`}
                </span>
                {index <
                  loadmapTitles[
                    props.sampleType.toLocaleLowerCase().split(" ").join("")
                  ].length -
                    1 && (
                  <span
                    className={`text-[8px] font-normal h-8 border-l-2 ml-[6px] pl-3
                    ${
                      props.step === index + 1
                        ? "text-base-white border-base-white"
                        : "text-base-white/25 border-base-white/25"
                    } `}
                  >
                    {loadmap.description}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const WorkspaceSampleCreateDialog = ({
  dialogRef,
  changeHandler,
  initDialog,
}: {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  changeHandler: (value: string) => void;
  initDialog: number;
}) => {
  const [sampleType, setSampleType] = useState(null);
  const [creationStep, setCreationStep] = useState(0);

  useEffect(() => {
    setSampleType(null);
    setCreationStep(0);
  }, [initDialog]);

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
        <div className="w-[188px] rounded-2xl bg-primary ">
          <LoadMapComponent sampleType={sampleType} step={creationStep} />
        </div>
        <div className="w-[400px] h-[400px]">
          <SampleTypeListComponent
            selectTypeHandler={(value) => {
              setSampleType(value);
              setCreationStep(1);
            }}
          />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WorkspaceSampleCreateDialog;
