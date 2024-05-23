import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "ui/atoms/Button";
import CustomToast from "ui/organisms/admin/CustomToast";
import ShowcaseNameEditDialog from "ui/organisms/admin/ShowcaseNameEditDialog";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";

const Showcase = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showDetailView, setShowDetailView] = useState(true);
  const [showSmartFrame, setShowSmartFrame] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedSampleItem, setSelectedSampleItem] = useState(-1);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const apiUrl = "native/admin/showcases";
  const { data, error, getData, putData } = useRestfulAPI(null);

  const handleButtonClick = (msg) => {
    setMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5800);
  };

  const changeShowcaseDetail = async (title: string, description: string) => {
    setLoading(true);
    const jsonData = await putData(
      `${apiUrl}/${id}`,
      { title, description },
      [],
    );
    if (jsonData) {
      data.title = jsonData.title;
      data.description = jsonData.description;
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(`${apiUrl}/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const updateContainerWidth = () => {
      const height = document.querySelector(".w-full.h-full").clientHeight;
      const width = Math.ceil((height / 16) * 9);
      setContainerWidth(width);
    };

    // Update container width on mount and window resize
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full relative">
        <div
          className="absolute top-0 right-0 flex justify-center mx-auto mt-[24px]"
          style={{
            width: `${containerWidth}px`,
            left: `${318 - 504}px`,
          }}
        >
          <span className="text-xl font-semibold text-[#858585] text-center mr-1">
            {data?.title}
          </span>
          <Button onClick={() => dialogRef.current.showModal()}>
            {loading ? (
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              <Image
                width={24}
                height={24}
                src="/admin/images/icon/pencil.svg"
                alt="pencil icon"
              />
            )}
          </Button>
        </div>
        {showDetailView && <ShowcaseSampleDetail id={selectedSampleItem} />}
        {/* Align component in the center */}
        {/* 318px: width of left component. 504px: width of right component. */}
        <div
          className="w-[336px] mt-[72px] absolute"
          style={{ left: "calc(318px + (100% - 318px - 504px - 336px) / 2)" }}
        >
          {showToast && <CustomToast message={message}></CustomToast>}
        </div>
        <div
          className="w-[336px] bottom-0 absolute"
          style={{ left: "calc(318px + (100% - 318px - 504px - 336px) / 2)" }}
        >
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8">
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/undo-icon.svg"
                className="cursor-pointer"
                onClick={() =>
                  handleButtonClick("undo: Deleted Sample Item A ")
                }
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer"
                onClick={() =>
                  handleButtonClick("redo: Deleted Sample Item A ")
                }
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src={
                  showSmartFrame
                    ? "/admin/images/icon/crop-on-icon.svg"
                    : "/admin/images/icon/crop-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowSmartFrame(!showSmartFrame);
                  handleButtonClick(
                    showSmartFrame
                      ? "The smartphone frame is visibly"
                      : "The smartphone frame is disable",
                  );
                }}
              />
              <Image
                width={32}
                height={32}
                alt="toggle button"
                src={
                  showDetailView
                    ? "/admin/images/icon/visibility-on-icon.svg"
                    : "/admin/images/icon/visibility-off-icon.svg"
                }
                className="cursor-pointer"
                onClick={() => {
                  setShowDetailView(!showDetailView);
                  handleButtonClick(
                    showDetailView ? "The UI is hidden" : "The UI is shown",
                  );
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/help-icon.svg"
                className="cursor-pointer"
                onClick={() => handleButtonClick("help button is clicked")}
              />
            </div>
          </div>
        </div>
        {showDetailView && (
          <ShowcaseTabView
            clickSampleItem={(id: number) => setSelectedSampleItem(id)}
          />
        )}
        <div className="fixed mt-[24px] ml-[38px]">
          <Link
            href="/contents"
            className="rounded-lg bg-gray-400 bg-opacity-50 flex items-center gap-2 text-white backdrop-blur-md p-2"
          >
            <Image
              width={32}
              height={32}
              alt="Link back Icon"
              src="/admin/images/icon/arrow-back-icon.svg"
            />
            <span>Exit</span>
          </Link>
        </div>
        <ShowcaseNameEditDialog
          showcaseTitle={data?.title}
          showcaseDescription={data?.description}
          dialogRef={dialogRef}
          changeHandler={changeShowcaseDetail}
        />
      </div>
    </div>
  );
};

export default Showcase;
