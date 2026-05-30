const { createErrorResult, ERROR_STATUS, normalizeSourceMetadata } = require("k-parent-core");
const { CURATED_SERVICES } = require("./services");

const DEEP_LINK_BASE = Object.freeze({
  bokjiro: "https://www.bokjiro.go.kr/",
  gov24: "https://www.gov.kr/",
  idolbom: "https://www.idolbom.go.kr/",
  isarang: "https://www.childcare.go.kr/",
});

// Map each curated service to its primary application portal.
const SERVICE_PORTAL = Object.freeze({
  "child-allowance": "bokjiro",
  "parental-benefit": "bokjiro",
  "child-care-allowance": "bokjiro",
  "home-care-allowance": "bokjiro",
  idolbom: "idolbom",
  "after-school": "gov24",
  "childcare-fee": "bokjiro",
  "preschool-tuition": "isarang",
});

function cloneService(service) {
  return {
    ...service,
    requiredDocs: [...service.requiredDocs],
  };
}

function listServices(options = {}) {
  const category = options && options.category ? String(options.category).trim() : null;
  const services = CURATED_SERVICES.filter((service) => !category || service.category === category).map(cloneService);
  return {
    ok: true,
    services,
    metadata: welfareMetadata(),
  };
}

function getService(serviceId) {
  const service = CURATED_SERVICES.find((item) => item.serviceId === serviceId);
  if (!service) {
    return createErrorResult(ERROR_STATUS.NOT_FOUND, `unknown welfare serviceId: ${serviceId}`, {
      serviceId: serviceId || null,
    });
  }
  return {
    ok: true,
    service: cloneService(service),
    metadata: welfareMetadata(),
  };
}

function buildDeepLink(service, params = {}) {
  const resolved = typeof service === "string" ? CURATED_SERVICES.find((s) => s.serviceId === service) : service;
  if (!resolved || !resolved.serviceId) {
    throw new Error("buildDeepLink requires a valid service or serviceId.");
  }

  const portal = SERVICE_PORTAL[resolved.serviceId] || "gov24";
  const base = DEEP_LINK_BASE[portal];
  const query = new URLSearchParams();
  query.set("svcId", resolved.serviceId);
  if (resolved.title) {
    query.set("svcNm", resolved.title);
  }
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  return {
    serviceId: resolved.serviceId,
    portal,
    url: `${base}?${query.toString()}`,
    officialUrl: resolved.officialUrl,
    requiresOfficialSiteHandoff: true,
  };
}

function welfareMetadata() {
  return normalizeSourceMetadata({
    sourceType: "curated",
    sourceName: "k-parent-source-welfare (curated catalog)",
    sourceUrl: "https://www.bokjiro.go.kr/",
  });
}

// Optional live lookup is gated behind an env key. Tests stay offline and never
// exercise this path. Returns a MISSING_CONFIG error result when not configured.
function isLiveLookupAvailable(env = process.env) {
  return Boolean(env && env.KSKILL_DATAGOKR_KEY);
}

function describeLiveLookup(env = process.env) {
  if (!isLiveLookupAvailable(env)) {
    return createErrorResult(
      ERROR_STATUS.MISSING_CONFIG,
      "live welfare lookup requires KSKILL_DATAGOKR_KEY; using curated catalog instead.",
      { configKey: "KSKILL_DATAGOKR_KEY" }
    );
  }
  return { ok: true, configured: true };
}

module.exports = {
  DEEP_LINK_BASE,
  SERVICE_PORTAL,
  listServices,
  getService,
  buildDeepLink,
  isLiveLookupAvailable,
  describeLiveLookup,
};
