const getExtension = (name: string) => {
  const pos = name.lastIndexOf(".");
  return pos === -1 ? "" : name.slice(pos);
};

export default getExtension;
