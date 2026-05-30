"use strict";

const { ERROR_STATUS } = require("k-parent-core");
const parse = require("./parse");

const BASE_URL = "http://openapi.seoul.go.kr:8088";

const RESERVATION_SERVICES = [
  "ListPublicReservationCulture",
  "ListPublicReservationEducation",
  "ListPublicReservationSport",
];

async function fetchReservations(options = {}) {
  const apiKey = options.apiKey || process.env.KSKILL_SEOUL_KEY;
  if (!apiKey) {
    const err = new Error(
      "Seoul open data API key is required (set KSKILL_SEOUL_KEY or pass options.apiKey)"
    );
    err.status = ERROR_STATUS.MISSING_CONFIG;
    throw err;
  }

  if (options.payload) {
    return options.payload;
  }

  const service = options.service || RESERVATION_SERVICES[0];
  const start = options.start || 1;
  const end = options.end || 1000;

  const fetchImpl = options.fetchImpl || global.fetch;
  const url = `${BASE_URL}/${apiKey}/json/${service}/${start}/${end}/`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    const err = new Error(`Seoul API request failed with status ${response.status}`);
    err.status = ERROR_STATUS.UPSTREAM_ERROR;
    throw err;
  }
  return response.json();
}

module.exports = {
  RESERVATION_SERVICES,
  fetchReservations,
  ...parse,
};
