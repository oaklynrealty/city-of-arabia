const BLACKLIST_CONFIG = {
  spreadsheetId:
    PropertiesService.getScriptProperties().getProperty("BLACKLIST_SPREADSHEET_ID") ||
    "REPLACE_WITH_SPREADSHEET_ID",
  sheetName:
    PropertiesService.getScriptProperties().getProperty("BLACKLIST_SHEET_NAME") ||
    "Blacklist",
  cacheTtlSeconds: 300,
};

function doGet(e) {
  return handleBlacklistRequest_(e);
}

function doPost(e) {
  return handleBlacklistRequest_(e);
}

function handleBlacklistRequest_(e) {
  try {
    const params = getRequestParams_(e);
    const lead = {
      first_name: normalizeText_(params.first_name),
      last_name: normalizeText_(params.last_name),
      phone_number: normalizePhoneNumber_(params.phone_number),
      email: normalizeEmail_(params.email),
    };

    console.log(
      JSON.stringify({
        event: "blacklist_check_request",
        lead: lead,
      })
    );

    if (!lead.phone_number && !lead.email) {
      return jsonOutput_({
        blocked: false,
        error: "missing_lookup_values",
      });
    }

    const cachedResult = getCachedLookup_(lead);
    if (cachedResult) {
      console.log(
        JSON.stringify({
          event: "blacklist_check_cache_hit",
          lead: lead,
          result: cachedResult,
        })
      );
      return jsonOutput_(cachedResult);
    }

    const sheet = getBlacklistSheet_();
    const rows = sheet.getDataRange().getValues();
    if (!rows.length) {
      const emptyResult = { blocked: false };
      cacheLookup_(lead, emptyResult);
      return jsonOutput_(emptyResult);
    }

    const headerMap = buildHeaderMap_(rows[0]);
    assertHeaders_(headerMap, ["phone_number", "email", "blacklisted"]);

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      const isBlacklisted = parseBoolean_(row[headerMap.blacklisted]);
      if (!isBlacklisted) continue;

      const rowPhone = normalizePhoneNumber_(row[headerMap.phone_number]);
      const rowEmail = normalizeEmail_(row[headerMap.email]);
      const phoneMatch = Boolean(lead.phone_number && rowPhone && rowPhone === lead.phone_number);
      const emailMatch = Boolean(lead.email && rowEmail && rowEmail === lead.email);

      if (phoneMatch || emailMatch) {
        const blockedResult = { blocked: true };
        cacheLookup_(lead, blockedResult);
        console.log(
          JSON.stringify({
            event: "blacklist_check_blocked",
            lead: lead,
            matched_by: phoneMatch ? "phone_number" : "email",
            row: rowIndex + 1,
          })
        );
        return jsonOutput_(blockedResult);
      }
    }

    const clearResult = { blocked: false };
    cacheLookup_(lead, clearResult);
    console.log(
      JSON.stringify({
        event: "blacklist_check_clear",
        lead: lead,
      })
    );
    return jsonOutput_(clearResult);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "blacklist_check_error",
        message: error && error.message ? error.message : String(error),
      })
    );
    return jsonOutput_({
      blocked: false,
      error: "server_error",
    });
  }
}

function getRequestParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});

  if (e && e.postData && e.postData.contents) {
    const contentType = String(e.postData.type || "").toLowerCase();
    if (contentType.indexOf("application/json") !== -1) {
      const parsed = JSON.parse(e.postData.contents);
      return Object.assign(params, parsed);
    }
  }

  return params;
}

function getBlacklistSheet_() {
  if (!BLACKLIST_CONFIG.spreadsheetId || BLACKLIST_CONFIG.spreadsheetId === "REPLACE_WITH_SPREADSHEET_ID") {
    throw new Error("Missing BLACKLIST_SPREADSHEET_ID configuration.");
  }

  const spreadsheet = SpreadsheetApp.openById(BLACKLIST_CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(BLACKLIST_CONFIG.sheetName);
  if (!sheet) {
    throw new Error("Blacklist sheet not found: " + BLACKLIST_CONFIG.sheetName);
  }

  return sheet;
}

function buildHeaderMap_(headerRow) {
  return headerRow.reduce(function (map, headerValue, index) {
    map[normalizeHeader_(headerValue)] = index;
    return map;
  }, {});
}

function assertHeaders_(headerMap, requiredHeaders) {
  requiredHeaders.forEach(function (headerName) {
    if (typeof headerMap[headerName] !== "number") {
      throw new Error("Missing required blacklist column: " + headerName);
    }
  });
}

function normalizeHeader_(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText_(value) {
  return String(value || "").trim();
}

function normalizeEmail_(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhoneNumber_(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/[\s\-()]/g, "");
}

function parseBoolean_(value) {
  if (value === true) return true;
  return String(value || "").trim().toLowerCase() === "true";
}

function getCacheKey_(lead) {
  return (
    "blacklist:" +
    Utilities.base64EncodeWebSafe(
      JSON.stringify({
        phone_number: lead.phone_number || "",
        email: lead.email || "",
      })
    )
  );
}

function getCachedLookup_(lead) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(getCacheKey_(lead));
  return cached ? JSON.parse(cached) : null;
}

function cacheLookup_(lead, payload) {
  const cache = CacheService.getScriptCache();
  cache.put(getCacheKey_(lead), JSON.stringify(payload), BLACKLIST_CONFIG.cacheTtlSeconds);
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
