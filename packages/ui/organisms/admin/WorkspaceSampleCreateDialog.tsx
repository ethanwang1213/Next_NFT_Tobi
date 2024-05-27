import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import NextImage from "next/image";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  PixelCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "ui/atoms/Button";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      console.log("a file is selected:", URL.createObjectURL(file));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col">
      <div className="h-[400px] flex flex-col overflow-y-auto">
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
      <div
        {...getRootProps()}
        style={{
          width: 400,
          height: 80,
          marginTop: 12,
          borderRadius: 13,
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: "#B3B3B3",
          backgroundColor: isDragActive ? "#B3B3B3" : "transparent",
        }}
        className="flex justify-center items-center gap-3 cursor-pointer"
      >
        <span className="text-secondary-500 text-base font-medium">
          Upload 3D Digital Item model
        </span>
        <NextImage
          width={24}
          height={24}
          src="/admin/images/icon/upload-icon.svg"
          alt="upload icon"
        />
      </div>
    </div>
  );
};

const ButtonGroupComponent = (props: {
  backButtonHandler: () => void;
  nextButtonHandler: () => void;
}) => {
  return (
    <div className="flex justify-between">
      <Button
        className="w-[72px] h-8 rounded-lg border border-primary flex items-center justify-center gap-1"
        onClick={props.backButtonHandler}
      >
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/arrow-left-s-line.svg"
          alt="left arrow"
        />
        <span className="text-primary text-sm font-medium">Back</span>
      </Button>
      <Button
        className="w-[72px] h-8 rounded-lg bg-primary flex items-center justify-center gap-1"
        onClick={props.nextButtonHandler}
      >
        <span className="text-base-white text-sm font-medium">Next</span>
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/arrow-right-s-line.svg"
          alt="left arrow"
        />
      </Button>
    </div>
  );
};

type MaterialItem = {
  id: number;
  image: string;
};

const ImageSelectComponent = (props: {
  data: MaterialItem[];
  selectedImage: MaterialItem | null;
  selectImageHandler: (value: MaterialItem) => void;
  backHandler: () => void;
  nextHandler: () => void;
}) => {
  console.log("ImageSelectComponent is rendered");
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/png")) {
        props.selectImageHandler({ id: 0, image: URL.createObjectURL(file) });
        props.nextHandler();
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          // Remove EXIF data
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataUrlWithoutExif = canvas.toDataURL("image/jpeg"); // strip the EXIF data
            props.selectImageHandler({ id: 0, image: dataUrlWithoutExif });
            props.nextHandler();
          };
          img.src = imageDataUrl.toString();
        };
        reader.readAsDataURL(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col h-full gap-4">
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
        {props.data &&
          props.data.map((image) => (
            <NextImage
              key={`material-image-${image.id}`}
              width={88}
              height={88}
              style={{ maxWidth: 88, maxHeight: 88, objectFit: "contain" }}
              src={image.image}
              alt="material image"
              className={`rounded-lg ${
                props.selectedImage && props.selectedImage.id === image.id
                  ? "border-2 border-[#009FF5]"
                  : ""
              }`}
              onClick={() => {
                props.selectImageHandler(image);
              }}
            />
          ))}
      </div>
      <ButtonGroupComponent
        backButtonHandler={props.backHandler}
        nextButtonHandler={() => {
          if (props.selectedImage === null) {
            console.log("material image is not set");
          } else {
            props.nextHandler();
          }
        }}
      />
    </div>
  );
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropComponent = (props: {
  materialImage: MaterialItem;
  cropHandler: (image: string) => void;
  backHandler: () => void;
  nextHandler: () => void;
}) => {
  console.log("ImageCropComponent is rendered");
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCompletedCrop(convertToPixelCrop(crop, width, height));
  }

  async function onCropClick() {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    console.log(blobUrlRef.current);
    props.cropHandler(blobUrlRef.current);
  }

  function handleToggleAspectClick(value: number | undefined) {
    setAspect(value);
    if (value) {
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, value);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleStyle = {
    borderColor: "#1779DE",
    height: 8,
    width: 8,
    marginLeft: 0,
    marginTop: -3,
    backgroundColor: "#1779DE",
  };

  const trackStyle = {
    backgroundColor: "#1779DE",
    height: 2,
  };

  const railStyle = {
    backgroundColor: "#1779DE",
    height: 2,
  };

  return (
    <div className="h-full">
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspect}>
        <NextImage
          ref={imgRef}
          src={props.materialImage.image}
          alt="crop image"
          width={400}
          height={352}
          style={{
            maxWidth: 400,
            maxHeight: 352,
            transform: `rotate(${rotate}deg)`,
            objectFit: "contain",
          }}
          onLoad={onImageLoad}
        />
      </ReactCrop>
      <div className="mt-6 flex flex-col items-center">
        <div className="flex gap-4">
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop.svg"
            alt="crop"
            className={`cursor-pointer rounded hover:bg-neutral-200`}
            onClick={onCropClick}
          />
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop_16_9.svg"
            alt="crop 16:9"
            className={`cursor-pointer rounded hover:bg-neutral-200
            ${aspect === 9 / 16 ? "bg-neutral-200" : ""}`}
            onClick={() => {
              handleToggleAspectClick(9 / 16);
            }}
          />
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop_3_2.svg"
            alt="crop 3:2"
            className={`cursor-pointer rounded hover:bg-neutral-200
            ${
              Math.floor(aspect * 100) === Math.floor(200 / 3)
                ? "bg-neutral-200"
                : ""
            }`}
            onClick={() => {
              handleToggleAspectClick(2 / 3);
            }}
          />
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop_square.svg"
            alt="crop square"
            className={`cursor-pointer rounded hover:bg-neutral-200
            ${aspect === 1 ? "bg-neutral-200" : ""}`}
            onClick={() => {
              handleToggleAspectClick(1);
            }}
          />
          <NextImage
            width={24}
            height={24}
            src="/admin/images/icon/crop_free.svg"
            alt="crop free"
            className={`cursor-pointer rounded hover:bg-neutral-200
            ${aspect === undefined ? "bg-neutral-200" : ""}`}
            onClick={() => {
              handleToggleAspectClick(undefined);
            }}
          />
        </div>
        <div className="w-[220px] relative mt-[18px] mb-[6px]">
          <Slider
            min={-180}
            max={180}
            styles={{ handle: handleStyle, track: trackStyle, rail: railStyle }}
            value={rotate}
            onChange={(value: number) => setRotate(value)}
          />
          <span className="absolute left-0 -top-2 text-primary-400 text-[8px] font-medium">
            -180
          </span>
          <span className="absolute right-0 -top-2 text-primary-400 text-[8px] font-medium">
            180
          </span>
        </div>
        <NextImage
          width={16}
          height={16}
          src="/admin/images/icon/rotate_right.svg"
          alt="rotate right"
          className={`cursor-pointer rounded`}
        />
      </div>
      <ButtonGroupComponent
        backButtonHandler={props.backHandler}
        nextButtonHandler={props.nextHandler}
      />
    </div>
  );
};

const GenerateComponent = (props: {
  material: MaterialItem;
  sampleType: string;
}) => {
  console.log("GenerateComponent is rendered");
  const [completed, setCompleted] = useState(false);

  const materialAPIUrl = "native/materials";
  const { postData: saveMaterial } = useRestfulAPI(null);

  const uploadMaterialImage = useCallback(
    async (imageUrl: string) => {
      const uploadedImageUrl = await uploadImage(
        imageUrl,
        ImageType.MaterialImage,
      );
      const newMaterials = await saveMaterial(
        "native/materials",
        {
          image: uploadedImageUrl,
        },
        [],
      );
      console.log("newMaterials", newMaterials);
      if (newMaterials) {
        setCompleted(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    console.log(
      "Generate component use effect is called",
      props,
      props.material,
      props.sampleType,
    );
    if (props.sampleType === "Poster") {
      if (props.material.id === 0) {
        uploadMaterialImage(props.material.image);
      } else {
        setCompleted(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center">
      {completed ? (
        <NextImage
          width={80}
          height={80}
          src="/admin/images/icon/task-complete.svg"
          alt="task complete"
          className="mt-[128px]"
        />
      ) : (
        <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C] mt-[128px]"></span>
      )}
      <span className="text-primary text-sm font-semibold mt-6">
        {completed ? "Generated!" : "Generating..."}
      </span>
      {completed && (
        <span className="text-primary text-xs font-light mt-2">
          Please check your SAMPLE ITEM LIST
        </span>
      )}
      {completed && (
        <Button className="bg-primary rounded-lg text-base-white text-sm font-medium mt-10 px-2 py-[6px]">
          Done
        </Button>
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
  const [creationStep, setCreationStep] = useState(0);
  const [sampleType, setSampleType] = useState(null);
  const [materialImage, setMaterialImage] = useState(null);

  const materialAPIUrl = "native/materials";
  const { data: materials } = useRestfulAPI(materialAPIUrl);

  useEffect(() => {
    setCreationStep(0);
    setSampleType(null);
    setMaterialImage(null);
  }, [initDialog]);

  console.log("dialog is rendered", materialImage);

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
        <div className="w-[400px] h-[492px] flex flex-col gap-4">
          {creationStep === 0 && (
            <SampleTypeSelectComponent
              selectTypeHandler={(value) => {
                setSampleType(value);
                setCreationStep(1);
              }}
            />
          )}
          {creationStep === 1 && (
            <ImageSelectComponent
              data={materials}
              selectedImage={materialImage}
              selectImageHandler={(value) => setMaterialImage(value)}
              backHandler={() => setCreationStep(creationStep - 1)}
              nextHandler={() => setCreationStep(creationStep + 1)}
            />
          )}
          {creationStep === 2 && sampleType === "Poster" && (
            <ImageCropComponent
              materialImage={materialImage}
              cropHandler={(image: string) =>
                setMaterialImage({ id: 0, image: image })
              }
              backHandler={() => setCreationStep(creationStep - 1)}
              nextHandler={() => setCreationStep(creationStep + 1)}
            />
          )}
          {creationStep === 3 && sampleType === "Poster" && (
            <GenerateComponent
              material={materialImage}
              sampleType={sampleType}
            />
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(WorkspaceSampleCreateDialog);
