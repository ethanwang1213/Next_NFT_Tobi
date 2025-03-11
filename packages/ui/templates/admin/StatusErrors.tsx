"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
interface StatusErrorsProps {
  status: string;
}

const mainImageSizes: Record<string, { width: number; height: number }> = {
  "401": { width: 250, height: 386 },
  "403": { width: 302, height: 292 },
  "404": { width: 285, height: 386 },
  "500": { width: 404, height: 292 },
  "503": { width: 302, height: 246 },
  "504": { width: 432, height: 292 },
};

const getImageSize = (
  sizeMap: Record<string, { width: number; height: number }>,
  status: string
) => sizeMap[status] || { width: 285, height: 386 };

const StatusErrors = ({ status }: StatusErrorsProps) => {
  const t = useTranslations(`error_${status}`);
  const list = t.raw("list");
  const mainImage = getImageSize(mainImageSizes, status);
  
  return (
    <div className="flex min-h-screen justify-center items-center font-mplus px-4">
      <div className="w-screen md:w-[1000px] h-[600px] py-10 sm:p-0 flex md:flex-row justify-between gap-6">
        <div className="flex flex-col w-full md:w-1/2 relative">
          <Image
            src={`/admin/images/error/${status}_text.svg`}
            alt={`${status} error`}
            width={480}
            height={230}
            className="w-[40%] md:w-[480px] ml-[25px] transition-all duration-300"
          />
          <div className="flex flex-col items-center mt-4 text-center">
            <div className="text-[5vw] md:text-[32px] font-bold">
              {t("title")}
            </div>
            <div className="text-[3vw] md:text-[16px] mt-4">{t("content")}</div>
          </div>
          <div className="absolute bottom-[34px] left-0 w-full px-4">
            <hr className="border-t-2 border-gray-400 my-4" />
            <div>
              <div className="text-[4vw] md:text-[18px] text-left font-bold">
                {t("bottomTitle")}
              </div>
              <ul className="ml-5 mt-2 text-[3vw] md:text-[14px] list-disc">
                {Array.isArray(list) ? (
                  list.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>{list}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end w-full md:w-1/2">
          <Image
            src={`/admin/images/error/${status}.svg`}
            alt={`${status} error`}
            width={mainImage.width}
            height={mainImage.height}
            className="w-[70%] md:w-auto  mr-0 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default StatusErrors;
