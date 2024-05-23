import useRestfulAPI from "hooks/useRestfulAPI";
import NextImage from "next/image";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../../atoms/Button";

const roadmapTitles = {
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

const RoadMapComponent = (props: {
  sampleType: string | null;
  step: number;
}) => {
  console.log("RoadMapComponent", props.step);
  return (
    <div className="flex flex-col py-5 px-6">
      <NextImage
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
          {roadmapTitles[
            props.sampleType.toLocaleLowerCase().split(" ").join("")
          ].map((roadmap, index) => {
            return (
              <div key={`roadmap-${index}`} className="flex flex-col">
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
                  } ${roadmap.title}`}
                </span>
                {index <
                  roadmapTitles[
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
                    {roadmap.description}
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

const SampleTypeComponent = (props: {
  name: string;
  clickHandler: (value: string) => void;
}) => {
  return (
    <div
      className="h-[80px] px-4 py-3 rounded-2xl hover:bg-neutral-200 flex items-center gap-2 cursor-pointer"
      onClick={() => props.clickHandler(props.name)}
    >
      <NextImage
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

const SampleTypeSelectComponent = (props: {
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

const MaterialImageSelectComponent = (props) => {
  const apiUrl = "native/materials";
  const { data } = useRestfulAPI(apiUrl);

  const [selectedId, setSelectedId] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col h-full gap-[18px]">
      <div
        {...getRootProps()}
        style={{
          width: 400,
          height: 80,
          borderRadius: 13,
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: "#B3B3B3",
          backgroundColor: isDragActive ? "#B3B3B3" : "transparent",
        }}
        className="flex justify-center items-center gap-3 cursor-pointer"
      >
        <span className="text-secondary-500 text-base font-medium">
          Add New Material
        </span>
        <NextImage
          width={24}
          height={24}
          src="/admin/images/icon/upload-icon.svg"
          alt="upload icon"
        />
      </div>
      <div className="flex-1 flex flex-wrap gap-4 overflow-y-auto">
        {data &&
          data.map((image) => (
            <NextImage
              key={`material-image-${image.id}`}
              width={88}
              height={88}
              style={{ maxWidth: 88, maxHeight: 88 }}
              src={image.image}
              alt="material image"
              className={`${
                selectedId === image.id
                  ? "rounded-lg border-2 border-[#009FF5]"
                  : ""
              }`}
              onClick={() => setSelectedId(image.id)}
            />
          ))}
      </div>
      <div className="flex justify-between">
        <Button className="w-[72px] h-8 rounded-lg border border-primary flex items-center justify-center gap-1">
          <NextImage
            width={20}
            height={20}
            src="/admin/images/icon/arrow-left-s-line.svg"
            alt="left arrow"
          />
          <span className="text-primary text-sm font-medium">Back</span>
        </Button>
        <Button className="w-[72px] h-8 rounded-lg bg-primary flex items-center justify-center gap-1">
          <span className="text-base-white text-sm font-medium">Next</span>
          <NextImage
            width={20}
            height={20}
            src="/admin/images/icon/arrow-right-s-line.svg"
            alt="left arrow"
          />
        </Button>
      </div>
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
            <NextImage
              src="/admin/images/icon/close2.svg"
              width={16}
              height={16}
              alt="close icon"
            />
          </button>
        </form>
        <div className="w-[188px] rounded-2xl bg-primary ">
          <RoadMapComponent sampleType={sampleType} step={creationStep} />
        </div>
        <div className="w-[400px] h-[400px]">
          {creationStep === 0 ? (
            <SampleTypeSelectComponent
              selectTypeHandler={(value) => {
                setSampleType(value);
                setCreationStep(1);
              }}
            />
          ) : (
            <MaterialImageSelectComponent />
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WorkspaceSampleCreateDialog;
