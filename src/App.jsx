// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import { getProducts, healthCheck } from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("Yükleniyor...");
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setError("");
      try {
        // backend ayakta mı?
        await healthCheck();

        // ürünleri çek
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setStatus("OK");
      } catch (err) {
        console.error(err);
        setStatus("HATA");
        setError("Backend bağlantı hatası. VITE_API_URL veya /products endpoint kontrol.");
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>DRESSERP</h1>

      <p>
        Durum: <b>{status}</b>
      </p>

      {error && (
        <div style={{ background: "#2b0a0a", padding: 12, borderRadius: 8 }}>
          {error}
        </div>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h2>Ürünler</h2>

      {products.length === 0 ? (
        <p>Ürün yok</p>
      ) : (
        <ul>
          {products.map((p, i) => (
            <li key={p.id ?? i}>
              {p.name ?? p.title ?? "Ürün"}{" "}
              {p.price ? `- ${p.price}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}