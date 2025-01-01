import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import CreateButton from "ui/molecules/CreateButton";
import BoxNameEditDialog from "ui/organisms/admin/BoxNameEditDialog";
import BoxComponent from "ui/organisms/admin/GiftBoxComponent";
import InventoryComponent from "ui/organisms/admin/InventoryComponent";
import { getMessages } from "admin/messages/messages";

export const metadata: Metadata = {
  title: "ギフト受け取り設定",
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

export default function Index() {
  const apiUrl = "native/admin/boxes";
  const { data, setData, getData, postData, deleteData } =
    useRestfulAPI(apiUrl);
  const [loadingNewBox, setLoadingNewBox] = useState(false);
  const dialogRef = useRef(null);
  const t = useTranslations("GiftReceivingSettings");

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
      <div className="text-3xl font-semibold text-secondary mb-4 uppercase">
        GIFT RECEIVING SETTINGS
      </div>
      <div className="text-xs font-medium text-neutral-400">
        {t("TogglePermission")}
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
    </div>
  );
}
