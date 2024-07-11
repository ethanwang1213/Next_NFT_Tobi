import clsx from "clsx";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "ui/atoms/Button";
import { formatCurrency, formatDateToLocal } from "ui/atoms/Formatters";
import { FilterItem } from "./DigitalItemFilterMenu";
import { getDigitalItemStatusTitle } from "ui/types/adminTypes";

export enum DigitalItemTableColumn {
  Name = 1,
  Price,
  Status,
  Minted,
  CreationDate,
  DigitalItemTableColumnCount,
}

const DigitalItemTable = (filters: {
  filterArray: boolean[];
  price: { from: number; to: number };
  statusArray: boolean[];
  createDate: { from: Date; to: Date };
}) => {
  const apiUrl = "native/admin/digital_items";
  const {
    data: digitalItems,
    dataRef,
    setData,
    getData,
    deleteData,
  } = useRestfulAPI(apiUrl);

  // active sorting column
  const [sortOrder, setSortOrder] = useState(0);

  // selected digital item id array
  const [selDigitalItemIds, setSelDigitalItemIds] = useState([]);

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
          return (
            dateValue >= filters.createDate.from &&
            dateValue <= filters.createDate.to
          );
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

  useEffect(() => {
    if (!dataRef.current) return;

    let newData = [...dataRef.current];
    filters.filterArray.forEach((element, index) => {
      if (element) {
        newData = applyFilter(index, newData);
      }
    });
    newData = applySort(sortOrder, newData);
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortOrder]);

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="bg-gray-50 pt-0">
          <table className="min-w-full text-secondary">
            <thead className="">
              <tr className="text-base/[56px] bg-primary text-white">
                <th className="min-w-10"></th>
                <th
                  scope="col"
                  className="min-w-80 w-80 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.Name)
                  }
                >
                  Item Name
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
                  Price
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
                  Status
                </th>
                <th
                  scope="col"
                  className="min-w-32 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() =>
                    toggleSortingDirection(DigitalItemTableColumn.Minted)
                  }
                >
                  Minted
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
                  Creation Date
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
              {digitalItems?.map((item) => (
                <tr key={item.id} className="w-full border-b py-3 text-sm">
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
                      className="flex items-center"
                    >
                      <Image
                        src={item.thumbnail}
                        className="rounded inline-block mx-2"
                        width={80}
                        height={80}
                        alt={`${item.name}'s profile picture`}
                        unoptimized
                      />
                      <span className="inline-block">{item.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-center justify-center">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-3 text-center justify-center">
                    {getDigitalItemStatusTitle(item.status)}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    <span>{item.mintedCount} / </span>
                    {item.quantityLimit != -1 ? (
                      <span>{item.quantityLimit}</span>
                    ) : (
                      <span className="text-[20px]">∞</span>
                    )}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {!!item.createDate && item.createDate.length
                      ? formatDateToLocal(item.createDate)
                      : "-"}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          {selDigitalItemIds.length > 0 ? (
            <div className="fixed bottom-5 right-5 w-[472px] h-14 flex justify-between">
              <Button
                className="w-[208px] h-14 rounded-[30px] bg-[#009FF5] text-white text-2xl leading-[56px] text-center"
                onClick={() => setSelDigitalItemIds([])}
              >
                CANCEL
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
                <div className="flex justify-between">
                  <Image
                    src="/admin/images/recyclebin-icon.svg"
                    alt="icon"
                    width={32}
                    height={32}
                  />
                  <span className="text-white text-2xl leading-[56px] text-center">
                    DELETE
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
