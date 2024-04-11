import { auth } from "fetchers/firebase/client";

const sampleTestData = [
  {
    id: 1,
    name: "Inutanuki - GORAKUBA! Highschool",
    thumbnail: "/admin/images/sample-thumnail/Rectangle-61.png",
    status: 1, // Draft
    price: 1500,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: 100,
    createDate: "2023/12/25",
  },
  {
    id: 2,
    name: "Pento - GORAKUBA! Highschool",
    thumbnail: "/admin/images/sample-thumnail/Rectangle-58.png",
    status: 2, // Private
    price: 1200,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 1,
    quantityLimit: 1,
    createDate: "2023/12/25",
  },
  {
    id: 3,
    thumbnail: "/admin/images/sample-thumnail/Rectangle-60.png",
    name: "Encho. - GORAKUBA! Highschool",
    status: 3, // Viewing Only
    price: 1300,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: -1,
    createDate: "2023/12/25",
  },
  {
    id: 4,
    thumbnail: "/admin/images/sample-thumnail/Rectangle-59.png",
    name: "Tenri Kannagi 2023",
    status: 4, // On Sale
    price: 1600,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: -1,
    createDate: "2023/12/25",
  },
  {
    id: 5,
    thumbnail: "/admin/images/sample-thumnail/Rectangle-61.png",
    name: "SAMPLEITEM1234",
    status: 5, // Unlisted
    price: 1200,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: -1,
    createDate: "2023/12/25",
  },
  {
    id: 6,
    thumbnail: "/admin/images/sample-thumnail/Rectangle-61.png",
    name: "SAMPLEITEM1235",
    status: 6, // Scheduled Publishing
    price: 1200,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: -1,
    createDate: "2023/12/25",
  },
  {
    id: 7,
    thumbnail: "/admin/images/sample-thumnail/Rectangle-61.png",
    name: "SAMPLEITEM1236",
    status: 7, // Scheduled for Sale
    price: 1500,
    saleStartDate: "2023/12/25",
    saleEndDate: "2023/12/25",
    saleQuantity: 10,
    quantityLimit: -1,
    createDate: "2023/12/25",
  },
];

export const fetchSamples = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "/backend/api/functions/admin/samples",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const deleteSamples = async (ids) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "https://asia-northeast1-tobiratory-f6ae1.cloudfunctions.net/admin/samples",
      {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sampleIds: ids,
        }),
      },
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return "failed";
  }
};

export function fetchSampleItem(id) {
  const item = sampleTestData.find((sample) => sample.id == id);
  return item || null; // Return the found item or null if not found
}
