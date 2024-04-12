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
      "/backend/api/functions/native/admin/samples",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );
    const jsonResult = await response.json();
    if (jsonResult.status == "success") {
      return jsonResult.data;
    } else {
      console.log("Error:", jsonResult.status);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const deleteSamples = async (ids) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "/backend/api/functions/native/admin/samples",
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

export const fetchSampleItem = async (id) => {
  return {
    name: "Inutanuki - GORAKUBA! Highschool", // sample name
    description: "sample description, max 1300 characters", // sample description, max 1300 characters
    defaultThumbnailUrl: "/admin/images/sample-thumnail/Rectangle-61.png",
    customThumbnailUrl: "",
    isCustomThumbnailSelected: false,
    price: 0,
    status: 6, // draft/private/viewing only/on sale/unlisted/scheduled publishing/scheduled for sale
    startDate: "", // available in 2 cases of 'scheduled publishing' and 'scheduled for sale'
    endDate: "", // available in 2 cases of 'scheduled publishing' and 'scheduled for sale'
    quantityLimit: 100,
    license: "license string",
    copyrights: ["content", "digitalitem"],
  };
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/samples/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    // return "failed";
    return {
      name: "Inutanuki - GORAKUBA! Highschool", // sample name
      description: "sample description, max 1300 characters", // sample description, max 1300 characters
      defaultThumbnailUrl: "/admin/images/sample-thumnail/Rectangle-61.png",
      customThumbnailUrl: "",
      isCustomThumbnailSelected: false,
      price: 0,
      status: 6, // draft/private/viewing only/on sale/unlisted/scheduled publishing/scheduled for sale
      startDate: "", // available in 2 cases of 'scheduled publishing' and 'scheduled for sale'
      endDate: "", // available in 2 cases of 'scheduled publishing' and 'scheduled for sale'
      quantityLimit: 100,
      license: "license string",
      copyrights: ["content", "digitalitem"],
    };
  }
};
