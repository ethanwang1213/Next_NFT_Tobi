import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import NextImage from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Button from "ui/atoms/Button";
import { MaterialItem } from "ui/types/DigitalItems";

const SampleGenerateComponent = (props: {
  material: MaterialItem;
  sampleType: string;
  closeHandler: () => void;
}) => {
  const [completed, setCompleted] = useState(false);

  const materialAPIUrl = "native/materials";
  const { postData: saveMaterial } = useRestfulAPI(null);

  const [sampleThumbnail, setSampleThumbnail] = useState(null);

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    async function createPosterSample() {
      if (props.material.id === 0) {
        await uploadMaterialImage(props.material.image);
      }

      // Call setCompleted after a delay
      const timer = setTimeout(() => {
        setSampleThumbnail("/admin/images/sample-thumnail/poster.png");
        setCompleted(true);
      }, 3000); // 3000 milliseconds = 3 seconds

      // Clean up the timeout if the component unmounts or props change
      return () => clearTimeout(timer);
    }

    async function createBadgeSample() {
      // Call setCompleted after a delay
      const timer = setTimeout(() => {
        setSampleThumbnail("/admin/images/sample-thumnail/badge.png");
        setCompleted(true);
      }, 3000); // 3000 milliseconds = 3 seconds

      // Clean up the timeout if the component unmounts or props change
      return () => clearTimeout(timer);
    }

    if (props.sampleType === "Poster") {
      createPosterSample();
    }
    if (props.sampleType === "Can Badge") {
      createBadgeSample();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className="flex flex-col items-center">
      {completed ? (
        <NextImage
          width={292}
          height={292}
          src={sampleThumbnail}
          alt="sample thumbnail"
          style={{ maxWidth: 292, maxHeight: 292, objectFit: "contain" }}
        />
      ) : (
        <></>
      )}
      {!completed ? (
        <div className="flex flex-col">
          <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C] mt-[128px]"></span>
          <span className="text-primary text-sm font-semibold mt-6">
            Generating
          </span>
        </div>
      ) : (
        <div className="flex justify-center gap-2 mt-6">
          <span className="text-primary text-sm font-semibold">Generated!</span>
          <NextImage
            width={16}
            height={16}
            src="/admin/images/icon/task-complete.svg"
            alt="task complete"
          />
        </div>
      )}
      {completed && (
        <span className="text-primary text-xs font-light mt-2">
          Please check your SAMPLE ITEM LIST
        </span>
      )}
      {completed && (
        <Button
          className="bg-primary rounded-lg text-base-white text-sm font-medium mt-10 px-2 py-[6px]"
          onClick={props.closeHandler}
        >
          Done
        </Button>
      )}
    </div>
  );
};

export default React.memo(SampleGenerateComponent);
