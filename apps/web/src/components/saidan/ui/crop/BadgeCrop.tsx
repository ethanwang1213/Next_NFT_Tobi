import Jimp from "jimp";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { CropData, CropperParams } from "@/types/PlacedItemData";

const BadgeCrop: FC<{
  // src: File;
  url: string;
  // eslint-disable-next-line no-unused-vars
  func: (cropData: CropData, pCropperParams: CropperParams) => any;
  className?: string;
  children: ReactNode;
  pCrop: { x: number; y: number };
  pZoom: number;
}> = ({ url, func, className, children, pCrop, pZoom }) => {
  const [crop, setCrop] = useState(pCrop);
  const [zoom, setZoom] = useState(pZoom);
  // const [url] = useState(URL.createObjectURL(src));
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  useEffect(() => {
    setCrop(pCrop);
  }, [pCrop]);

  useEffect(() => {
    setZoom(pZoom);
  }, [pZoom]);

  const submit = async () => {
    if (!crop || !croppedAreaPixels) return;
    // const arrayBuffer = await src.arrayBuffer();
    // let img = await Jimp.read(arrayBuffer as Buffer);
    const img = await Jimp.read(url);
    const srcW = img.getWidth();
    const srcH = img.getHeight();
    // img = img.crop(
    //   croppedAreaPixels.x,
    //   croppedAreaPixels.y,
    //   croppedAreaPixels.width,
    //   croppedAreaPixels.height
    // );
    // const width = img.getWidth();
    // const height = img.getHeight();
    // const r = new Jimp(width / (0.989 - 0.216), height / (0.795 - 0.022), 0x0);
    // r.blit(img, r.getWidth() * 0.216, r.getHeight() * 0.022);

    const cropData: CropData = {
      isSet: true,
      x: croppedAreaPixels.x + croppedAreaPixels.width / 2.0,
      y: croppedAreaPixels.y + croppedAreaPixels.height / 2.0,
      w: croppedAreaPixels.width,
      h: croppedAreaPixels.height,
      srcW,
      srcH,
    };
    // func(r, cropData);
    func(cropData, { crop, zoom });
  };

  const onCropComplete = useCallback((_: Area, c: Area) => {
    setCroppedAreaPixels(c);
  }, []);

  return (
    <>
      {crop && url && (
        <div className="h-full flex flex-col gap-3">
          <div className={className}>
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              style={{ cropAreaStyle: { width: "80%", height: "80%" } }}
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
            <button type="button" className="inline" onClick={submit}>
              {/* 送信 */}
              {children}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
BadgeCrop.defaultProps = {
  className: "",
};

export default BadgeCrop;
