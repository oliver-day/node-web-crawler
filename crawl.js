import jsdom from "jsdom";
const { JSDOM } = jsdom;

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

  return urls;
};
