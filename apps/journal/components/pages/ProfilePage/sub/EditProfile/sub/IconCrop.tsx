import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

type Props = {
  url: string;
  func: (crop: Area) => any;
};

/**
 * アイコン画像のクロップを行うコンポーネント。
 * @param param0
 * @returns
 */
const IconCrop: React.FC<Props> = ({ url, func }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropComplete = useCallback((_: Area, c: Area) => {
    setCroppedAreaPixels(c);
  }, []);

  // クロップの完了処理
  const submit = async () => {
    if (!crop || !croppedAreaPixels) return;
    func(croppedAreaPixels);
  };

  return (
    <>
      {crop && url && (
        <div className="h-full flex flex-col gap-3">
          <div className="relative h-full w-full">
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
            />
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-accent w-[30%]"
              onClick={submit}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IconCrop;
