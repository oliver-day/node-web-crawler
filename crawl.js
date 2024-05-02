export const normalizeURL = ({ url = "" }) => {
  const urlObject = new URL(url);
  const hostname = urlObject.hostname;
  const pathname = urlObject.pathname;
  const normalizedUrl = `${hostname}${pathname}`;

  return pathname.endsWith("/") ? normalizedUrl.slice(0, -1) : normalizedUrl;
};
