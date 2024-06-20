import NextImage from "next/image";
import React, { useCallback } from "react";

const sampleCreateRoadmapTitles = {
  acrylicstand: [
    {
      title: "Select a material",
      description: "Select the material for the acrylic stand body.",
    },
    {
      title: "Adjust Body",
      description: "Adjust the tilt of the body by rotating it.",
    },
    {
      title: "Select Base Material",
      description: "Select the material for the acrylic stand base.",
    },
    {
      title: "Adjust and Place",
      description:
        'Set the front and back of the base and adjust it by rotating and place the body on the base. Move the rectangle labeled "Acrylic plate" to set the placement.',
    },
  ],
  poster: [
    {
      title: "Select a material",
      description: "Select the material for the poster.",
    },
    {
      title: "Crop",
      description: "Crop the poster material as needed.",
    },
  ],
  messagecard: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    {
      title: "Crop",
      description: "ポスターにしたい範囲で切り抜きしてください",
    },
    { title: "Generate", description: "" },
  ],
  acrylickeyholder: [
    {
      title: "Select a material",
      description: "ポスターにする素材を選択してください",
    },
    { title: "Create the body", description: "" },
    { title: "Attach the chain", description: "" },
    { title: "Generate", description: "" },
  ],
  canbadge: [
    {
      title: "Select a material",
      description: "Select the material for the Can Badge.",
    },
    {
      title: "Crop the image",
      description: "Crop the can badge material as needed.",
    },
  ],
};

const RoadMapComponent = (props: {
  sampleType: string | null;
  step: number;
}) => {
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
      const key = props.sampleType.toLocaleLowerCase().split(" ").join("");
      return idx < sampleCreateRoadmapTitles[key].length - 1
        ? "border-l-2"
        : "border-l-0";
    },
    [props, sampleCreateRoadmapTitles],
  );

  return (
    <div className="flex flex-col py-5 px-6">
      <NextImage
        width={24}
        height={24}
        alt="logo icon"
        src="/admin/images/tobiratory-logo-white.svg"
      />
      <span className="text-base-white text-lg font-semibold mt-6">
        {props.step === 0 ? "Sample Item Generator" : "ITEM CREATE"}
      </span>
      {props.step > 0 && (
        <span className="text-base-white text-sm font-light">
          {`- ${props.sampleType}`}
        </span>
      )}
      {props.step === 0 ? (
        <span className="text-base-white text-sm font-normal mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </span>
      ) : (
        <div className="mt-5 flex flex-col">
          {sampleCreateRoadmapTitles[
            props.sampleType.toLocaleLowerCase().split(" ").join("")
          ].map((roadmap, index) => {
            return (
              <div key={`roadmap-${index}`} className="flex flex-col">
                <span
                  className={`text-base-white text-xs font-normal
                    ${
                      props.step === index + 1
                        ? "text-base-white"
                        : "text-base-white/25"
                    } `}
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
