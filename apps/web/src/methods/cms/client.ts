import { createClient } from "microcms-js-sdk";

export default createClient({
  serviceDomain: "tobira-cms",
  apiKey: process.env["API_KEY"]!,
});
