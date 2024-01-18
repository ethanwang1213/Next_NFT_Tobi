import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import Image from "next/image";
import { formatDateToLocal, formatCurrency } from "ui/atoms/utils";
import PublishPopupMenu from "ui/molecules/publish-popup-menu";

export default function SampleTable() {
  const samples = [
    {
      id: 1,
      image_url: "/admin/images/sample-thumnail/Rectangle-61.png",
      name: "Inutanuki - GORAKUBA!",
      position: "Highschool",
      amount: 1500,
      publish_setting: "公開中",
      sales_status: "販売中",
      release_date: "2023/05/14 13:24",
      sales_start_date: "2023/05/14 13:24",
      sales_end_date: "2023/05/14 13:24",
    },
    {
      id: 2,
      image_url: "/admin/images/sample-thumnail/Rectangle-58.png",
      name: "Pento - GORAKUBA!",
      position: "Highschool",
      amount: 1500,
      publish_setting: "公開中",
      sales_status: "販売終了",
      release_date: "2023/05/14 13:24",
      sales_start_date: "2023/05/14 13:24",
      sales_end_date: "2023/05/14 13:24",
    },
    {
      id: 3,
      image_url: "/admin/images/sample-thumnail/Rectangle-60.png",
      name: "Encho. - GORAKUBA! ",
      position: "Highschool",
      amount: 1500,
      publish_setting: "非公開",
      sales_status: "",
      release_date: "",
      sales_start_date: "",
      sales_end_date: "",
    },
    {
      id: 4,
      image_url: "/admin/images/sample-thumnail/Rectangle-59.png",
      name: "Tenri Kannagi 2023",
      position: "",
      amount: 2500,
      publish_setting: "予約公開",
      sales_status: "",
      release_date: "2023/05/14 13:24",
      sales_start_date: "2023/05/14 13:24",
      sales_end_date: "2023/05/14 13:24",
    },
    {
      id: 5,
      image_url: "/admin/images/sample-thumnail/Rectangle-61.png",
      name: "SAMPLEITEM1234",
      position: "",
      amount: 0,
      publish_setting: "下書き",
      sales_status: "",
      release_date: "",
      sales_start_date: "",
      sales_end_date: "",
    },
    {
      id: 6,
      image_url: "/admin/images/sample-thumnail/Rectangle-61.png",
      name: "SAMPLEITEM1235",
      position: "",
      amount: 0,
      publish_setting: "下書き",
      sales_status: "",
      release_date: "",
      sales_start_date: "",
      sales_end_date: "",
    },
    {
      id: 7,
      image_url: "/admin/images/sample-thumnail/Rectangle-61.png",
      name: "SAMPLEITEM1236",
      position: "",
      amount: 0,
      publish_setting: "下書き",
      sales_status: "",
      release_date: "",
      sales_start_date: "",
      sales_end_date: "",
    },
  ];

  const [isAscending, setIsAscending] = useState(true);

  const toggleSortingDirection = () => {
    setIsAscending(!isAscending);
  };

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0">
          <table className="min-w-full text-[#717171]">
            <thead className="">
              <tr className="text-base/[56px] bg-[#1779DE] text-white">
                <th
                  scope="col"
                  className="w-76 py-0 text-center justify-center min-w-48"
                  onClick={toggleSortingDirection}
                >
                  アイテム名
                  <span className="ml-4 text-xs cursor-pointer">
                    {isAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th scope="col" className="w-20 py-0">
                  <div className="flex text-center justify-center">
                    金額
                    <Image
                      src="/admin/images/info-icon.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="ml-2"
                      id="amount-tooltip-anchor"
                      data-tooltip-id="amount-tooltip"
                      data-tooltip-content="現在は¥0のみ設定が可能です。"
                    />
                  </div>
                  <Tooltip
                    id="amount-tooltip"
                    anchorSelect="#amount-tooltip-anchor"
                    place="bottom-start"
                    opacity={100}
                    offset={-16}
                    noArrow={true}
                    style={{
                      backgroundColor: "#07396C",
                      color: "#FFF",
                      fontSize: "12px",
                      lineHeight: "18px",
                      paddingLeft: "16px",
                      paddingRight: "8px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      marginLeft: "-16px",
                      borderRadius: "8px",
                    }}
                  />
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  公開設定
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  販売状況
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  公開日
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  販売開始日
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  販売終了日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {samples?.map((sample) => (
                <tr
                  key={sample.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 justify-start">
                      <Image
                        src={sample.image_url}
                        className="rounded-full"
                        width={80}
                        height={80}
                        alt={`${sample.name}'s profile picture`}
                      />
                      {sample.name}
                      <br />
                      {sample.position}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {/* {formatCurrency(sample.amount)} */}
                    {sample.amount}
                  </td>
                  <PublishPopupMenu 
                    statusString={sample.publish_setting}
                  />
                  <td className="whitespace-nowrap px-3 py-3 text-center justify-center">
                    {sample.sales_status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {/* {formatDateToLocal(sample.release_date)} */}
                    {sample.release_date && (
                      <>
                        {sample.release_date.split(" ")[0]} <br />
                        {sample.release_date.split(" ")[1]}
                      </>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {sample.sales_start_date && (
                      <>
                        {sample.sales_start_date.split(" ")[0]} <br />
                        {sample.sales_start_date.split(" ")[1]}
                      </>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {sample.sales_end_date && (
                      <>
                        {sample.sales_end_date.split(" ")[0]} <br />
                        {sample.sales_end_date.split(" ")[1]}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
