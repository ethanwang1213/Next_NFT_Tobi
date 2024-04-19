import clsx from "clsx";
import { fetchSamples, deleteSamples } from "fetchers/SampleActions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency, formatDateToLocal } from "ui/atoms/Formatters";
import Button from "../../atoms/Button";
import { formatSampleStatus } from "./StatusDropdownSelect";

const SampleTable = ({ filters }) => {
  // sample data
  const [samples, setSamples] = useState([]);

  // active sorting column
  const [sortOrder, setSortOrder] = useState(0);

  // selected sample id array
  const [selSampleIds, setSelSampleIds] = useState([]);

  // fetch samples from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSamples();
        setSamples(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSortingDirection = (index) => {
    // determine sorting direction
    let order = index;
    if (Math.abs(sortOrder) == index) {
      order = -sortOrder;
    }

    // sort sample data
    switch (order) {
      case -1:
        samples.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : a.status - b.status,
        );
        break;

      case 1:
        samples.sort((a, b) =>
          a.name < b.name ? 1 : a.name > b.name ? -1 : a.status - b.status,
        );
        break;

      case -2:
        samples.sort((a, b) =>
          a.price != b.price ? a.price - b.price : a.status - b.status,
        );
        break;

      case 2:
        samples.sort((a, b) =>
          b.price != a.price ? b.price - a.price : a.status - b.status,
        );
        break;

      case -4:
        samples.sort((a, b) =>
          a.saleStartDate < b.saleStartDate
            ? -1
            : a.saleStartDate > b.saleStartDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 4:
        samples.sort((a, b) =>
          a.saleStartDate < b.saleStartDate
            ? 1
            : a.saleStartDate > b.saleStartDate
              ? -1
              : a.status - b.status,
        );
        break;

      case -5:
        samples.sort((a, b) =>
          a.saleEndDate < b.saleEndDate
            ? -1
            : a.saleEndDate > b.saleEndDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 5:
        samples.sort((a, b) =>
          a.saleEndDate < b.saleEndDate
            ? 1
            : a.saleEndDate > b.saleEndDate
              ? -1
              : a.status - b.status,
        );
        break;

      case -6:
        samples.sort((a, b) =>
          a.saleQuantity != b.saleQuantity
            ? a.saleQuantity - b.saleQuantity
            : a.status - b.status,
        );
        break;

      case 6:
        samples.sort((a, b) =>
          b.saleQuantity != a.saleQuantity
            ? b.saleQuantity - a.saleQuantity
            : a.status - b.status,
        );
        break;

      case -7:
        samples.sort((a, b) =>
          a.createDate < b.createDate
            ? -1
            : a.createDate > b.createDate
              ? 1
              : a.status - b.status,
        );
        break;

      case 7:
        samples.sort((a, b) =>
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

    // set state
    setSortOrder(order);
  };

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
                    {formatSampleStatus(sample.status)}
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
                  const result = await deleteSamples(selSampleIds);
                  if (result == true) {
                    const data = await fetchSamples();
                    setSelSampleIds([]);
                    setSamples(data);
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
