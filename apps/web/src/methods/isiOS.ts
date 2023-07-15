import UAParser from "ua-parser-js";

const isiOS = () => {
  const uaParserResult = UAParser(window.navigator.userAgent);
  console.log(uaParserResult.device)
  return uaParserResult.os.name === "iOS" || uaParserResult.device.model === "iPad";
};

export default isiOS;
