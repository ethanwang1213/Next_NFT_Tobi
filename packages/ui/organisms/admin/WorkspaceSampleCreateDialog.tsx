import NextImage from "next/image";
import React, { MutableRefObject, useEffect, useState } from "react";
import MaterialImageCropComponent from "ui/organisms/admin/MaterialImageCrop";
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

  useEffect(() => {
    setCreationStep(0);
    setSampleType(null);
    setMaterialImage(null);
  }, [props.initDialog]);

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
          {creationStep === 0 && (
            <SampleTypeSelectComponent
              selectTypeHandler={(value) => {
                setSampleType(value);
                setCreationStep(1);
              }}
            />
          )}
          {creationStep === 1 && (
            <MaterialImageSelectComponent
              data={props.materials}
              selectedImage={materialImage}
              selectImageHandler={(value) => setMaterialImage(value)}
              backHandler={() => setCreationStep(creationStep - 1)}
              nextHandler={() => setCreationStep(creationStep + 1)}
              uploadImageHandler={props.uploadImageHandler}
            />
          )}
          {creationStep === 2 && sampleType === "Poster" && (
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
