import UAParser from "ua-parser-js";

const isMobile = () => {
  const uaParserResult = UAParser(window.navigator.userAgent);
  return uaParserResult.device.type === "mobile";
};

export default isMobile;
