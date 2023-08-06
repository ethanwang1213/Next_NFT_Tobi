import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useMemo, useState } from "react";
import { BookContext } from "@/contexts/BookContextProvider";
import Image from "next/image";
import { useHoldNfts } from "@/contexts/HoldNftsProvider";

/**
 * NFTを全画面表示で閲覧するためのモーダル
 * @returns
 */
const NftViewModal: React.FC = () => {
  const { pageNo, bookIndex } = useContext(BookContext);
  const { viewingSrc } = useHoldNfts();

  const isNekoPage = useMemo(
    () =>
      pageNo.current >= bookIndex.nekoPage.start &&
      pageNo.current <= bookIndex.nekoPage.end,
    [pageNo.current, bookIndex.nekoPage.start, bookIndex.nekoPage.end]
  );

  const isNftPage = useMemo(
    () =>
      pageNo.current >= bookIndex.nftPage.start &&
      pageNo.current <= bookIndex.nftPage.end,
    [pageNo.current, bookIndex.nftPage.start, bookIndex.nftPage.end]
  );

  if (!(isNekoPage || isNftPage)) {
    return <></>;
  }

  return (
    <>
      <input type="checkbox" id="nft-view-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-full max-h-full w-full h-full pt-10 pb-8">
          <label
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 text-accent z-10"
            htmlFor="nft-view-modal"
          >
            <FontAwesomeIcon icon={faXmark} fontSize={24} />
          </label>
          <div className="w-full h-full flex flex-col">
            <div className="w-full grow">
              <div className="relative w-full h-full">
                {viewingSrc.current && (
                  <Image
                    src={viewingSrc.current}
                    alt="nft image"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex justify-end">
              {/* if there is a button, it will close the modal */}
              <label
                className="btn btn-accent btn-outline"
                htmlFor="nft-view-modal"
              >
                閉じる
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NftViewModal;
