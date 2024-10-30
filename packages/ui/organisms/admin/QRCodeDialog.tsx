import html2canvas from "html2canvas";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { MutableRefObject } from "react";

const QRCodeDialog = ({
  initialValue,
  dialogRef,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  const t = useTranslations("GiftReceivingSettings");
  const handleDownload = async () => {
    const qrcodeDiv = document.getElementById(initialValue);
    if (qrcodeDiv) {
      const canvas = await html2canvas(qrcodeDiv);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error("QR code div not found");
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="flex flex-col justify-center items-center space-x-5">
        <div
          className="modal-box rounded-3xl w-[304px] h-[304px]"
          id={initialValue}
        >
          <QRCodeSVG
            value={initialValue}
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
            onClick={handleDownload}
          />
        </div>
        <p className="text-base text-white text-center pt-10">
          {t("QrCodeSaveInstruction")} <br />
          {t("QrCodeCloseInstruction")}
        </p>
      </div>

      <form
        method="dialog"
        className="modal-backdrop w-screen h-screen absolute"
      >
        <button>close</button>
      </form>
    </dialog>
  );
};

export default QRCodeDialog;
