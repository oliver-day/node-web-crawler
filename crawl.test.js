import { test, expect } from "@jest/globals";

import { normalizeURL } from "./crawl";

const EXPECTED_NORMALIZED_URL = "blog.boot.dev/path";

test("normalizeURL protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL({ url: input });
  expect(actual).toEqual(EXPECTED_NORMALIZED_URL);
});

test("normalizeURL slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL({ url: input });
  expect(actual).toEqual(EXPECTED_NORMALIZED_URL);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path";
  const actual = normalizeURL({ url: input });
  expect(actual).toEqual(EXPECTED_NORMALIZED_URL);
});

test("normalizeURL http", () => {
  const input = "http://BLOG.boot.dev/path";
  const actual = normalizeURL({ url: input });
  expect(actual).toEqual(EXPECTED_NORMALIZED_URL);
});
