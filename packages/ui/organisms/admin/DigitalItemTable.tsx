import clsx from "clsx";
import { useLoading } from "contexts/LoadingContext";
import useRestfulAPI from "hooks/useRestfulAPI";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "ui/atoms/Button";
import { formatCurrency, formatDateToLocal } from "ui/atoms/Formatters";
import { getDigitalItemStatusTitle } from "ui/types/adminTypes";
import { FilterItem } from "./DigitalItemFilterMenu";

export enum DigitalItemTableColumn {
  Name = 1,
  Price,
  Status,
  Minted,
  CreationDate,
  DigitalItemTableColumnCount,
  searchTerm,
}

const DigitalItemTable = (filters: {
  filterArray: boolean[];
  price: { from: number; to: number };
  statusArray: boolean[];
  createDate: { from: Date; to: Date };
  searchTerm: string;
}) => {
  const apiUrl = "native/admin/digital_items";
  const router = useRouter();
  const { setLoading } = useLoading();
  const {
    data: digitalItems,
    dataRef,
    loading,
    setData,
    getData,
    deleteData,
  } = useRestfulAPI(apiUrl);

  useEffect(() => {
    const channel = new BroadcastChannel("dataUpdateChannel");

    const handleMessage = (event: MessageEvent) => {
      if (event.data === "dataUpdated") {
        getData(apiUrl);
      }
    };
    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // active sorting column
  const [sortOrder, setSortOrder] = useState(0);

  // selected digital item id array
  const [selDigitalItemIds, setSelDigitalItemIds] = useState([]);

  const applySearchFilter = (items) => {
    return items.filter((item) => {
      if (!item.name) {
        return false;
      }
      return item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    });
  };

  const applySort = (sortKey, sortData) => {
    // sort digital items
    const newData = [...sortData];
    switch (sortKey) {
      case -DigitalItemTableColumn.Name:
        newData.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : a.status - b.status,
        );
        break;

      case DigitalItemTableColumn.Name:
        newData.sort((a, b) =>
          a.name < b.name ? 1 : a.name > b.name ? -1 : a.status - b.status,
        );
        break;

      case -DigitalItemTableColumn.Price:
        newData.sort((a, b) =>
          a.price != b.price ? a.price - b.price : a.status - b.status,
        );
        break;

      case DigitalItemTableColumn.Price:
        newData.sort((a, b) =>
          b.price != a.price ? b.price - a.price : a.status - b.status,
        );
        break;

      case -DigitalItemTableColumn.Minted:
        newData.sort((a, b) =>
          a.saleQuantity != b.saleQuantity
            ? a.saleQuantity - b.saleQuantity
            : a.status - b.status,
        );
        break;

      case DigitalItemTableColumn.Minted:
        newData.sort((a, b) =>
          b.saleQuantity != a.saleQuantity
            ? b.saleQuantity - a.saleQuantity
            : a.status - b.status,
        );
        break;

      case -DigitalItemTableColumn.CreationDate:
        newData.sort((a, b) =>
          a.createDate < b.createDate
            ? -1
            : a.createDate > b.createDate
              ? 1
              : a.status - b.status,
        );
        break;

      case DigitalItemTableColumn.CreationDate:
        newData.sort((a, b) =>
          a.createDate < b.createDate
            ? 1
            : a.createDate > b.createDate
              ? -1
              : a.status - b.status,
        );
        break;

      default:
        break;
    }

    return newData;
  };

  const applyFilter = (filterKey: number, filterData: any[]) => {
    let newData = [];
    switch (filterKey) {
      case FilterItem.Price: // price
        newData = filterData.filter((value) => {
          if (value.price === null) return false;
          return (
            value.price >= filters.price.from && value.price <= filters.price.to
          );
        });
        break;

      case FilterItem.Status: // status
        newData = filterData.filter((value) => {
          return filters.statusArray[value.status - 1];
        });
        break;

      case FilterItem.CreationDate: // Creation Date
        newData = filterData.filter((value) => {
          if (value.createDate === null) return false;

          const dateValue = new Date(value.createDate);

          const fromDate = new Date(filters.createDate.from);
          const toDate = new Date(filters.createDate.to);

          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);
          dateValue.setHours(0, 0, 0, 0);

          return dateValue >= fromDate && dateValue <= toDate;
        });
        break;

      default:
        newData = [...filterData];
        break;
    }

    return newData;
  };

  const toggleSortingDirection = (index) => {
    // determine sorting direction
    let order = index;
    if (Math.abs(sortOrder) == index) {
      order = -sortOrder;
    }

    // set state
    setSortOrder(order);
  };

  const t = useTranslations("Item");

  useEffect(() => {
    if (!dataRef.current) return;

    let newData = [...dataRef.current];
    filters.filterArray.forEach((element, index) => {
      if (element) {
        newData = applyFilter(index, newData);
      }
    });

    if (filters.searchTerm) {
      newData = applySearchFilter(newData);
    }

    newData = applySort(sortOrder, newData);
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortOrder]);

  useEffect(() => {
    setLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 pt-0">
          <table className="min-w-[980px] w-full text-secondary">
            <thead className="">
              <tr className="text-base/[56px] bg-primary text-white">
                <th className="min-w-8"></th>
                <th scope="col" className="min-w-40 w-40 py-0"></th>
                <th
                  scope="col"
                  className="min-w-60 w-60 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.Name)
                  }
                >
                  {t("ItemName")}
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == DigitalItemTableColumn.Name
                        ? "inline"
                        : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -DigitalItemTableColumn.Name ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="py-0 min-w-24 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.Price)
                  }
                >
                  {t("Price")}
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == DigitalItemTableColumn.Price
                        ? "inline"
                        : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -DigitalItemTableColumn.Price ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th scope="col" className="w-28 py-0 text-center">
                  {t("Status")}
                </th>
                <th
                  scope="col"
                  className="min-w-32 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.Minted)
                  }
                >
                  {t("Minted")}
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == DigitalItemTableColumn.Minted
                        ? "inline"
                        : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -DigitalItemTableColumn.Minted ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-40 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.CreationDate)
                  }
                >
                  {t("CreationDate")}
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == DigitalItemTableColumn.CreationDate
                        ? "inline"
                        : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -DigitalItemTableColumn.CreationDate
                          ? 180
                          : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {digitalItems?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center pt-28">
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/admin/images/png/no-item.png"
                        alt="No items"
                        width={600}
                        height={300}
                      />
                      <p className="mt-20 text-xl text-black font-semibold">
                        {t("NoItemMessage")}
                      </p>
                      <Button
                        onClick={() => router.push("/workspace?trigger=true")}
                        className="mt-16 bg-primary-800 text-[24px] text-white py-2 px-4 rounded-full"
                      >
                        {t("CreateNewItem")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                digitalItems?.map((item) => (
                  <tr
                    key={item.id}
                    className="w-full border-b py-3 text-sm hover:bg-primary-100"
                  >
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selDigitalItemIds.includes(item.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const itemId = item.id;

                          setSelDigitalItemIds((prevIds) => {
                            if (checked) {
                              return [...prevIds, itemId];
                            } else {
                              return prevIds.filter((id) => id !== itemId);
                            }
                          });
                        }}
                      />
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/items/detail?id=${item.id}`}
                        className="flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={item.thumbUrl}
                          className="rounded inline-block mx-2 h-[80px] object-contain"
                          width={80}
                          height={80}
                          alt={`${item.name}'s profile picture`}
                          unoptimized
                        />
                      </Link>
                    </td>
                    <td className="px-3">
                      <Link
                        href={`/items/detail?id=${item.id}`}
                        className="flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="inline-block w-60 text-left break-words hover:underline">
                          {item.name ? item.name : t("NoName")}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center justify-center">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-3 text-center justify-center">
                      {getDigitalItemStatusTitle(item.status, t)}
                    </td>
                    <td className="px-3 py-3 text-center justify-center">
                      <span>{item.mintedCount} / </span>
                      {item.quantityLimit != null ? (
                        <span>{item.quantityLimit}</span>
                      ) : (
                        <span className="text-[20px] text-start">∞</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center justify-center">
                      {!!item.createDate
                        ? formatDateToLocal(item.createDate)
                        : "-"}
                    </td>
                    <td></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {selDigitalItemIds.length > 0 ? (
            <div className="fixed bottom-5 right-5 w-[472px] h-14 flex justify-between">
              <Button
                className="w-[208px] h-14 rounded-[30px] bg-[#009FF5] text-white text-2xl leading-[56px] text-center"
                onClick={() => setSelDigitalItemIds([])}
              >
                {t("Cancel")}
              </Button>
              <Button
                className="w-[208px] h-14 rounded-[30px] bg-[#FB0000] px-7"
                onClick={async () => {
                  const result = await deleteData(apiUrl, {
                    digitalItemIds: selDigitalItemIds,
                  });
                  if (result) {
                    setSelDigitalItemIds([]);
                    getData(apiUrl);
                  }
                }}
              >
                <div className="flex gap-3 items-center justify-center">
                  <Image
                    src="/admin/images/recyclebin-icon.svg"
                    alt="icon"
                    width={32}
                    height={32}
                  />
                  <span className="text-white text-2xl leading-[56px] text-center">
                    {t("Delete")}
                  </span>
                </div>
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export { DigitalItemTable };
