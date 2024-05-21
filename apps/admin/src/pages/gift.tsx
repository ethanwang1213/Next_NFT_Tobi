import useRestfulAPI from "hooks/useRestfulAPI";
import { Metadata } from "next";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
            onClick={() => {
              setLoadingDelete(true);
              props.deleteBoxHandler();
            }}
          />
        )}
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
  const apiUrl = "native/admin/boxes";
  const { data, setData, getData, postData, deleteData } =
    useRestfulAPI(apiUrl);
  const [loadingNewBox, setLoadingNewBox] = useState(false);
  const dialogRef = useRef(null);

  const deleteBoxHandler = useCallback(
    async (boxId) => {
      const result = await deleteData(`native/my/inventory/box/${boxId}`);
      if (result) {
        const newBoxes = data.boxes.filter((item) => item.id !== boxId);
        setData({ ...data, ["boxes"]: newBoxes });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

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
    setLoadingNewBox(true);
    const result = await postData("native/my/inventory/box", { name: name });
    if (result) {
      await getData(apiUrl);
    }
    setLoadingNewBox(false);
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
        {loadingNewBox ? (
          <span className="loading loading-spinner loading-md my-3 text-secondary-600" />
        ) : (
          <CreateButton
            label="NEW BOX"
            height={48}
            clickHandler={newBtnClickHandler}
          />
        )}
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
