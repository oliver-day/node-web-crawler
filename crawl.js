import jsdom from "jsdom";
const { JSDOM } = jsdom;

const BASE_URL = "https://wagslane.dev";

export const crawlPage = async ({
  baseUrl = BASE_URL,
  currentURL = baseUrl,
  pages = {},
}) => {
  const baseUrlObject = new URL(baseUrl);
  const currentUrlObject = new URL(currentURL);
  if (baseUrlObject.hostname !== currentUrlObject.hostname) {
    console.log(">>> Not crawling external URL: ${currentURL}");
    return pages;
  }

  const normalizedUrl = normalizeURL({ url: currentURL });
  if (pages[normalizedUrl] > 0) {
    console.log(`>>> Already crawled ${currentURL}`);
    pages[normalizedUrl] += 1;
    return pages;
  } else {
    // initialize this page in the map
    // since it doesn't exist yet
    pages[normalizedUrl] = 1;
  }
  console.log(`>>> Crawling ${currentURL}`);
  let html = "";
  try {
    html = await fetchHTML({ currentURL });
  } catch (err) {
    console.log(`${err.message}`);
    return pages;
  }

  // recur through the page's links
  const nextURLs = getURLsFromHTML(html, baseUrl);
  for (const nextURL of nextURLs) {
    pages = await crawlPage({ baseUrl, currentURL: nextURL, pages });
  }

  return pages;
};

const fetchHTML = async ({ currentURL }) => {
  try {
    const response = await fetch(currentURL);
    const headers = response.headers;
    const contentType = headers.get("content-type");

    if (!response.ok) {
      console.log(`${response.status} Error fetching page: ${currentURL}
      ${response.statusText}`);
      return;
    }

    if (!contentType || !contentType.includes("text/html")) {
      console.log(`Error: received non-HTML response when fetching: ${currentURL}
      Received content-type: ${contentType}`);
      return;
    }

    const html = await response.text();
    console.log(`>>> HTML of ${currentURL}:
    ${html}`);
    return html;
  } catch (err) {
    console.log(`${err.message} crawling page: ${currentURL}`);
  }
};

export const getURLsFromHTML = (html, baseURL) => {
  const urls = [];
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");

  for (const anchor of anchors) {
    if (anchor.hasAttribute("href")) {
      let href = anchor.getAttribute("href");

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href;
        urls.push(href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }

  return urls;
};

const removeTrailingSlash = (url) => {
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const normalizeURL = ({ url = "" }) => {
  const urlObject = new URL(url);
  const hostname = urlObject.hostname;
  const pathname = urlObject.pathname;
  const normalizedUrl = `${hostname}${pathname}`;

  return removeTrailingSlash(normalizedUrl);
};
