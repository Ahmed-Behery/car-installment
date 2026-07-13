// Lightweight API client for the ported car-installment form.
//
// The original app routes every call through a signing HMAC proxy backed by
// this company's real backend. That proxy's secrets live in the original
// repo and can't be replicated here, so this client instead:
//   - calls NEXT_PUBLIC_API_BASE_URL directly (if configured), or
//   - falls back to local mock responses so the UI is fully clickable/
//     demoable out of the box (branches, car catalog, OTP, S3 upload, submit).

import { CAR_BRANDS, CAR_MODELS, CAR_CATEGORIES } from "./car-data";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const MOCK_BRANCHES = [
  { title: "فرع مدينة نصر", address: "شارع عباس العقاد، مدينة نصر، القاهرة" },
  { title: "فرع المهندسين", address: "شارع جامعة الدول العربية، المهندسين، الجيزة" },
  { title: "فرع الإسكندرية - سموحة", address: "شارع فوزي معاذ، سموحة، الإسكندرية" },
  { title: "فرع التجمع الخامس", address: "التجمع الخامس، القاهرة الجديدة" },
  { title: "فرع المنصورة", address: "شارع الجمهورية، المنصورة، الدقهلية" },
];

// phone -> otp code, in-memory only (resets on server restart)
const otpStore = new Map();

async function mockResponse(method, path, payload) {
  if (path === "/general/branches") {
    return { data: MOCK_BRANCHES };
  }

  if (path === "/general/car-brands") {
    return { data: CAR_BRANDS };
  }

  if (path === "/general/car-models") {
    return { data: CAR_MODELS[payload?.brandId] || [] };
  }

  if (path === "/general/car-categories") {
    return { data: CAR_CATEGORIES[payload?.modelId] || [] };
  }

  if (path === "/s3/public/generate-presigned-url") {
    return {
      data: {
        uploadUrl: null, // no real S3 target in mock mode; upload is skipped
        fileUrl: `mock://uploads/${payload?.imageType || "file"}-${Date.now()}`,
      },
    };
  }

  if (path === "/auth/send-otp") {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    otpStore.set(payload?.phone, code);
    // eslint-disable-next-line no-console
    console.info(`[mock] OTP for ${payload?.phone}: ${code}`);
    return { data: { success: true } };
  }

  if (path === "/auth/verify-otp") {
    const expected = otpStore.get(payload?.phone);
    const verified = !!expected && expected === payload?.code;
    if (verified) otpStore.delete(payload?.phone);
    return { data: { verified } };
  }

  if (path === "/services/request-info") {
    // eslint-disable-next-line no-console
    console.info("[mock] /services/request-info payload:", payload);
    return { data: { success: true, mock: true } };
  }

  throw new Error(`No mock configured for ${method} ${path}`);
}

async function request(method, path, { body, params } = {}) {
  if (!BASE_URL) {
    return mockResponse(method, path, method === "GET" ? params : body);
  }

  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
      ).toString()}`
    : "";

  const res = await fetch(`${BASE_URL}${path}${query}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  return { data };
}

export const api = {
  get: (path, params) => request("GET", path, { params }),
  post: (path, body) => request("POST", path, { body }),
};
