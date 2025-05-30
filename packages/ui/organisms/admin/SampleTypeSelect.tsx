import { ImageType, uploadFiles } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ModelType } from "types/unityTypes";
import GenerateErrorComponent from "./GenerateErrorComponent";
import UploadButton from "./UploadButton";

const SampleTypeComponent = (props: {
  name: string;
  description: string;
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
        <span className="text-neutral-900 text-[12px] font-normal leading-4">
          {props.description}
        </span>
      </div>
    </div>
  );
};

const SampleTypeSelectComponent = (props: {
  selectTypeHandler: (value: string) => void;
  generateSampleHandler: (
    sampleType: ModelType,
    imageUrl1: string,
    imageUrl2?: string,
    option?: string,
  ) => Promise<void>;
}) => {
  const postApiUrl = "native/zip-model";
  const { postData } = useRestfulAPI(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const uploadFileRef = useRef<string>("");
  const { generateSampleHandler } = props;
  const t = useTranslations("Workspace");

  const uploadImageHandler = useCallback(
    async (
      image: string,
      name: string,
      extension: string,
    ): Promise<boolean> => {
      uploadFileRef.current = await uploadFiles(
        image,
        extension,
        ImageType._3DModel,
      );
      if (uploadFileRef.current === "") {
        return false;
      }
      const uploadFile = uploadFileRef.current;
      if (extension === "zip") {
        const result = await postData(postApiUrl, { fileUrl: uploadFile });
        if (!result) {
          setError(true);
        } else {
          await generateSampleHandler(ModelType.UserUploadedModel, result);
        }
      } else {
        await generateSampleHandler(ModelType.UserUploadedModel, uploadFile);
      }
      return true;
    },
    [postData, generateSampleHandler],
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const fileName = file.name.split(".")[0];
        const fileExtension = file.name.split(".")[1];
        if (file && (fileExtension === "glb" || fileExtension === "zip")) {
          setUploading(true);
          const fileUrl = URL.createObjectURL(file);
          await uploadImageHandler(fileUrl, fileName, fileExtension);
          setTimeout(() => setUploading(false), 15000);
        }
      }
    },
    [uploadImageHandler],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const handleButtonClick = () => {
    setUploading(false);
    setError(false);
    uploadFileRef.current = "";
  };

  const Loading = () => {
    return (
      <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex justify-center items-center bg-white/50">
        <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="h-[490px] flex flex-col overflow-y-auto relative justify-between">
        {error ? (
          <GenerateErrorComponent buttonHandler={handleButtonClick} />
        ) : uploading ? (
          <Loading />
        ) : (
          <>
            <div>
              <SampleTypeComponent
                name={t("AcrylicStand")}
                description={t("CreateAcrylicStand")}
                clickHandler={() => {
                  props.selectTypeHandler("Acrylic Stand");
                }}
              />
              <SampleTypeComponent
                name={t("Poster")}
                description={t("CreatePoster")}
                clickHandler={() => {
                  props.selectTypeHandler("Poster");
                }}
              />
              <SampleTypeComponent
                name={t("MessageCard")}
                description={t("CreateMessageCard")}
                clickHandler={() => {
                  props.selectTypeHandler("Message Card");
                }}
              />
              <SampleTypeComponent
                name={t("CanBadge")}
                description={t("CreateCanBadge")}
                clickHandler={() => {
                  props.selectTypeHandler("Can Badge");
                }}
              />
            </div>
            <div>
              <UploadButton onDrop={onDrop} isDragActive={isDragActive} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(SampleTypeSelectComponent);
