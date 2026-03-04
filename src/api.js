// src/api.js

const API_BASE = String(import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "").trim();

function joinUrl(base, path) {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function healthcheck() {
  if (!API_BASE) throw new Error("VITE_API_BASE (veya VITE_API_URL) boş.");

  const url = joinUrl(API_BASE, "health");
  const res = await fetch(url);

  if (!res.ok) {
    const t = await safeText(res);
    throw new Error(`Health ${res.status} ${t}`);
  }

  return true;
}

export async function getProducts() {
  if (!API_BASE) throw new Error("VITE_API_BASE (veya VITE_API_URL) boş.");

  const url = joinUrl(API_BASE, "api/products");
  const res = await fetch(url);

  if (!res.ok) {
    const t = await safeText(res);
    throw new Error(`Products ${res.status} ${t}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}