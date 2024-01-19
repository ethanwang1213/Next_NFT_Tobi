import React, { useState } from "react";
import Image from "next/image";
import { formatDateToLocal, formatCurrency } from "ui/atoms/utils";
import PublishPopupMenu from "ui/molecules/publish-popup-menu";

export default function PackageTable() {
  const packages = [
    {
      id: 1,
      image_url: "/admin/images/package-thumnail/Gorakuba.png",
      name: "THE TITLE OF A PACKAGE",
      publish_setting: "公開中",
      release_date: "2023/05/14 13:24",
      count: 9,
    },
    {
      id: 2,
      image_url: "/admin/images/package-thumnail/Gorakuba.png",
      name: "THE TITLE OF A PACKAGE",
      publish_setting: "公開中",
      release_date: "2023/05/14 13:24",
      count: 9,
    },
    {
      id: 3,
      image_url: "/admin/images/package-thumnail/Gorakuba.png",
      name: "THE TITLE OF A PACKAGE",
      publish_setting: "公開中",
      release_date: "2023/05/14 13:24",
      count: 9,
    },
    {
      id: 4,
      image_url: "/admin/images/package-thumnail/Gorakuba.png",
      name: "THE TITLE OF A PACKAGE",
      publish_setting: "公開中",
      release_date: "2023/05/14 13:24",
      count: 9,
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
                <th scope="col" className="w-64" >
                </th>
                <th
                  scope="col"
                  className="w-24 py-0 text-center justify-center"
                  onClick={toggleSortingDirection}
                >
                  パッケージ名
                  <span className="ml-4 text-xs cursor-pointer">
                    {isAscending ? "▲" : "▼"}
                  </span>
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  公開設定
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  公開日
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  アイテム数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {packages?.map((package_item) => (
                <tr
                  key={package_item.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-2 items-center">
                    <Image
                      src={package_item.image_url}
                      width={260}
                      height={85}
                      alt={`${package_item.name}'s profile picture`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-center">
                    {package_item.name}
                  </td>
                  <PublishPopupMenu
                    statusString={package_item.publish_setting}
                  />
                  <td className="whitespace-nowrap px-3 py-2 text-center justify-center">
                    {/* {formatDateToLocal(sample.release_date)} */}
                    {package_item.release_date && (
                      <>
                        {package_item.release_date.split(" ")[0]} <br />
                        {package_item.release_date.split(" ")[1]}
                      </>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-center justify-center">
                    {package_item.count}
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
