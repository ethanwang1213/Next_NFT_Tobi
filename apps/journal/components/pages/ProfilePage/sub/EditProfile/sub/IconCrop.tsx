import { use, useCallback, useEffect, useRef, useState } from "react";
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

  // 最初クロップ範囲が小さく表示されてしまうので、
  // 一瞬待ってからクロップ範囲のアス比を変更して対応している。
  // TODO: fpsで影響が出る可能性あり。他の方法の検討が必要
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [aspect, setAspect] = useState(0.99);
  useEffect(() => {
    if (!isMediaLoaded) return;
    setTimeout(() => setAspect(1), 200);
  }, [isMediaLoaded]);

  return (
    <>
      <div className="h-full flex flex-col gap-3">
        <div className="relative h-full w-full">
          <Cropper
            image={url}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            onMediaLoaded={() => setIsMediaLoaded(true)}
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
    </>
  );
};

export default IconCrop;
