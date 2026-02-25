// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL tanımlı değil. Vercel/Local .env kontrol et.");
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /products failed: ${res.status} ${text}`);
  }

  return res.json();
}

export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`, { method: "GET" });
  if (!res.ok) throw new Error(`GET /health failed: ${res.status}`);
  return res.json();
}