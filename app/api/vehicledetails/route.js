import axios from "axios";
import { NextResponse } from "next/server";
import {
  getClientIp,
  lookupRateLimit,
  isAllowedOrigin,
  normalizeVehicleNumber,
  isValidVehicleNumber,
} from "@/lib/security";
import { encryptPayload } from "@/lib/encrypt";
import { sanitizeVehicleResponse } from "@/lib/sanitizeVehicleResponse";

const SIGNZY_URL = "https://api.signzy.app/api/v3/vehicle/detailedsearches";

export async function POST(request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const limit = lookupRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again in about ${Math.ceil(limit.retryAfterSec / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const vehicleNumber = normalizeVehicleNumber(body?.vehicleNumber);

    if (!vehicleNumber) {
      return NextResponse.json(
        { error: "vehicleNumber is required" },
        { status: 400 }
      );
    }

    if (!isValidVehicleNumber(vehicleNumber)) {
      return NextResponse.json(
        { error: "Invalid vehicle number format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SIGNZY_API_KEY;
    const clientId = process.env.SIGNZY_CLIENT_ID;
    const signzyID = process.env.SIGNZY_DEFAULT_ID || "PAYTMSZY";

    if (!apiKey || !clientId) {
      return NextResponse.json(
        { error: "Server is missing Signzy credentials" },
        { status: 500 }
      );
    }

    const response = await axios.post(
      SIGNZY_URL,
      { vehicleNumber, signzyID },
      {
        headers: {
          Authorization: apiKey,
          "x-client-unique-id": clientId,
          "Content-Type": "application/json",
        },
        timeout: 25000,
      }
    );

    // Strip client id / secrets, then encrypt for the browser
    const safeData = sanitizeVehicleResponse(response.data);
    const encrypted = encryptPayload(safeData);

    return NextResponse.json(encrypted, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error?.message || error);

    if (error.response) {
      const status = error.response.status;
      const message =
        status === 404
          ? "Vehicle not found"
          : status === 401 || status === 403
            ? "Upstream authorization failed"
            : "Unable to fetch vehicle details";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
