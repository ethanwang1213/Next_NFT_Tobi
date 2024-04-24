import React, { useState } from "react";
import Image from "next/image";
import { formatDateToLocal, formatCurrency } from "ui/atoms/Formatters";
import ReleaseStatus from "ui/organisms/admin/ReleaseStatus";
import { fetchPackages } from "hooks/PackageActions";

export default function PackageTable() {
  const [isAscending, setIsAscending] = useState(true);
  const [packages, setPackages] = useState(fetchPackages());

  const toggleSortingDirection = () => {
    setIsAscending(!isAscending);
    const sortedPackages = [...packages].sort((a, b) => {
      if (isAscending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setPackages(sortedPackages);
  };

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0">
          <table className="min-w-full text-secondary">
            <thead className="">
              <tr className="text-base/[56px] bg-primary text-white">
                <th scope="col" className="w-76"></th>
                <th
                  scope="col"
                  className="w-65 py-0 text-center justify-center"
                  onClick={toggleSortingDirection}
                >
                  パッケージ名
                  <span className="ml-4 text-xs cursor-pointer">
                    {isAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th scope="col" className="w-40 py-0 text-center">
                  公開設定
                </th>
                <th scope="col" className="w-112 py-0 text-center">
                  公開日
                </th>
                <th scope="col" className="w-40 py-0 text-center">
                  アイテム数
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {packages?.map((package_item) => (
                <tr
                  key={package_item.id}
                  className="w-full border-b py-3 text-sm h-24"
                >
                  <td className="whitespace-nowrap w-76 pl-3 pr-8 py-1 items-center">
                    <Image
                      src={package_item.image_url}
                      width={260}
                      height={85}
                      alt={`${package_item.name}'s profile picture`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-1 py-2 text-center">
                    {package_item.name}
                  </td>
                  <td className="text-center">
                    <ReleaseStatus
                      value={package_item.release_status}
                      date={package_item.release_date}
                    />
                  </td>
                  <td className="whitespace-nowrap px-1 py-2 text-center justify-center">
                    {/* {formatDateToLocal(sample.release_date)} */}
                    {package_item.release_date.length ? (
                      <>
                        {package_item.release_date.split(" ")[0]} <br />
                        {package_item.release_date.split(" ")[1]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-1 py-2 text-center justify-center">
                    {package_item.count}
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
