const SENSITIVE_KEYS = new Set([
  "x-client-unique-id",
  "xClientUniqueId",
  "clientId",
  "clientUniqueId",
  "authorization",
  "Authorization",
  "apiKey",
  "apikey",
  "signzyID",
]);

function stripSensitive(value) {
  if (Array.isArray(value)) {
    return value.map(stripSensitive);
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, nested] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key)) continue;
      cleaned[key] = stripSensitive(nested);
    }
    return cleaned;
  }

  return value;
}

/** Remove Signzy client id / secrets before sending anything to the browser */
export function sanitizeVehicleResponse(data) {
  return stripSensitive(data);
}
