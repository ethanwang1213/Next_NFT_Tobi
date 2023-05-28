type ResponsiveMode = "LG" | "MD" | "SM";

const getResponsiveMode: (innerWidth: number) => ResponsiveMode = (
  innerWidth: number
) => {
  if (innerWidth > 960) {
    return "LG";
  }
  if (innerWidth > 520) {
    return "MD";
  }
  return "SM";
};

export default getResponsiveMode;
