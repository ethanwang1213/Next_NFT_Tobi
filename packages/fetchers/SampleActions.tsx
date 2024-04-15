import { auth } from "fetchers/firebase/client";

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
    const result = await response.json();
    if (result.status == "success") {
      return result.data;
    } else {
      console.log("Error:", result.status);
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
    if (result.status == "success") {
      if (result.data.result == "deleted") {
        return true;
      } else {
        console.error("Error:", result.data.result);
        return false;
      }
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const fetchSampleItem = async (id) => {
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
    if (result.status == "success") {
      return result.data;
    } else {
      console.error("Error:", result.data);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const updateSampleItem = async (data) => {
  try {
    console.log(
      JSON.stringify({
        ...data,
      }),
    );
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/samples/${data.id}`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      if (result.data == "updated") {
        return true;
      } else {
        console.error("Error:", result.data);
        return false;
      }
    } else {
      console.error("Error:", result.status);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
