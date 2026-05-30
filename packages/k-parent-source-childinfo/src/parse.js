const {
  normalizeInstitution,
  normalizeSourceMetadata,
} = require("k-parent-core");

function pickRows(payload) {
  // data.go.kr 공통 응답: response.body.items.item (배열 또는 단일 객체)
  const items = payload?.response?.body?.items?.item;
  if (!items) {
    return [];
  }
  return Array.isArray(items) ? items : [items];
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toBool(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const text = String(value).trim().toUpperCase();
  if (["Y", "1", "TRUE", "운영", "있음", "O"].includes(text)) {
    return true;
  }
  if (["N", "0", "FALSE", "미운영", "없음", "X"].includes(text)) {
    return false;
  }
  return null;
}

// 어린이집 유형 코드/문구 정규화 (국공립/민간/가정 등)
function normalizeChildcareKind(value) {
  const text = String(value || "").trim();
  if (!text) {
    return null;
  }
  if (/국공립/.test(text)) return "국공립";
  if (/사회복지법인/.test(text)) return "사회복지법인";
  if (/법인|단체/.test(text)) return "법인·단체";
  if (/직장/.test(text)) return "직장";
  if (/가정/.test(text)) return "가정";
  if (/협동/.test(text)) return "협동";
  if (/민간/.test(text)) return "민간";
  return text;
}

// 유치원 설립유형 정규화 (공립/사립 등)
function normalizeEstablish(value) {
  const text = String(value || "").trim();
  if (!text) {
    return null;
  }
  if (/공립/.test(text)) return "공립";
  if (/사립/.test(text)) return "사립";
  if (/국립/.test(text)) return "국립";
  return text;
}

function normalizeChildcareRows(payload, options = {}) {
  const source = makeSource("어린이집정보공개", options);
  return pickRows(payload).map((row) => {
    const id = row.stcode || row.crcode || row.centerId || row.CRCODE;
    const inst = normalizeInstitution({
      id,
      type: "childcare",
      name: row.crname || row.name || row.CRNAME,
      address: row.craddr || row.address || row.CRADDR,
      source,
    });
    return {
      ...inst,
      centerId: id,
      kind: normalizeChildcareKind(row.crtypename || row.crtype || row.kind),
      tel: row.crtelno || row.tel || null,
      capacity: toNumber(row.crcnfm ?? row.capacity ?? row.nrtrcnt),
      currentCount: toNumber(row.crchcnt ?? row.currentCount ?? row.chldrnnmpr),
      hasVehicle: toBool(row.crcargbn ?? row.hasVehicle ?? row.vhcl),
      hasCctv: toBool(row.crcctv ?? row.hasCctv ?? row.cctv),
      operatingHours: row.cropertime || row.operatingHours || null,
      raw: row,
    };
  });
}

function normalizeKindergartenRows(payload, options = {}) {
  const source = makeSource("유치원현황", options);
  return pickRows(payload).map((row) => {
    const id = row.kindercode || row.kdgId || row.KINDERCODE || row.pkdgnum;
    const inst = normalizeInstitution({
      id,
      type: "kindergarten",
      name: row.kindername || row.name || row.KINDERNAME,
      address: row.addr || row.address || row.ADDR,
      source,
    });
    return {
      ...inst,
      kdgId: id,
      establish: normalizeEstablish(row.establish || row.estabtype || row.establishType),
      tel: row.telno || row.tel || null,
      classCount: toNumber(row.clcnt ?? row.classCount ?? row.totalClassCnt),
      pupilCount: toNumber(row.ppcnt ?? row.pupilCount ?? row.totalPupilCnt),
      busOperate: toBool(row.opertypbus ?? row.busOperate ?? row.bus),
      raw: row,
    };
  });
}

function makeSource(label, options = {}) {
  return normalizeSourceMetadata({
    sourceName: `data.go.kr ${label}`,
    sourceType: "official",
    sourceUrl: options.sourceUrl || "https://www.data.go.kr",
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 24 : options.maxAgeHours,
  });
}

module.exports = {
  pickRows,
  normalizeChildcareKind,
  normalizeEstablish,
  normalizeChildcareRows,
  normalizeKindergartenRows,
};
