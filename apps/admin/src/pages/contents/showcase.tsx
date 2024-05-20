import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowcaseSampleDetail from "ui/organisms/admin/ShowcaseSampleDetail";
import ShowcaseTabView from "ui/organisms/admin/ShowcaseTabView";
import { SampleStatus } from "ui/organisms/admin/StatusDropdownSelect";

const Showcase = () => {
  const router = useRouter();
  const { id } = router.query;
  const [modified, setModified] = useState(false);
  const [sampleDetailView, setSampleDetailView] = useState(true);
  const [showcaseTabView, setShowcaseTabView] = useState(true);

  const apiUrl = "native/admin/samples";
  const {
    data: sampleItem,
    dataRef,
    loading,
    error,
    setData,
    setLoading,
    postData,
  } = useRestfulAPI(`${apiUrl}/${id}`);

  const fieldChangeHandler = useCallback(
    (field, value) => {
      setData({ ...sampleItem, [field]: value });
      setModified(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sampleItem],
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        fieldChangeHandler("customThumbnailUrl", URL.createObjectURL(file));
      }
    },
    [fieldChangeHandler],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const checkMandatoryFields = () => {
    if (
      sampleItem.status == SampleStatus.ViewingOnly ||
      sampleItem.status == SampleStatus.OnSale ||
      sampleItem.status == SampleStatus.ScheduledPublishing ||
      sampleItem.status == SampleStatus.ScheduledforSale
    ) {
      if (
        sampleItem.name == null ||
        sampleItem.name == "" ||
        sampleItem.description == null ||
        sampleItem.description == "" ||
        sampleItem.quantityLimit == null ||
        sampleItem.quantityLimit == 0 ||
        sampleItem.license == null ||
        sampleItem.license == "" ||
        sampleItem.copyrights == null ||
        sampleItem.copyrights.length == 0
      ) {
        return false;
      }
      if (
        sampleItem.status == SampleStatus.ScheduledPublishing ||
        sampleItem.status == SampleStatus.ScheduledforSale
      ) {
        if (sampleItem.startDate == null || sampleItem.endDate == null) {
          return false;
        }
      }
    }

    return true;
  };

  const submitHandler = async () => {
    setLoading(true);

    const submitData = {
      name: sampleItem.name,
      description: sampleItem.description,
      customThumbnailUrl: sampleItem.customThumbnailUrl,
      isCustomThumbnailSelected: sampleItem.isCustomThumbnailSelected,
      price: parseInt(sampleItem.price ?? 0),
      status: sampleItem.status,
      startDate: sampleItem.startDate,
      endDate: sampleItem.endDate,
      quantityLimit: parseInt(sampleItem.quantityLimit),
      license: sampleItem.license,
      copyrights: sampleItem.copyrights,
    };

    if (submitData.customThumbnailUrl != dataRef.current.customThumbnailUrl) {
      submitData.customThumbnailUrl = await uploadImage(
        submitData.customThumbnailUrl,
        ImageType.SampleThumbnail,
      );
    }

    if (
      submitData.status != SampleStatus.ScheduledPublishing &&
      submitData.status != SampleStatus.ScheduledforSale
    ) {
      delete submitData.startDate;
      delete submitData.endDate;
    }

    if (await postData(`${apiUrl}/${sampleItem.id}`, submitData)) {
      setModified(false);
      dataRef.current = sampleItem;
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error.toString());
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const isReadOnly = useCallback(() => {
    if (
      dataRef.current.status == SampleStatus.ViewingOnly ||
      dataRef.current.status == SampleStatus.OnSale ||
      dataRef.current.status == SampleStatus.ScheduledPublishing ||
      dataRef.current.status == SampleStatus.ScheduledforSale
    ) {
      return true;
    }
    return false;
  }, [dataRef]);

  return (
    <div className="w-full h-full">
      <div className="unity-view w-full h-full flex justify-between">
        {sampleDetailView && <ShowcaseSampleDetail />}
        <div className="flex-1 relative">
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="rounded-3xl bg-secondary px-6 py-2 flex gap-8">
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/undo-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("undo button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/redo-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("redo button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/crop-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("crop button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/visibility-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("visibility button is clicked");
                }}
              />
              <Image
                width={32}
                height={32}
                alt="undo button"
                src="/admin/images/icon/help-icon.svg"
                className="cursor-pointer"
                onClick={() => {
                  console.log("help button is clicked");
                }}
              />
            </div>
          </div>
        </div>
        {showcaseTabView && <ShowcaseTabView />}
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
      </div>
    </div>
  );
};

export default Showcase;
