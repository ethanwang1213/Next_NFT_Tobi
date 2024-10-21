import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import QRCodeDialog from "ui/organisms/admin/QRCodeDialog";

const InventoryComponent = (props: {
  giftPermission: boolean;
  address: string;
}) => {
  const { data, setData, putData } = useRestfulAPI(null);
  const [loadingChangePerm, setLoadingChangePerm] = useState(false);
  const qrcodeDialogRef = useRef(null);

  useEffect(() => {
    setData({ address: props.address, giftPermission: props.giftPermission });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePermissionHandler = useCallback(async (perm) => {
    setLoadingChangePerm(true);
    await putData(
      "native/my/box/0",
      {
        giftPermission: perm,
      },
      [],
    );
    setLoadingChangePerm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyAddressHandler = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast("address is copied");
  }, []);

  const qrcodeIconClickHandler = useCallback(() => {
    if (qrcodeDialogRef.current) {
      qrcodeDialogRef.current.showModal();
    }
  }, []);

  return (
    data && (
      <div className="h-14 border-b border-neutral-100 pl-4 pr-1 hover:bg-neutral-100 flex items-center gap-4">
        <span className="flex-1">Inventory</span>
        {loadingChangePerm ? (
          <span className="loading loading-spinner loading-md mr-3 text-secondary-600" />
        ) : (
          <input
            type="checkbox"
            className={`toggle w-[50px] h-[26px]
            ${
              data.giftPermission ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
            } bg-base-white`}
            checked={data.giftPermission}
            onChange={(e) => changePermissionHandler(e.target.checked)}
          />
        )}
        <span className="w-20 text-sm font-normal text-base-black">
          {data.giftPermission ? "Permitted" : "Blocked"}
        </span>
        <div className="w-8"></div>
        {data.giftPermission ? (
          <Image
            width={16}
            height={16}
            alt="link"
            src="/admin/images/icon/link.svg"
            className="mx-2 my-2 cursor-pointer"
            onClick={() => copyAddressHandler(data.address)}
          />
        ) : (
          <div className="w-8"></div>
        )}
        {data.giftPermission ? (
          <Image
            width={16}
            height={16}
            alt="qrcode"
            src="/admin/images/icon/qr_code.svg"
            className="mx-2 my-2 cursor-pointer"
            onClick={qrcodeIconClickHandler}
          />
        ) : (
          <div className="w-8"></div>
        )}
        <div className="w-8"></div>
        <QRCodeDialog initialValue={data.address} dialogRef={qrcodeDialogRef} />
      </div>
    )
  );
};

export default InventoryComponent;