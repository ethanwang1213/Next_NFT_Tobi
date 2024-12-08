import useRestfulAPI from "./useRestfulAPI";

const useFinalizeModel = () => {
  const { error, postData: finalizeModel } = useRestfulAPI(null);

  const postData = async (id: number, data) => {
    const apiUrl = `native/items/${id}/finalize-model`;
    return finalizeModel(apiUrl, data);
  };

  return [error, postData] as const;
};

export default useFinalizeModel;
