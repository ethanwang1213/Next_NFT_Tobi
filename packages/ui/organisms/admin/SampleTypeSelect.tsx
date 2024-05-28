import NextImage from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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

export default React.memo(SampleTypeSelectComponent);
