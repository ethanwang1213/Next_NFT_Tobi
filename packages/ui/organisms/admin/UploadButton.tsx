import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useDropzone } from "react-dropzone";

const UploadButton = ({ onDrop, isDragActive }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "model/gltf+json": [".gltf"],
      "model/gltf-binary": [".glb"],
      "application/zip": [".zip"],
    },
    onDrop,
  });
  const t = useTranslations("Workspace");

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
      <div>
        <p className="text-secondary-500 text-base font-medium">
          {t("Upload3DItemModel")}
        </p>
        <p className="text-secondary-500 text-[14px] text-center">
          .zip(.gltf files) or .glb
        </p>
      </div>

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
