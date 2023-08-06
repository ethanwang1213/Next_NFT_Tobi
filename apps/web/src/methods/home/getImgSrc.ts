const getImgSrc = (phase: number, name: string, isPc: boolean) => {
  const device = isPc ? "pc" : "sp";
  const getExt =
    (phase === 0 && name === '1')
      || (phase === 1 && (name === '1' || name === '2' || name === '3'))
      || (phase === 3 && (name === "mesh1" || name === 'mesh2' || name === 'mesh3'))
      ? '.png' : '.webp'

  return `/home/top${phase}/${device}/${name}${getExt}`;
};

export default getImgSrc;
