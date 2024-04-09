import clsx from "clsx";
import { fetchSamples } from "hooks/SampleActions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "ui/atoms/Formatters";

const SampleTable = ({ filters }) => {
  const [samples, setSamples] = useState([]);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSamples(); // Assuming sampleData is a promise
        setSamples(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSortingDirection = (index) => {
    let order = index;
    if (Math.abs(sortOrder) == index) {
      order = -sortOrder;
    }

    setSortOrder(order);

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
          a.price - b.price != 0 ? a.price - b.price : a.status - b.status,
        );
        break;

      case 2:
        samples.sort((a, b) =>
          b.price - a.price != 0 ? b.price - a.price : a.status - b.status,
        );

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
          a.saleQuantity - b.saleQuantity != 0
            ? a.saleQuantity - b.saleQuantity
            : a.status - b.status,
        );
        break;

      case 6:
        samples.sort((a, b) =>
          b.saleQuantity - a.saleQuantity != 0
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
  };

  const statusString = (status) => {
    let value;
    switch (status) {
      case 1:
        value = "Draft";
        break;
      case 2:
        value = "Private";
        break;
      case 3:
        value = "Viewing Only";
        break;
      case 4:
        value = "On Sale";
        break;
      case 5:
        value = "Unlisted";
        break;
      case 6:
        value = "Scheduled Publishing";
        break;
      case 7:
        value = "Scheduled for Sale";
        break;
      default:
        value = "";
        break;
    }
    return value;
  };

  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 pt-0">
          <table className="min-w-full text-[#717171]">
            <thead className="">
              <tr className="text-base/[56px] bg-[#1779DE] text-white">
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
                    <input type="checkbox" className="w-4 h-4" />
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
                      />
                      <span className="inline-block">{sample.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-center justify-center">
                    {formatCurrency(sample.price)}
                  </td>
                  <td className="p-3 text-center justify-center">
                    {statusString(sample.status)}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {sample.saleStartDate.length ? sample.saleStartDate : "-"}
                  </td>
                  <td className="px-3 py-3  text-center justify-center">
                    {sample.saleEndDate.length ? sample.saleEndDate : "-"}
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
                    {sample.createDate.length ? sample.createDate : "-"}
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
};

export { SampleTable };
