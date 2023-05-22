import { useEditProfile } from "@/contexts/EditProfileProvider";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  iconFile: File | null;
  setIconFile: React.Dispatch<React.SetStateAction<File | null>>;
  iconUrl: string;
  setIconUrl: React.Dispatch<React.SetStateAction<string>>;
};

const IconSelect: React.FC<Props> = ({
  iconFile,
  setIconFile,
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

    setIconFile(file);
    file.arrayBuffer().then((buffer) => {
      // 表示用にURLをセット
      const url = URL.createObjectURL(file);
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
