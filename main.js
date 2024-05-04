import { argv } from "node:process";

import { crawlPage } from "./crawl.js";

const main = async () => {
  if (argv.length < 3) {
    console.log("Error: no base_url argument was provided");
    return;
  }

  if (argv.length > 3) {
    console.log("Error: too many arguments were provided");
    return;
  }

  const baseURL = argv[2];
  console.log(`>>> Starting web crawler at baseURL: ${baseURL}...`);
  const pages = await crawlPage({ baseURL });
  console.log(`>>> Finished crawling ${Object.keys(pages).length} pages`);
};

main();
