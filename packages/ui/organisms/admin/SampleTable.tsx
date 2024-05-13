import clsx from "clsx";
import useRestfulAPI from "hooks/useRestfulAPI";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency, formatDateToLocal } from "ui/atoms/Formatters";
import Button from "../../atoms/Button";
import { getSampleStatusTitle } from "./StatusDropdownSelect";

const SampleTable = (filters) => {
  const apiUrl = "native/admin/samples";
  const {
    data: samples,
    dataRef,
    setData,
    getData,
    deleteData,
  } = useRestfulAPI(apiUrl);

  // active sorting column
  const [sortOrder, setSortOrder] = useState(0);

  // selected sample id array
  const [selSampleIds, setSelSampleIds] = useState([]);

  const applySort = (sortKey, sortData) => {
    // sort sample data
    const newData = [...sortData];
    switch (sortKey) {
      case -1:
        newData.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : a.status - b.status,
        );
        break;

      case 1:
        newData.sort((a, b) =>
          a.name < b.name ? 1 : a.name > b.name ? -1 : a.status - b.status,
        );
        break;

      case -2:
        newData.sort((a, b) =>
          a.price != b.price ? a.price - b.price : a.status - b.status,
        );
        break;

      case 2:
        newData.sort((a, b) =>
          b.price != a.price ? b.price - a.price : a.status - b.status,
        );
        break;

      case -4:
        newData.sort((a, b) =>
          a.saleStartDate < b.saleStartDate
            ? -1
            : a.saleStartDate > b.saleStartDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 4:
        newData.sort((a, b) =>
          a.saleStartDate < b.saleStartDate
            ? 1
            : a.saleStartDate > b.saleStartDate
              ? -1
              : a.status - b.status,
        );
        break;

      case -5:
        newData.sort((a, b) =>
          a.saleEndDate < b.saleEndDate
            ? -1
            : a.saleEndDate > b.saleEndDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 5:
        newData.sort((a, b) =>
          a.saleEndDate < b.saleEndDate
            ? 1
            : a.saleEndDate > b.saleEndDate
              ? -1
              : a.status - b.status,
        );
        break;

      case -6:
        newData.sort((a, b) =>
          a.saleQuantity != b.saleQuantity
            ? a.saleQuantity - b.saleQuantity
            : a.status - b.status,
        );
        break;

      case 6:
        newData.sort((a, b) =>
          b.saleQuantity != a.saleQuantity
            ? b.saleQuantity - a.saleQuantity
            : a.status - b.status,
        );
        break;

      case -7:
        newData.sort((a, b) =>
          a.createDate < b.createDate
            ? -1
            : a.createDate > b.createDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 7:
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
      case 0: // price
        newData = filterData.filter((value) => {
          if (value.price === null) return false;
          return (
            value.price >= filters.price.from && value.price <= filters.price.to
          );
        });
        break;

      case 1: // status
        newData = filterData.filter((value) => {
          return filters.statusArray[value.status - 1];
        });
        break;

      case 2: // Sale Start Date
        newData = filterData.filter((value) => {
          if (value.saleStartDate === null) return false;
          const dateValue = new Date(value.saleStartDate);
          return (
            dateValue >= filters.saleStartDate.from &&
            dateValue <= filters.saleStartDate.to
          );
        });
        break;

      case 3: // Sale End Date
        newData = filterData.filter((value) => {
          if (value.saleEndDate === null) return false;
          const dateValue = new Date(value.saleEndDate);
          return (
            dateValue >= filters.saleEndDate.from &&
            dateValue <= filters.saleEndDate.to
          );
        });
        break;

      case 5: // Creation Date
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
        <div className="rounded-lg bg-gray-50 pt-0">
          <table className="min-w-full text-secondary">
            <thead className="">
              <tr className="text-base/[56px] bg-primary text-white">
                <th className="min-w-10"></th>
                <th
                  scope="col"
                  className="min-w-80 w-80 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(1)}
                >
                  SAMPLE NAME
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 1 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -1 ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="py-0 min-w-24 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(2)}
                >
                  Price
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 2 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -2 ? 180 : 0
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
                  className="min-w-40 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(4)}
                >
                  Sale Start Date
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 4 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -4 ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-40 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(5)}
                >
                  Sale End Date
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 5 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -5 ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-32 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(6)}
                >
                  Units Sold
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 6 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -6 ? 180 : 0
                      }deg)`,
                    }}
                  >
                    ▼
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-40 py-0 hover:bg-[#1363B6] text-center group relative"
                  onClick={() => toggleSortingDirection(7)}
                >
                  Creation Date
                  <span
                    className={clsx(
                      "absolute right-1 text-xs cursor-pointer group-hover:inline duration-300",
                      Math.abs(sortOrder) == 7 ? "inline" : "hidden",
                    )}
                    style={{
                      top: "50%",
                      transform: `translateY(-45%) ScaleY(0.6) rotate(${
                        sortOrder == -7 ? 180 : 0
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
              {samples?.map((sample) => (
                <tr key={sample.id} className="w-full border-b py-3 text-sm">
                  <td className="py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selSampleIds.includes(sample.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const sampleId = sample.id;

                        setSelSampleIds((prevIds) => {
                          if (checked) {
                            return [...prevIds, sampleId];
                          } else {
                            return prevIds.filter((id) => id !== sampleId);
                          }
                        });
                      }}
                    />
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/items/detail?id=${sample.id}`}
                      className="flex items-center"
                    >
                      <Image
                        src={sample.thumbnail}
                        className="rounded-full inline-block mx-2"
                        width={80}
                        height={80}
                        alt={`${sample.name}'s profile picture`}
                        unoptimized
                      />
                      <span className="inline-block">{sample.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-center justify-center">
                    {formatCurrency(sample.price)}
                  </td>
                  <td className="p-3 text-center justify-center">
                    {getSampleStatusTitle(sample.status)}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {!!sample.saleStartDate && sample.saleStartDate.length
                      ? formatDateToLocal(sample.saleStartDate)
                      : "-"}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {!!sample.saleEndDate && sample.saleEndDate.length
                      ? formatDateToLocal(sample.saleEndDate)
                      : "-"}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    <span>{sample.saleQuantity} / </span>
                    {sample.quantityLimit != -1 ? (
                      <span>{sample.quantityLimit}</span>
                    ) : (
                      <span className="text-[20px]">∞</span>
                    )}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {!!sample.createDate && sample.createDate.length
                      ? formatDateToLocal(sample.createDate)
                      : "-"}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          {selSampleIds.length > 0 ? (
            <div className="fixed bottom-5 right-5 w-[472px] h-14 flex justify-between">
              <Button
                className="w-[208px] h-14 rounded-[30px] bg-[#009FF5] text-white text-2xl leading-[56px] text-center"
                onClick={() => setSelSampleIds([])}
              >
                CANCEL
              </Button>
              <Button
                className="w-[208px] h-14 rounded-[30px] bg-[#FB0000] px-7"
                onClick={async () => {
                  const result = await deleteData(apiUrl, {
                    sampleIds: selSampleIds,
                  });
                  if (result) {
                    setSelSampleIds([]);
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

export { SampleTable };
