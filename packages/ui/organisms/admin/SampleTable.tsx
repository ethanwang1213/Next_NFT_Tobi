import Image from "next/image";
import ReleaseStatus from "ui/organisms/admin/ReleaseStatus";
import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { fetchSamples } from "ui/organisms/admin/actions/SampleActions";
import { formatDateToLocal, formatCurrency } from "ui/atoms/Formatters";
import Link from "next/link";

export default function SampleTable({ filters }) {
  const [isAscending, setIsAscending] = useState(true);
  const [samples, setSamples] = useState(fetchSamples());

  const toggleSortingDirection = () => {
    setIsAscending(!isAscending);
    const sortedSamples = [...samples].sort((a, b) => {
      if (isAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setSamples(sortedSamples);
  };

  // Apply filters when they change
  useEffect(() => {
    const filteredData = samples.filter((sample) => {
      return true; // Return false if the sample should be filtered out
    });
    setSamples(filteredData);
  }, [filters]);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0">
          <table className="min-w-full text-[#717171]">
            <thead className="">
              <tr className="text-base/[56px] bg-[#1779DE] text-white">
                <th className="w-40"></th>
                <th
                  scope="col"
                  className="w-60 py-0 text-left"
                  onClick={toggleSortingDirection}
                >
                  アイテム名
                  <span className="ml-4 text-xs cursor-pointer">
                    {isAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th scope="col" className="py-0 w-38">
                  <div className="flex text-center justify-center relative">
                    金額
                    <Image
                      src="/admin/images/info-icon.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="ml-16 -mt-2 absolute top-2/4"
                      id="price-tooltip-anchor"
                      data-tooltip-id="price-tooltip"
                      data-tooltip-content="現在は¥0のみ設定が可能です。"
                    />
                  </div>
                  <Tooltip
                    id="price-tooltip"
                    data-tooltip-id="#price-tooltip-anchor"
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
                <th scope="col" className="w-38 py-0 text-center">
                  公開設定
                </th>
                <th scope="col" className="w-38 py-0 text-center">
                  販売状況
                </th>
                <th scope="col" className="w-38 py-0 text-center">
                  公開日
                </th>
                <th scope="col" className="w-38 py-0 text-center">
                  販売開始日
                </th>
                <th scope="col" className="w-38 py-0 text-center">
                  販売終了日
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {samples?.map((sample) => (
                <tr key={sample.id} className="w-full border-b py-3 text-sm">
                  <td className="whitespace-nowrap py-3 text-right pr-8">
                    <Link href={`/items/detail?id=${sample.id}`}>
                      <Image
                        src={sample.image_url}
                        className="rounded-full inline-block"
                        width={80}
                        height={80}
                        alt={`${sample.name}'s profile picture`}
                      />
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-3">
                    <Link href={`/items/detail?id=${sample.id}`}>
                      {sample.name}
                      <br />
                      {sample.category}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center justify-center">
                    {formatCurrency(sample.price)}
                  </td>
                  <td className="text-center">
                    <ReleaseStatus
                      value={sample.release_status}
                      date={sample.release_date}
                    />
                  </td>
                  <td className="whitespace-nowrap p-3 text-center justify-center">
                    {sample.sales_status.length ? sample.sales_status : "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {sample.release_date.length ? (
                      <>
                        {sample.release_date.split(" ")[0]} <br />
                        {sample.release_date.split(" ")[1]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {sample.sales_start_date.length ? (
                      <>
                        {sample.sales_start_date.split(" ")[0]} <br />
                        {sample.sales_start_date.split(" ")[1]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3  text-center justify-center">
                    {sample.sales_end_date.length ? (
                      <>
                        {sample.sales_end_date.split(" ")[0]} <br />
                        {sample.sales_end_date.split(" ")[1]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
