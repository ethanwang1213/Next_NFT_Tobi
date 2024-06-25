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
import ImageZoomCropComponent from "ui/organisms/admin/ImageZoomCropComponent";
import MaterialImageSelectComponent from "ui/organisms/admin/MaterialImageSelectComponent";
import RoadMapComponent from "ui/organisms/admin/SampleCreateRoadmap";
import SampleTypeSelectComponent from "ui/organisms/admin/SampleTypeSelect";
import { MaterialItem } from "ui/types/adminTypes";
import ImagePositionComponent from "./ImagePositionComponent";
import ImageCombineComponent from "./ImageCombineComponent";

type Props = {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  initDialog: number;
  materials: MaterialItem[];
  createMaterialImageHandler: (image: string) => Promise<boolean>;
  removeBackgroundHandler: (image: string) => Promise<string>;
  generateHandler: (
    sampleType: ModelType,
    imageUrl1: string,
    imageUrl2?: string,
    option?: string,
  ) => Promise<boolean>;
  generateError: boolean;
  resetErrorHandler: () => void;
};

const WorkspaceSampleCreateDialog: React.FC<Props> = (props) => {
  const [step, setStep] = useState(0);
  const [sampleType, setSampleType] = useState(null);
  const [materialImage, setMaterialImage] = useState(null);
  const [materialImage2, setMaterialImage2] = useState(null);

  const [error, setError] = useState(false);

  const firstImageRef = useRef(null);
  const secondImageRef = useRef(null);
  const uploadImageRef = useRef(null);

  useEffect(() => {
    setStep(0);
    setSampleType(null);
    setMaterialImage(null);
    setMaterialImage2(null);
    setError(false);
  }, [props.initDialog]);

  const uploadMaterialImageHandler = useCallback(
    async (image: string): Promise<boolean> => {
      uploadImageRef.current = await uploadImage(
        image,
        ImageType.MaterialImage,
      );
      if (uploadImageRef.current == "") {
        return false;
      }
      return await props.createMaterialImageHandler(uploadImageRef.current);
    },
    [props],
  );

  const placeComponentForPosterType = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={(value) => setMaterialImage(value)}
            backHandler={() => setStep(0)}
            nextHandler={() => setStep(2)}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
          />
        );

      case 2:
        return (
          <ImageCropComponent
            imageUrl={materialImage.image}
            backHandler={() => setStep(1)}
            nextHandler={async (image: string) => {
              if (materialImage.image !== image) {
                const result = await uploadMaterialImageHandler(image);
                if (!result) {
                  setError(true);
                  return;
                }
                firstImageRef.current = uploadImageRef.current;
              } else {
                firstImageRef.current = materialImage.image;
              }
              const generateResult = await props.generateHandler(
                ModelType.Poster,
                firstImageRef.current,
                null,
                null,
              );
              if (!generateResult) setError(true);
            }}
            error={props.generateError || error}
            errorHandler={() => {
              setError(false);
              props.resetErrorHandler();
            }}
            isGenerate={true}
            isShowCropButtons={true}
          />
        );

      default:
        break;
    }
  }, [error, materialImage, props, step, uploadMaterialImageHandler]);

  const placeComponentForAcrylicStand = useCallback(() => {
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
              if (firstImageRef.current) setStep(2);
              else setError(true);
            }}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
          />
        );

      case 2:
        return (
          <ImageRotateComponent
            imageUrl={firstImageRef.current}
            backHandler={() => setStep(1)}
            nextHandler={async (image: string) => {
              // if no changes, skip upload
              if (firstImageRef.current != image) {
                const uploadUrl = await uploadImage(
                  image,
                  ImageType.ModelTempImage,
                );
                if (uploadUrl == "") {
                  setError(true);
                  return;
                }
                firstImageRef.current = uploadUrl;
              }
              setStep(3);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
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
              if (secondImageRef.current) setStep(4);
              else setError(true);
            }}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            skipHandler={async () => {
              const generateResult = await props.generateHandler(
                ModelType.AcrylicStand,
                firstImageRef.current,
                null,
                null,
              );
              if (!generateResult) setError(true);
            }}
            error={props.generateError || error}
            errorHandler={() => {
              setError(false);
              props.resetErrorHandler();
            }}
          />
        );

      case 4:
        return (
          <ImagePositionComponent
            imageUrl={secondImageRef.current}
            backHandler={() => setStep(3)}
            nextHandler={async (image: string, coords: string) => {
              if (secondImageRef.current != image) {
                const uploadUrl = await uploadImage(
                  image,
                  ImageType.ModelTempImage,
                );
                if (uploadUrl == "") {
                  setError(true);
                  return;
                }
                secondImageRef.current = uploadUrl;
              }

              const generateResult = await props.generateHandler(
                ModelType.AcrylicStand,
                firstImageRef.current,
                secondImageRef.current,
                coords,
              );
              if (!generateResult) setError(true);
            }}
            error={props.generateError || error}
            errorHandler={() => {
              setError(false);
              props.resetErrorHandler();
            }}
          />
        );

      default:
        break;
    }
  }, [
    props,
    step,
    materialImage,
    materialImage2,
    setStep,
    uploadMaterialImageHandler,
    error,
  ]);

  const placeComponentForMessageCard = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={(value) => setMaterialImage(value)}
            backHandler={() => setStep(0)}
            nextHandler={() => {
              firstImageRef.current = materialImage.image;
              setStep(2);
            }}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
          />
        );

      case 2:
        return (
          <ImageCropComponent
            imageUrl={materialImage.image}
            backHandler={() => setStep(1)}
            nextHandler={async (image: string) => {
              if (materialImage.image !== image) {
                const uploadUrl = await uploadImage(
                  image,
                  ImageType.ModelTempImage,
                );
                if (uploadUrl == "") {
                  setError(true);
                  return;
                }
                firstImageRef.current = uploadUrl;
              } else {
                firstImageRef.current = materialImage.image;
              }
              setStep(3);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
            isGenerate={false}
            isShowCropButtons={true}
          />
        );

      case 3:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage2}
            selectImageHandler={(value) => setMaterialImage2(value)}
            backHandler={() => setStep(2)}
            nextHandler={() => setStep(4)}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
          />
        );

      case 4:
        return (
          <ImageCropComponent
            imageUrl={materialImage2.image}
            backHandler={() => setStep(3)}
            nextHandler={async (image: string) => {
              if (materialImage2.image !== image) {
                const uploadUrl = await uploadImage(
                  image,
                  ImageType.ModelTempImage,
                );
                if (uploadUrl == "") {
                  setError(true);
                  return;
                }
                secondImageRef.current = uploadUrl;
              } else {
                secondImageRef.current = materialImage2.image;
              }
              const removeUrl = await props.removeBackgroundHandler(
                secondImageRef.current,
              );
              if (removeUrl == "") {
                setError(true);
                return;
              }
              secondImageRef.current = removeUrl;
              setStep(5);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
            isGenerate={false}
            isShowCropButtons={false}
          />
        );

      case 5:
        return (
          <ImageCombineComponent
            imageCardUrl={firstImageRef.current}
            imageMessageUrl={secondImageRef.current}
            backHandler={() => setStep(4)}
            nextHandler={async (image: string, coords: string) => {
              if (secondImageRef.current != image) {
                const uploadUrl = await uploadImage(
                  image,
                  ImageType.ModelTempImage,
                );
                if (uploadUrl == "") {
                  setError(true);
                  return;
                }
                secondImageRef.current = uploadUrl;
              }

              const generateResult = await props.generateHandler(
                ModelType.MessageCard,
                firstImageRef.current,
                secondImageRef.current,
                coords,
              );
              if (!generateResult) setError(true);
            }}
            error={props.generateError || error}
            errorHandler={() => {
              setError(false);
              props.resetErrorHandler();
            }}
          />
        );

      default:
        break;
    }
  }, [
    props,
    step,
    materialImage,
    materialImage2,
    setStep,
    uploadMaterialImageHandler,
    error,
  ]);

  const placeComponentForCanBadge = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={(value) => setMaterialImage(value)}
            backHandler={() => setStep(0)}
            nextHandler={() => setStep(2)}
            uploadImageHandler={async (image: string) => {
              const result = await uploadMaterialImageHandler(image);
              if (!result) setError(true);
            }}
            error={error}
            errorHandler={() => {
              setError(false);
            }}
          />
        );

      case 2:
        return (
          <ImageZoomCropComponent
            imageUrl={materialImage.image}
            backHandler={() => setStep(1)}
            nextHandler={async (image: string) => {
              if (materialImage.image !== image) {
                const result = await uploadMaterialImageHandler(image);
                if (!result) {
                  setError(true);
                  return;
                }
                firstImageRef.current = uploadImageRef.current;
              } else {
                firstImageRef.current = materialImage.image;
              }
              const generateResult = await props.generateHandler(
                ModelType.CanBadge,
                firstImageRef.current,
                null,
                null,
              );
              if (!generateResult) setError(true);
            }}
            error={props.generateError || error}
            errorHandler={() => {
              setError(false);
              props.resetErrorHandler();
            }}
            isGenerate={true}
          />
        );

      default:
        break;
    }
  }, [props, step, materialImage, setStep, uploadMaterialImageHandler, error]);

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
        return placeComponentForPosterType();

      case "Acrylic Stand":
        return placeComponentForAcrylicStand();

      case "Can Badge":
        return placeComponentForCanBadge();

      case "Message Card":
        return placeComponentForMessageCard();

      default:
        break;
    }
  }, [
    placeComponentForPosterType,
    placeComponentForAcrylicStand,
    placeComponentForCanBadge,
    placeComponentForMessageCard,
    sampleType,
    step,
    setSampleType,
    setStep,
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
