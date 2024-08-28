import { ImageType, uploadFiles } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import NextImage from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import GenerateErrorComponent from "./GenerateErrorComponent";
import UploadButton from "./UploadButton";

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
  const postApiUrl = "native/zip-model";
  const { postData } = useRestfulAPI(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const uploadFileRef = useRef<string>("");

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
          setUploading(false);
        }
      }
      return true;
    },
    [],
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      for (const file of acceptedFiles) {
        const fileName = file.name.split(".")[0];
        const fileExtension = file.type.split("/")[1];
        if (
          file &&
          (fileExtension === "gltf" ||
            fileExtension === "glb" ||
            fileExtension === "zip")
        ) {
          const fileUrl = URL.createObjectURL(file);
          await uploadImageHandler(fileUrl, fileName, fileExtension);
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
      <div className="h-[490px] flex flex-col overflow-y-auto relative">
        {error ? (
          <GenerateErrorComponent buttonHandler={handleButtonClick} />
        ) : uploading ? (
          <Loading />
        ) : (
          <>
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
            <UploadButton onDrop={onDrop} isDragActive={isDragActive} />
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(SampleTypeSelectComponent);
