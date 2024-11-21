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
import ImageCombineComponent from "./ImageCombineComponent";
import ImagePositionComponent from "./ImagePositionComponent";

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
  const [step, setStep] = useState<number>(0);
  const [sampleType, setSampleType] = useState<string>("");
  const [materialImage, setMaterialImage] = useState<MaterialItem | null>(null);
  const [materialImage2, setMaterialImage2] = useState<MaterialItem | null>(
    null,
  );

  const [error, setError] = useState<boolean>(false);

  const firstImageRef = useRef<string>("");
  const secondImageRef = useRef<string>("");
  const thirdImageRef = useRef<string>("");
  const uploadImageRef = useRef<string>("");

  useEffect(() => {
    setStep(0);
    setSampleType("");
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
      const result = await props.createMaterialImageHandler(
        uploadImageRef.current,
      );
      if (!result) setError(true);
      return result;
    },
    [props],
  );

  const checkAndUploadImage = useCallback(
    async (
      imageRef: MutableRefObject<string>,
      srcImage: string,
      imageType: ImageType,
      step: number,
    ) => {
      if (imageRef.current != srcImage) {
        const uploadUrl = await uploadImage(srcImage, imageType);
        if (uploadUrl == "") {
          setError(true);
          return false;
        }
        imageRef.current = uploadUrl;
      }
      if (step) setStep(step);
      return true;
    },
    [],
  );

  const removeImageBackground = useCallback(
    async (
      imageRef: MutableRefObject<string>,
      srcImage: string,
      step: number,
    ) => {
      const removeUrl = await props.removeBackgroundHandler(srcImage);
      if (removeUrl) {
        imageRef.current = removeUrl;
        setStep(step);
      } else setError(true);
    },
    [props],
  );

  const generateSample = useCallback(
    async (
      type: ModelType,
      image1: string,
      image2: string | null,
      opt: string | null,
    ) => {
      const generateResult = await props.generateHandler(
        type,
        image1,
        image2,
        opt,
      );
      if (!generateResult) setError(true);
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
            selectImageHandler={setMaterialImage}
            backHandler={() => setStep(0)}
            nextHandler={() => {
              firstImageRef.current = materialImage.image;
              setStep(2);
            }}
            uploadImageHandler={uploadMaterialImageHandler}
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
              if (
                await checkAndUploadImage(
                  firstImageRef,
                  image,
                  ImageType.MaterialImage,
                  0,
                )
              ) {
                generateSample(
                  ModelType.Poster,
                  firstImageRef.current,
                  materialImage.image,
                  null,
                );
              }
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
  }, [
    checkAndUploadImage,
    error,
    generateSample,
    materialImage,
    props,
    step,
    uploadMaterialImageHandler,
  ]);

  const generateAcrylicStandSample = useCallback(
    async (image: string, coords: string) => {
      const bodyImage = thirdImageRef.current;
      thirdImageRef.current = secondImageRef.current;
      if (
        await checkAndUploadImage(
          thirdImageRef,
          image,
          ImageType.ModelTempImage,
          0,
        )
      )
        generateSample(
          ModelType.AcrylicStand,
          bodyImage,
          thirdImageRef.current,
          coords,
        );
    },
    [checkAndUploadImage, generateSample],
  );

  const placeComponentForAcrylicStand = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={setMaterialImage}
            backHandler={() => setStep(0)}
            nextHandler={() =>
              removeImageBackground(firstImageRef, materialImage.image, 2)
            }
            uploadImageHandler={uploadMaterialImageHandler}
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
            nextHandler={(image: string) =>
              checkAndUploadImage(
                thirdImageRef,
                image,
                ImageType.MaterialImage,
                3,
              )
            }
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
            selectImageHandler={setMaterialImage2}
            backHandler={() => setStep(2)}
            nextHandler={() =>
              removeImageBackground(secondImageRef, materialImage2.image, 4)
            }
            uploadImageHandler={uploadMaterialImageHandler}
            skipHandler={() =>
              generateSample(
                ModelType.AcrylicStand,
                firstImageRef.current,
                null,
                null,
              )
            }
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
            nextHandler={generateAcrylicStandSample}
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
    checkAndUploadImage,
    error,
    generateAcrylicStandSample,
    generateSample,
    materialImage,
    materialImage2,
    props,
    removeImageBackground,
    step,
    uploadMaterialImageHandler,
  ]);

  const removeTextImageBackground = useCallback(
    async (image: string) => {
      if (
        await checkAndUploadImage(
          secondImageRef,
          image,
          ImageType.ModelTempImage,
          0,
        )
      )
        removeImageBackground(secondImageRef, secondImageRef.current, 5);
    },
    [checkAndUploadImage, removeImageBackground],
  );

  const generateMessageCardSample = useCallback(
    async (image: string) => {
      thirdImageRef.current = secondImageRef.current;
      if (
        await checkAndUploadImage(
          thirdImageRef,
          image,
          ImageType.ModelTempImage,
          0,
        )
      )
        generateSample(
          ModelType.MessageCard,
          thirdImageRef.current,
          null,
          null,
        );
    },
    [checkAndUploadImage, generateSample],
  );

  const placeComponentForMessageCard = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={setMaterialImage}
            backHandler={() => setStep(0)}
            nextHandler={() => {
              firstImageRef.current = materialImage.image;
              setStep(2);
            }}
            uploadImageHandler={uploadMaterialImageHandler}
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
            nextHandler={(image: string) =>
              checkAndUploadImage(
                firstImageRef,
                image,
                ImageType.ModelTempImage,
                3,
              )
            }
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
            selectImageHandler={setMaterialImage2}
            backHandler={() => setStep(2)}
            nextHandler={() => {
              secondImageRef.current = materialImage2.image;
              setStep(4);
            }}
            uploadImageHandler={uploadMaterialImageHandler}
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
            nextHandler={removeTextImageBackground}
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
            nextHandler={generateMessageCardSample}
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
    checkAndUploadImage,
    error,
    generateMessageCardSample,
    materialImage,
    materialImage2,
    props,
    removeTextImageBackground,
    step,
    uploadMaterialImageHandler,
  ]);

  const generateCanBadgeSample = useCallback(
    async (image: string, material: string) => {
      if (
        await checkAndUploadImage(
          firstImageRef,
          image,
          ImageType.MaterialImage,
          0,
        )
      )
        generateSample(
          ModelType.CanBadge,
          firstImageRef.current,
          material,
          null,
        );
    },
    [checkAndUploadImage, generateSample],
  );

  const placeComponentForCanBadge = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <MaterialImageSelectComponent
            data={props.materials}
            selectedImage={materialImage}
            selectImageHandler={setMaterialImage}
            backHandler={() => setStep(0)}
            nextHandler={() => {
              firstImageRef.current = materialImage.image;
              setStep(2);
            }}
            uploadImageHandler={uploadMaterialImageHandler}
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
            nextHandler={generateCanBadgeSample}
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
  }, [
    error,
    generateCanBadgeSample,
    materialImage,
    props,
    step,
    uploadMaterialImageHandler,
  ]);

  const placeComponent = useCallback(() => {
    if (!sampleType || !step) {
      return (
        <SampleTypeSelectComponent
          generateSampleHandler={generateSample}
          selectTypeHandler={(value) => {
            setSampleType(value);
            if (value != "Acrylic Keychain") setStep(1);
            else setStep(0);
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
    generateSample,
    sampleType,
    step,
    setSampleType,
    setStep,
  ]);

  return (
    <dialog ref={props.dialogRef} className="modal">
      <div className="modal-box max-w-[650px] max-h-[540px] rounded-3xl p-4 pt-8 flex gap-3 overflow-hidden">
        <form method="dialog">
          <button className="absolute w-4 h-4 top-4 right-4 outline-none">
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
