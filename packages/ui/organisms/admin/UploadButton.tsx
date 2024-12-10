import { useLocale, useTranslations } from "next-intl";
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
  const lang = useLocale();
  return (
    <div
      {...getRootProps()}
      style={{
        width: 400,
        height: 165,
        borderRadius: 13,
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#B3B3B3",
        backgroundColor: isDragActive ? "#B3B3B3" : "transparent",
      }}
      className="flex justify-center items-center gap-3 cursor-pointer"
    >
      <input {...getInputProps()} />
      <div
        className={`flex flex-col items-center justify-center ${
          lang === "en" ? "w-[270px]" : "w-[320px]"
        }`}
      >
        <NextImage
          width={20}
          height={20}
          src="/admin/images/icon/upload-icon.svg"
          alt="upload icon"
        />
        <p className="text-secondary-500 text-base font-medium mt-4">
          {t("Upload3DItemModel")}
        </p>
        <p className="text-secondary-500 text-[14px] text-center">
          .zip(.gltf files) or .glb : limit size: 50MB.
        </p>
        <p className="text-secondary-400 text-[10px] text-center mt-6">
          {t("ModelUploadWarning")}
        </p>
      </div>
    </div>
  );
};

export default UploadButton;
