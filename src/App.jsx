import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_BASE;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const apiOk = useMemo(() => !!API && API.startsWith("http"), []);

  useEffect(() => {
    async function load() {
      try {
        setErr("");
        setLoading(true);

        if (!apiOk) {
          throw new Error("VITE_API_BASE tanımlı değil veya hatalı.");
        }

        const res = await fetch(`${API}/api/products`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`API hata: ${res.status} ${res.statusText} ${text}`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [apiOk]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Dresserp Store</h1>
          <p className="sub">
            API: <span className={err ? "bad" : "good"}>{API || "(yok)"}</span>
          </p>
        </div>
        <a className="btn" href="https://dresserp-admin.vercel.app" target="_blank" rel="noreferrer">
          Admin Panel
        </a>
      </header>

      {loading && <div className="box">Yükleniyor...</div>}
      {!loading && err && (
        <div className="box error">
          <b>Hata:</b> {err}
          <div className="hint">
            Kontrol: <code>.env</code> içinde <code>VITE_API_BASE</code> doğru mu? (http ile başlamalı)
          </div>
        </div>
      )}

      {!loading && !err && (
        <>
          <div className="grid">
            {products.map((p) => (
              <div className="card" key={p._id}>
                <div className="img">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} />
                  ) : (
                    <div className="noimg">Görsel Yok</div>
                  )}
                </div>

                <div className="info">
                  <h3>{p.name}</h3>
                  <div className="price">{Number(p.price || 0).toLocaleString("tr-TR")} ₺</div>
                  <a
                    className="wa"
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Merhaba, "${p.name}" ürünü hakkında bilgi almak istiyorum. Fiyat: ${p.price}₺`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp'tan Sor
                  </a>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="box">Hiç ürün yok. Admin panelden ürün ekle.</div>
          )}
        </>
      )}

      <footer className="footer">© {new Date().getFullYear()} Dresserp</footer>
    </div>
  );
}