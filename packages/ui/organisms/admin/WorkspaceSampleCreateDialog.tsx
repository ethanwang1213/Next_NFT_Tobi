import { ImageType, uploadImage } from "fetchers/UploadActions";
import NextImage from "next/image";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModelType } from "types/unityTypes";
import ImageCropComponent from "ui/organisms/admin/ImageCropComponent";
import ImageRotateComponent from "ui/organisms/admin/ImageRotateComponent";
import MaterialImageSelectComponent from "ui/organisms/admin/MaterialImageSelectComponent";
import RoadMapComponent from "ui/organisms/admin/SampleCreateRoadmap";
import SampleTypeSelectComponent from "ui/organisms/admin/SampleTypeSelect";
import { MaterialItem } from "ui/types/adminTypes";
import ImagePositionComponent from "./ImagePositionComponent";

type Props = {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  initDialog: number;
  materials: MaterialItem[];
  createMaterialImageHandler: (image: string) => void;
  removeBackgroundHandler: (image: string) => Promise<string>;
  generateHandler: (
    sampleType: ModelType,
    imageUrl1: string,
    imageUrl2: string,
    option: any,
  ) => void;
  generateError: boolean;
};

const WorkspaceSampleCreateDialog: React.FC<Props> = (props) => {
  const [step, setStep] = useState(0);
  const [sampleType, setSampleType] = useState(null);
  const [materialImage, setMaterialImage] = useState(null);
  const [materialImage2, setMaterialImage2] = useState(null);

  const firstImageRef = useRef(null);
  const secondImageRef = useRef(null);
  const uploadImageRef = useRef(null);

  useEffect(() => {
    setStep(0);
    setSampleType(null);
    setMaterialImage(null);
    setMaterialImage2(null);
  }, [props.initDialog]);

  const uploadMaterialImageHandler = useCallback(
    async (image: string) => {
      console.log("CreateDialog::uploadMaterialImageHandler is called", image);
      uploadImageRef.current = await uploadImage(
        image,
        ImageType.MaterialImage,
      );
      await props.createMaterialImageHandler(uploadImageRef.current);
    },
    [props],
  );

  const placeComponent = useCallback(() => {
    if (sampleType === null || step === 0) {
      return (
        <SampleTypeSelectComponent
          selectTypeHandler={(value) => {
            setSampleType(value);
            setStep(1);
          }}
        />
      );
    }

    switch (sampleType) {
      case "Poster":
        switch (step) {
          case 1:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage}
                selectImageHandler={(value) => setMaterialImage(value)}
                backHandler={() => setStep(0)}
                nextHandler={() => setStep(2)}
                uploadImageHandler={uploadMaterialImageHandler}
              />
            );

          case 2:
            return (
              <ImageCropComponent
                materialImage={materialImage}
                cropHandler={(image: string) =>
                  setMaterialImage({ id: 0, image: image })
                }
                backHandler={() => setStep(1)}
                generateHandler={async (image: string) => {
                  if (materialImage.image !== image) {
                    await uploadMaterialImageHandler(image);
                    firstImageRef.current = uploadImageRef.current;
                  } else {
                    firstImageRef.current = materialImage.image;
                  }
                  props.generateHandler(
                    ModelType.Poster,
                    firstImageRef.current,
                    null,
                    null,
                  );
                }}
                generateError={props.generateError}
              />
            );

          default:
            break;
        }
        break;

      case "Acrylic Stand":
        switch (step) {
          case 1:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage}
                selectImageHandler={(value) => setMaterialImage(value)}
                backHandler={() => setStep(0)}
                nextHandler={async () => {
                  firstImageRef.current = await props.removeBackgroundHandler(
                    materialImage.image,
                  );
                  setStep(2);
                }}
                uploadImageHandler={uploadMaterialImageHandler}
              />
            );

          case 2:
            return (
              <ImageRotateComponent
                imageUrl={firstImageRef.current}
                uploadImageHandler={async (image: string) => {
                  if (firstImageRef.current != image) {
                    // skip upload
                    firstImageRef.current = await uploadImage(
                      image,
                      ImageType.ModelTempImage,
                    );
                  }
                }}
                backHandler={() => setStep(1)}
                nextHandler={() => setStep(3)}
                errorHandler={() => setStep(1)}
                error={props.generateError}
              />
            );

          case 3:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage2}
                selectImageHandler={(value) => setMaterialImage2(value)}
                backHandler={() => setStep(2)}
                nextHandler={async () => {
                  secondImageRef.current = await props.removeBackgroundHandler(
                    materialImage2.image,
                  );
                  setStep(4);
                }}
                uploadImageHandler={uploadMaterialImageHandler}
                skipHandler={() => {}}
              />
            );

          case 4:
            return (
              <ImageRotateComponent
                imageUrl={secondImageRef.current}
                uploadImageHandler={async (image: string) => {
                  if (secondImageRef.current != image) {
                    // skip upload
                    secondImageRef.current = await uploadImage(
                      image,
                      ImageType.ModelTempImage,
                    );
                  }
                }}
                showDirection={true}
                backHandler={() => setStep(3)}
                nextHandler={() => setStep(5)}
                errorHandler={() => setStep(3)}
                error={props.generateError}
              />
            );

          case 5:
            return (
              <ImagePositionComponent
                imageUrl={secondImageRef.current}
                showDirection={true}
                backHandler={() => setStep(4)}
                generateHandler={(x: number, y: number) =>
                  props.generateHandler(
                    ModelType.AcrylicStand,
                    firstImageRef.current,
                    secondImageRef.current,
                    { x, y },
                  )
                }
                errorHandler={() => setStep(3)}
                error={props.generateError}
              />
            );

          default:
            break;
        }
        break;

      default:
        break;
    }
  }, [
    props,
    sampleType,
    step,
    materialImage,
    materialImage2,
    setSampleType,
    setStep,
    uploadMaterialImageHandler,
  ]);

  return (
    <dialog ref={props.dialogRef} className="modal">
      <div className="modal-box max-w-[650px] max-h-[540px] rounded-3xl p-4 pt-8 flex gap-3">
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
          <RoadMapComponent sampleType={sampleType} step={step} />
        </div>
        <div className="w-[400px] h-[492px] flex flex-col gap-4">
          {placeComponent()}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default React.memo(WorkspaceSampleCreateDialog);
