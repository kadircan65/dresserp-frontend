// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import { getProducts, healthCheck } from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Yükleniyor...");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError("");
    setStatus("Yükleniyor...");

    try {
      await healthCheck();
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setStatus("OK");
    } catch (err) {
      console.error(err);
      setStatus("HATA");
      setError(
        "Backend bağlantı hatası. VITE_API_URL ve endpointler (/health, /api/products) kontrol."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>DRESSERP</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <p style={{ margin: 0 }}>
          Durum: <b>{status}</b> {loading ? " (yükleniyor...)" : ""}
        </p>

        <button onClick={run} disabled={loading}>
          Yenile
        </button>
      </div>

      {error && (
        <div style={{ background: "#2b0a0a", padding: 12, borderRadius: 8, marginTop: 12 }}>
          {error}
        </div>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h2>Ürünler ({products.length})</h2>

      {products.length === 0 ? (
        <p>Ürün yok</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {products.map((p, i) => {
            const name = p.name ?? p.title ?? "Ürün";
            const price = p.price ? `${p.price} ₺` : "";
            const img = p.image_url ?? p.imageUrl ?? p.image ?? p.photo_url ?? "";

            return (
              <div
                key={p.id ?? i}
                style={{
                  border: "1px solid #333",
                  borderRadius: 10,
                  padding: 12,
                  background: "#0f0f0f",
                }}
              >
                <div
                  style={{
                    height: 140,
                    borderRadius: 8,
                    background: "#1a1a1a",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ opacity: 0.6 }}>Resim yok</span>
                  )}
                </div>

                <div style={{ fontWeight: 700 }}>{name}</div>
                <div style={{ opacity: 0.85, marginTop: 4 }}>{price}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}