import { useEditProfile } from "@/contexts/EditProfileProvider";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  iconBlob: Blob;
  setIconBlob: React.Dispatch<React.SetStateAction<Blob>>;
  iconUrl: string;
  setIconUrl: React.Dispatch<React.SetStateAction<string>>;
};

const IconSelect: React.FC<Props> = ({
  iconBlob,
  setIconBlob,
  iconUrl,
  setIconUrl,
}) => {
  const { isCropWindowOpen } = useEditProfile();

  useEffect(() => {
    // TODO: 現在のアイコンが設定されている場合、それを表示する
    setIconUrl("/mocks/images/profile.png");
  }, []);

  const handleIconChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files[0];
    if (!file) return;
    file.arrayBuffer().then((buffer) => {
      // // Blobをセット
      const blob = new Blob([buffer], { type: "image/png" });
      // setIconBlob(blob);
      // 表示用にURLをセット
      const url = URL.createObjectURL(blob);
      setIconUrl(url);
      // クロップウィンドウを開く
      isCropWindowOpen.set(true);
    });
  };

  return (
    <>
      <input
        id="new-icon"
        type="file"
        accept="image/png, image/jpeg, image/bmp, image/tiff"
        className="hidden"
        onChange={(ev) => handleIconChange(ev)}
      />
      <div className="w-[20%] aspect-square relative">
        <label htmlFor="new-icon">
          {iconUrl && (
            <Image src={iconUrl} alt="preview" fill className="object-cover" />
          )}
        </label>
      </div>
    </>
  );
};

export default IconSelect;
