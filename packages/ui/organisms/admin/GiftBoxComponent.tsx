import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import BoxNameEditDialog from "ui/organisms/admin/BoxNameEditDialog";
import DeleteConfirmDialog from "ui/organisms/admin/DeleteConfirmDialog";
import QRCodeDialog from "ui/organisms/admin/QRCodeDialog";

const BoxComponent = (props: {
  id: number;
  name: string;
  address: string;
  giftPermission: boolean;
  deleteBoxHandler: () => void;
}) => {
  const apiUrl = "native/my/box";
  const { data, setData, putData } = useRestfulAPI(null);
  const [loadingChangePerm, setLoadingChangePerm] = useState(false);
  const [loadingChangeName, setLoadingChangeName] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const editNameDialogRef = useRef(null);
  const qrcodeDialogRef = useRef(null);
  const deleteConfirmDialogRef = useRef(null);

  useEffect(() => {
    setData({
      id: props.id,
      name: props.name,
      address: props.address,
      giftPermission: props.giftPermission,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePermissionHandler = useCallback(async (perm: boolean) => {
    setLoadingChangePerm(true);
    await putData(`${apiUrl}/${props.id}`, { giftPermission: perm }, []);
    setLoadingChangePerm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editIconClickHandler = useCallback(() => {
    if (editNameDialogRef.current) {
      editNameDialogRef.current.showModal();
    }
  }, []);

  const changeNameHandler = useCallback(async (name: string) => {
    setLoadingChangeName(true);
    await putData(`${apiUrl}/${props.id}`, { name: name }, []);
    setLoadingChangeName(false);
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

  const deleteBoxDialogHandler = useCallback(
    (value: string) => {
      if (value == "delete") {
        setLoadingDelete(true);
        props.deleteBoxHandler();
      }
    },
    [props],
  );

  const showDeleteConfirmDialog = useCallback(() => {
    if (deleteConfirmDialogRef.current) {
      deleteConfirmDialogRef.current.showModal();
    }
  }, []);

  return (
    data && (
      <div className="h-14 border-b border-neutral-100 pl-4 pr-1 hover:bg-neutral-100 flex items-center gap-4">
        <span className="flex-1">{data.name}</span>
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
            onChange={async (e) => changePermissionHandler(e.target.checked)}
          />
        )}
        <span className="w-20 text-sm font-normal text-base-black">
          {data.giftPermission ? "Permitted" : "Blocked"}
        </span>
        {loadingChangeName ? (
          <span className="loading loading-spinner loading-md mx-1 text-secondary-600" />
        ) : (
          <Image
            width={16}
            height={16}
            alt="edit"
            src="/admin/images/icon/pencil.svg"
            className="mx-2 my-2 cursor-pointer"
            onClick={editIconClickHandler}
          />
        )}
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
        {loadingDelete ? (
          <span className="loading loading-spinner loading-md mx-1 text-secondary-600" />
        ) : (
          <Image
            width={16}
            height={16}
            alt="delete"
            src="/admin/images/icon/delete-icon.svg"
            className="mx-2 my-2 cursor-pointer"
            onClick={showDeleteConfirmDialog}
          />
        )}
        <BoxNameEditDialog
          initialValue={data.name}
          dialogRef={editNameDialogRef}
          changeHandler={(value) => changeNameHandler(value)}
        />
        <QRCodeDialog initialValue={props.address} dialogRef={qrcodeDialogRef} />
        <DeleteConfirmDialog
          dialogRef={deleteConfirmDialogRef}
          changeHandler={deleteBoxDialogHandler}
        />
      </div>
    )
  );
};

export default BoxComponent;
