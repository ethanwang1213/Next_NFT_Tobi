import UAParser from "ua-parser-js";

const isiOS = () => {
  const uaParserResult = UAParser(window.navigator.userAgent);
  return uaParserResult.os.name === "iOS";
};

export default isiOS;
