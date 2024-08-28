import React from "react";
import { useDropzone } from "react-dropzone";
import NextImage from "next/image";

const UploadButton = ({ onDrop, isDragActive }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "model/gltf+json": [".gltf"],
      "model/gltf-binary": [".glb"],
      "application/zip": [".zip"],
    },
    onDrop,
  });

  return (
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
      <input {...getInputProps()} />
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
  );
};

export default UploadButton;
