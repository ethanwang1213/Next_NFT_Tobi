import { auth } from "fetchers/firebase/client";

export const fetchContentsInformation = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "/backend/api/functions/native/admin/content",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      return result.data;
    } else {
      console.log("Error:", result);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const updateContentsInformation = async (data) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/content`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      return result.data;
    } else {
      console.error("Error:", result);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
