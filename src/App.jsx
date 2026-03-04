import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_BASE; // örn: https://dresserp-backend.onrender.com
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER; // örn: 905xxxxxxxxx (başında + yok)
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const adminUrl = useMemo(() => {
    // senin admin linkin buysa sabit kalsın, değilse değiştir
    return "https://dresserp-admin.vercel.app";
  }, []);

  function buildWhatsAppLink(p) {
    const name = p?.name ?? "Ürün";
    const price = p?.price ?? "";
    const id = p?.id ?? "";

    const text =
      `Merhaba, şu ürünü soruyorum:\n` +
      `• Ürün: ${name}\n` +
      `• Fiyat: ${price} ₺\n` +
      `• Ürün Kodu: ${id}\n` +
      `• Site: ${SITE_URL}`;

    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function openWhatsApp(p) {
    if (!WA_NUMBER) {
      alert("WhatsApp numarası tanımlı değil. (VITE_WHATSAPP_NUMBER)");
      return;
    }
    window.open(buildWhatsAppLink(p), "_blank", "noopener,noreferrer");
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      setErr("");

      if (!API || !API.startsWith("http")) {
        throw new Error(
          "VITE_API_BASE hatalı / eksik. .env içinde http ile başlamalı."
        );
      }

      const res = await fetch(`${API}/api/products`);
      const text = await res.text();

      if (!res.ok) {
        throw new Error(`API hata: ${res.status} ${text}`);
      }

      const data = JSON.parse(text);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to fetch");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Dresserp Store</h1>
          <div className="sub">
            API: <a href={API}>{API}</a>
          </div>
        </div>

        <div className="right">
          <a className="btn" href={adminUrl} target="_blank" rel="noreferrer">
            Admin Panel
          </a>
        </div>
      </header>

      {err ? (
        <div className="error">
          <b>Hata:</b> {err}
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
            Kontrol: Vercel env içinde <code>VITE_API_BASE</code>,{" "}
            <code>VITE_WHATSAPP_NUMBER</code>, <code>VITE_SITE_URL</code> doğru
            mu?
          </div>
        </div>
      ) : null}

      <div className="actions">
        <button className="btn" onClick={fetchProducts} disabled={loading}>
          {loading ? "Yükleniyor..." : "Yenile"}
        </button>
      </div>

      <div className="grid">
        {loading ? (
          <div style={{ padding: 12 }}>Ürünler yükleniyor...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 12 }}>Ürün yok</div>
        ) : (
          products.map((p) => (
            <div className="card" key={p.id}>
              <div className="imgWrap">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} />
                ) : (
                  <div className="noImg">Görsel Yok</div>
                )}
              </div>

              <div className="name">{p.name}</div>
              <div className="price">{Number(p.price).toLocaleString("tr-TR")} ₺</div>

              <button className="waBtn" onClick={() => openWhatsApp(p)}>
                WhatsApp’tan Sor
              </button>
            </div>
          ))
        )}
      </div>

      <footer className="footer">© 2026 Dresserp</footer>
    </div>
  );
}