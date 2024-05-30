import { auth } from "fetchers/firebase/client";
import { useEffect, useRef, useState } from "react";

const useRestfulAPI = (url) => {
  const apiUrlPrefix = "/backend/api/functions/";
  const [data, setData] = useState(null); // State for data
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error handling

  const dataRef = useRef(null);

  const getData = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const token = await auth.currentUser!.getIdToken();
      const response = await fetch(`${apiUrlPrefix}${url}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const jsonData = await response.json();
      if (jsonData.status === "success") {
        setData(jsonData.data);
        dataRef.current = jsonData.data;
      } else {
        setError(jsonData.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (url, data, dataObjectNames = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = await auth.currentUser!.getIdToken();
      const response = await fetch(`${apiUrlPrefix}${url}`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const jsonData = await response.json();
      if (jsonData.status === "success") {
        if (dataObjectNames == null) {
          return jsonData.data;
        } else {
          let returnData = jsonData.data;
          dataObjectNames.forEach((objectName) => {
            returnData = returnData[objectName];
          });
          setData(returnData);
          dataRef.current = returnData;

          return returnData;
        }
      } else {
        setError(jsonData.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const putData = async (url, data, dataObjectNames = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = await auth.currentUser!.getIdToken();
      const response = await fetch(`${apiUrlPrefix}${url}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const jsonData = await response.json();
      if (jsonData.status === "success") {
        if (dataObjectNames == null) {
          return jsonData.data;
        } else {
          let returnData = jsonData.data;
          dataObjectNames.forEach((objectName) => {
            returnData = returnData[objectName];
          });
          setData(returnData);
          dataRef.current = returnData;

          return returnData;
        }
      } else {
        setError(jsonData.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const deleteData = async (url, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = await auth.currentUser!.getIdToken();
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
        body: null,
      };
      if (body !== null) {
        requestOptions.headers["Content-Type"] = "application/json";
        // Assuming `body` is a JSON object, convert it to a JSON string
        requestOptions.body = JSON.stringify(body);
      }
      const response = await fetch(`${apiUrlPrefix}${url}`, requestOptions);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const jsonData = await response.json();
      if (jsonData.status === "success") {
        return true;
      } else {
        setError(jsonData.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const restoreData = () => {
    if (dataRef.current) setData(dataRef.current);
  };

  useEffect(() => {
    if (url == null || url == "") return;
    getData(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    data,
    dataRef,
    loading,
    error,
    setData,
    setLoading,
    getData,
    postData,
    putData,
    deleteData,
    restoreData,
  };
};

export default useRestfulAPI;
