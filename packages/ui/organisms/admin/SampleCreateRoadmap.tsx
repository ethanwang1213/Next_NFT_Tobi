import { useTranslations } from "next-intl";
import NextImage from "next/image";
import React, { useCallback } from "react";

const RoadMapComponent = (props: {
  sampleType: string | null;
  step: number;
}) => {
  const t = useTranslations("Workspace");

  const sampleCreateRoadmapTitles = () => {
    return {
      acrylicstand: [
        {
          title: t("SelectMaterial"),
          description: t("SelectAcrylicStandBodyMaterial"),
        },
        {
          title: t("AdjustBody"),
          description: t("AdjustBodyTilt"),
        },
        {
          title: t("SelectBaseMaterial"),
          description: t("SelectAcrylicStandBaseMaterial"),
        },
        {
          title: t("AdjustBase"),
          description: t("SetBaseOrientation"),
        },
      ],
      poster: [
        {
          title: t("SelectMaterial"),
          description: t("SelectPosterMaterial"),
        },
        {
          title: t("Crop"),
          description: t("CropPosterMaterial"),
        },
      ],
      messagecard: [
        {
          title: t("SelectSheetMaterial"),
          description: t("SelectMessageCardSheetMaterial"),
        },
        {
          title: t("CropSheet"),
          description: t("CropSheetAsNeeded"),
        },
        {
          title: t("SelectTextMaterial"),
          description: t("SelectMessageCardTextMaterial"),
        },
        {
          title: t("AdjustText"),
          description: t("AdjustTextPosition"),
        },
        {
          title: t("Combine"),
          description: t("CombineSheetAndText"),
        },
      ],
      acrylickeyholder: [
        {
          title: t("SelectMaterial"),
          description: "ポスターにする素材を選択してください",
        },
        { title: "Create the body", description: "" },
        { title: "Attach the chain", description: "" },
        { title: "Generate", description: "" },
      ],
      canbadge: [
        {
          title: t("SelectMaterial"),
          description: t("SelectCanBadgeMaterial"),
        },
        {
          title: t("CropImage"),
          description: t("CropBadge"),
        },
      ],
    };
  };

  const getOrderNumber = useCallback((value) => {
    switch (value + 1) {
      case 1:
        return "①";
      case 2:
        return "②";
      case 3:
        return "③";
      case 4:
        return "④";
      case 5:
        return "⑤";
      default:
        return "";
    }
  }, []);

  const getLeftBorderLengthClass = useCallback(
    (idx: number): string => {
      const key = props.sampleType.toLowerCase().replace(/\s+/g, "");
      return idx < sampleCreateRoadmapTitles()[key].length - 1
        ? "border-l-2"
        : "border-l-0";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  const getSampleTypeKey = (sampleType) => {
    switch (sampleType) {
      case "Acrylic Stand":
        return "AcrylicStand";
      case "Poster":
        return "Poster";
      case "Message Card":
        return "MessageCard";
      case "Can Badge":
        return "CanBadge";
      case "Acrylic Keychain":
        return "AcrylicKeychain";
      default:
        return sampleType.toLowerCase().replace(/\s+/g, "");
    }
  };

  return (
    <div className="flex flex-col py-5 px-[22px]">
      <NextImage
        width={24}
        height={24}
        alt="logo icon"
        src="/admin/images/tobiratory-logo-white.svg"
      />
      <span className="text-base-white text-[18px] font-semibold mt-6">
        {props.step === 0 ? t("ItemGenerator") : t("ItemCreate")}
      </span>
      {props.step > 0 && (
        <span className="text-base-white text-[13px] font-light">
          {`- ${t(getSampleTypeKey(props.sampleType))}`}
        </span>
      )}
      {props.step === 0 ? (
        <span className="text-base-white text-[12px] font-normal mt-2">
          {t("ItemGeneratorDescription")}
        </span>
      ) : (
        <div className="mt-5 flex flex-col">
          {sampleCreateRoadmapTitles()[
            props.sampleType.toLowerCase().replace(/\s+/g, "")
          ]?.map((roadmap, index) => {
            return (
              <div key={`roadmap-${index}`} className="flex flex-col">
                <span
                  className={`text-base-white text-xs font-normal
            ${
              props.step === index + 1
                ? "text-base-white"
                : "text-base-white/25"
            }
            `}
                >
                  {`${getOrderNumber(index)} ${roadmap.title}`}
                </span>
                <span
                  className={`text-[8px] font-normal h-8 ml-[6px] pl-3 text-base-white
            ${
              props.step === index + 1
                ? "border-base-white"
                : "border-base-white/25"
            }
            ${getLeftBorderLengthClass(index)} `}
                >
                  {props.step === index + 1 ? roadmap.description : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(RoadMapComponent);
