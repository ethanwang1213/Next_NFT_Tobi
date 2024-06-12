import NextImage from "next/image";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import MaterialImageCropComponent from "ui/organisms/admin/MaterialImageCrop";
import MaterialImageRotateComponent from "ui/organisms/admin/MaterialImageRotate";
import MaterialImageSelectComponent from "ui/organisms/admin/MaterialImageSelect";
import RoadMapComponent from "ui/organisms/admin/SampleCreateRoadmap";
import SampleTypeSelectComponent from "ui/organisms/admin/SampleTypeSelect";
import { MaterialItem } from "ui/types/adminTypes";

type Props = {
  dialogRef: MutableRefObject<HTMLDialogElement>;
  initDialog: number;
  materials: MaterialItem[];
  uploadImageHandler: (image: string) => void;
  generateHandler: (
    materialId: number,
    cropImage: string,
    sampleType: number,
  ) => void;
  generateError: boolean;
};

const WorkspaceSampleCreateDialog: React.FC<Props> = (props) => {
  const [creationStep, setCreationStep] = useState(0);
  const [sampleType, setSampleType] = useState(null);
  const [materialImage, setMaterialImage] = useState(null);
  const [materialImage2, setMaterialImage2] = useState(null);

  useEffect(() => {
    setCreationStep(0);
    setSampleType(null);
    setMaterialImage(null);
    setMaterialImage2(null);
  }, [props.initDialog]);

  const placeComponent = useCallback(() => {
    if (sampleType === null || creationStep === 0) {
      return (
        <SampleTypeSelectComponent
          selectTypeHandler={(value) => {
            setSampleType(value);
            setCreationStep(1);
          }}
        />
      );
    }

    switch (sampleType) {
      case "Poster":
        switch (creationStep) {
          case 1:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage}
                selectImageHandler={(value) => setMaterialImage(value)}
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                uploadImageHandler={props.uploadImageHandler}
              />
            );

          case 2:
            return (
              <MaterialImageCropComponent
                materialImage={materialImage}
                cropHandler={(image: string) =>
                  setMaterialImage({ id: 0, image: image })
                }
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                generateHandler={props.generateHandler}
                generateError={props.generateError}
              />
            );

          default:
            break;
        }
        break;

      case "Acrylic Stand":
        switch (creationStep) {
          case 1:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage}
                selectImageHandler={(value) => setMaterialImage(value)}
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                uploadImageHandler={props.uploadImageHandler}
              />
            );

          case 2:
            return (
              <MaterialImageRotateComponent
                materialImage={materialImage}
                cropHandler={(image: string) =>
                  setMaterialImage({ id: 0, image: image })
                }
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                generateHandler={props.generateHandler}
                generateError={props.generateError}
              />
            );

          case 3:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage2}
                selectImageHandler={(value) => setMaterialImage2(value)}
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                uploadImageHandler={props.uploadImageHandler}
              />
            );

          case 4:
            return (
              <MaterialImageRotateComponent
                materialImage={materialImage2}
                cropHandler={(image: string) =>
                  setMaterialImage({ id: 0, image: image })
                }
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                generateHandler={props.generateHandler}
                generateError={props.generateError}
              />
            );

          case 5:
            return (
              <MaterialImageSelectComponent
                data={props.materials}
                selectedImage={materialImage}
                selectImageHandler={(value) => setMaterialImage(value)}
                backHandler={() => setCreationStep(creationStep - 1)}
                nextHandler={() => setCreationStep(creationStep + 1)}
                uploadImageHandler={props.uploadImageHandler}
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
    creationStep,
    materialImage,
    materialImage2,
    setSampleType,
    setCreationStep,
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
          <RoadMapComponent sampleType={sampleType} step={creationStep} />
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
