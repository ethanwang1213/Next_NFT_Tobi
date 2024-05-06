import { auth } from "fetchers/firebase/client";

export const fetchShowcases = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "/backend/api/functions/native/admin/showcases",
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

export const createShowcase = async (data) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/showcases`,
      {
        method: "POST",
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

export const deleteShowcase = async (id) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/showcases/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      return true;
    } else {
      console.error("Error:", result);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const updateShowcase = async (id, data) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/showcases/${id}`,
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
