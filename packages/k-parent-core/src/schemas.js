const { createSourceMetadata } = require("./freshness");
const { guardActionCandidate } = require("./guardrails");

const FORBIDDEN_PROFILE_KEYS = [
  "birthDate",
  "birthday",
  "residentRegistrationNumber",
  "rrn",
  "jumin",
  "certificate",
  "certificatePassword",
  "publicServicePassword",
  "password",
  "paymentPassword",
];

function assertNoForbiddenProfileKeys(value, path = "profile") {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const key of Object.keys(value)) {
    if (FORBIDDEN_PROFILE_KEYS.includes(key)) {
      throw new Error(`${path}.${key} is not allowed in K-Parent profile data.`);
    }

    if (value[key] && typeof value[key] === "object" && !Array.isArray(value[key])) {
      assertNoForbiddenProfileKeys(value[key], `${path}.${key}`);
    }
  }
}

function normalizeStringArray(value) {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return [String(value).trim()].filter(Boolean);
}

function normalizeChildProfile(input = {}) {
  assertNoForbiddenProfileKeys(input, "child_profile");

  if (!input.stage && !input.birthYm) {
    throw new Error("child profile requires stage or birthYm.");
  }

  return {
    id: input.id || null,
    parentId: input.parentId || input.parent_id || null,
    birthYm: input.birthYm || input.birth_ym || null,
    stage: input.stage || null,
    schoolCode: input.schoolCode || input.school_code || null,
    institutionId: input.institutionId || input.institution_id || null,
    interests: normalizeStringArray(input.interests),
    allergies: normalizeStringArray(input.allergies),
    allergyNumbers: normalizeStringArray(input.allergyNumbers || input.allergy_numbers).map(Number).filter(Number.isFinite),
  };
}

function normalizeInstitution(input = {}) {
  if (!input.name) {
    throw new Error("institution.name is required.");
  }

  return {
    id: input.id || null,
    type: input.type || "school",
    officialCode: input.officialCode || input.official_code || null,
    educationOfficeCode: input.educationOfficeCode || input.atptOfcdcScCode || null,
    name: input.name,
    address: input.address || input.addr || null,
    latitude: finiteOrNull(input.latitude ?? input.lat),
    longitude: finiteOrNull(input.longitude ?? input.lng),
    source: input.source || null,
    updatedAt: input.updatedAt || input.updated_at || null,
  };
}

function normalizeMeal(input = {}) {
  if (!input.date) {
    throw new Error("meal.date is required.");
  }

  return {
    date: input.date,
    mealType: input.mealType || input.meal_type || null,
    institution: input.institution || null,
    menuItems: normalizeStringArray(input.menuItems || input.menu_items || input.menu),
    allergens: normalizeStringArray(input.allergens),
    allergyNumbers: normalizeStringArray(input.allergyNumbers || input.allergy_numbers).map(Number).filter(Number.isFinite),
    origin: input.origin || null,
    calories: input.calories || null,
    nutrition: input.nutrition || null,
    source: input.source || null,
  };
}

function normalizeScheduleItem(input = {}) {
  if (!input.title) {
    throw new Error("schedule item title is required.");
  }

  return {
    id: input.id || null,
    title: input.title,
    description: input.description || null,
    startsAt: input.startsAt || input.starts_at || null,
    endsAt: input.endsAt || input.ends_at || null,
    date: input.date || null,
    institution: input.institution || null,
    source: input.source || null,
  };
}

function normalizeActionCandidate(input = {}) {
  return guardActionCandidate(input);
}

function normalizeSourceMetadata(input = {}) {
  return createSourceMetadata(input);
}

function finiteOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

module.exports = {
  FORBIDDEN_PROFILE_KEYS,
  assertNoForbiddenProfileKeys,
  normalizeActionCandidate,
  normalizeChildProfile,
  normalizeInstitution,
  normalizeMeal,
  normalizeScheduleItem,
  normalizeSourceMetadata,
  normalizeStringArray,
};
