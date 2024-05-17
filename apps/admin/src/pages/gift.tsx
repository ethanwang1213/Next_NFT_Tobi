import useRestfulAPI from "hooks/useRestfulAPI";
import { Metadata } from "next";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateButton from "ui/molecules/CreateButton";
import BoxNameEditDialog from "ui/organisms/admin/BoxNameEditDialog";

export const metadata: Metadata = {
  title: "ギフト受け取り設定",
};

const QRCodeDialog = ({
  initialValue,
  dialogRef,
}: {
  initialValue: string;
  dialogRef: MutableRefObject<HTMLDialogElement>;
}) => {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box rounded-3xl w-[304px] h-[304px]">
        <QRCodeSVG
          value={initialValue}
          size={256}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const InventoryComponent = (props: {
  giftPermission: boolean;
  address: string;
}) => {
  const { data, setData, postData } = useRestfulAPI(null);
  const qrcodeDialogRef = useRef(null);

  useEffect(() => {
    setData({ address: props.address, giftPermission: props.giftPermission });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePermissionHandler = useCallback((perm) => {
    postData(
      "native/my/inventory/gift-permission",
      {
        boxId: 0,
        permission: perm,
      },
      [],
    );
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
        <input
          type="checkbox"
          className={`toggle w-[50px] h-[26px]
          ${
            data.giftPermission ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
          } bg-base-white`}
          checked={data.giftPermission}
          onChange={(e) => changePermissionHandler(e.target.checked)}
        />
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

const BoxComponent = (props: {
  id: number;
  name: string;
  address: string;
  giftPermission: boolean;
  deleteBoxHandler: () => void;
}) => {
  const apiUrl = "native/admin//box";
  const { data, setData, postData } = useRestfulAPI(null);

  const editNameDialogRef = useRef(null);
  const qrcodeDialogRef = useRef(null);

  useEffect(() => {
    setData({
      id: props.id,
      name: props.name,
      address: props.address,
      giftPermission: props.giftPermission,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePermissionHandler = useCallback((perm: boolean) => {
    postData(`${apiUrl}/${props.id}`, { giftPermission: perm }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editIconClickHandler = useCallback(() => {
    if (editNameDialogRef.current) {
      editNameDialogRef.current.showModal();
    }
  }, []);

  const changeNameHandler = useCallback((name: string) => {
    postData(`${apiUrl}/${props.id}`, { name: name }, []);
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
        <span className="flex-1">{data.name}</span>
        <input
          type="checkbox"
          className={`toggle w-[50px] h-[26px]
          ${
            data.giftPermission ? "[--tglbg:#1779DE]" : "[--tglbg:#B5B3B3]"
          } bg-base-white`}
          checked={data.giftPermission}
          onChange={async (e) => changePermissionHandler(e.target.checked)}
        />
        <span className="w-20 text-sm font-normal text-base-black">
          {data.giftPermission ? "Permitted" : "Blocked"}
        </span>
        <Image
          width={16}
          height={16}
          alt="edit"
          src="/admin/images/icon/pencil.svg"
          className="mx-2 my-2 cursor-pointer"
          onClick={editIconClickHandler}
        />
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
        <Image
          width={16}
          height={16}
          alt="delete"
          src="/admin/images/icon/delete-icon.svg"
          className="mx-2 my-2 cursor-pointer"
          onClick={props.deleteBoxHandler}
        />
        <BoxNameEditDialog
          initialValue={data.name}
          dialogRef={editNameDialogRef}
          changeHandler={(value) => changeNameHandler(value)}
        />
        <QRCodeDialog initialValue={data.address} dialogRef={qrcodeDialogRef} />
      </div>
    )
  );
};

export default function Index() {
  const apiUrl = "native/admin/box";
  const { data, setData, getData, postData, deleteData } =
    useRestfulAPI(apiUrl);

  const dialogRef = useRef(null);

  const deleteBoxHandler = useCallback(async (boxId) => {
    const result = await deleteData(`${apiUrl}/${boxId}`);
    if (result) {
      setData(data.filter((data) => data.id !== boxId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newBtnClickHandler = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  const addBoxHandler = useCallback(async (name) => {
    if (!name) {
      toast("Please fill a box name");
      return;
    }
    const result = await postData("native/my/inventory/box", { name: name });
    if (result) {
      getData(apiUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container max-w-[1024px] pt-9 pl-9">
      <div className="text-3xl font-semibold text-secondary mb-4">
        GIFT RECEIVING SETTINGS
      </div>
      <div className="text-xs font-medium text-neutral-400">
        On this page, you can toggle the giftPermission settings for receiving
        gifts. Adjust the settings for each inventory or box, and set specific
        times when gifts can be accepted.
      </div>
      <div className="flex justify-end mt-8">
        <CreateButton
          label="NEW BOX"
          height={48}
          clickHandler={newBtnClickHandler}
        />
      </div>
      {data && (
        <div className="rounded-2xl border border-[#CCCBCB ] ml-8 mt-4">
          <InventoryComponent
            giftPermission={data.giftPermission}
            address={data.address}
          />
          {data.boxes.map((box) => (
            <BoxComponent
              key={`box-${box.id}`}
              id={box.id}
              name={box.name}
              address={box.address}
              giftPermission={box.giftPermission}
              deleteBoxHandler={() => deleteBoxHandler(box.id)}
            />
          ))}
        </div>
      )}
      <BoxNameEditDialog
        initialValue=""
        dialogRef={dialogRef}
        changeHandler={(value) => addBoxHandler(value)}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="dark"
      />
    </div>
  );
}
