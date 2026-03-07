import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_BASE;

function getStoreFromQuery() {
  const p = new URLSearchParams(window.location.search);
  return (p.get("store") || "main").trim().toLowerCase();
}

function formatPrice(value) {
  const n = Number(value || 0);
  return n.toLocaleString("tr-TR") + " ₺";
}

function buildWhatsappLink(number, productName, storeName) {
  const clean = String(number || "").replace(/\D/g, "");
  const text = `Merhaba, ${storeName} mağazasındaki "${productName}" ürünü hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export default function App() {
  const [store] = useState(getStoreFromQuery());
  const [apiOk, setApiOk] = useState(false);

  const [storeInfo, setStoreInfo] = useState({
    store_name: "Dresserp Store",
    whatsapp_number: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const api = (path) => `${API}${path}`;

  const hasWhatsapp = useMemo(() => {
    return !!String(storeInfo.whatsapp_number || "").trim();
  }, [storeInfo.whatsapp_number]);

  useEffect(() => {
    checkApi();
    loadStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  async function checkApi() {
    try {
      const r = await fetch(`${API}/health`);
      setApiOk(r.ok);
    } catch {
      setApiOk(false);
    }
  }

  async function loadStore() {
    setLoading(true);
    setMsg("");

    try {
      const storeRes = await fetch(api(`/api/s/${store}/store`));
      const storeData = await storeRes.json();

      if (!storeRes.ok) {
        setMsg(`Mağaza bulunamadı: ${storeData?.error || storeRes.status}`);
        setLoading(false);
        return;
      }

      setStoreInfo(storeData);

      const prodRes = await fetch(api(`/api/s/${store}/products`));
      const prodData = await prodRes.json();

      if (!prodRes.ok) {
        setMsg(`Ürünler alınamadı: ${prodData?.error || prodRes.status}`);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(Array.isArray(prodData) ? prodData : []);
      setLoading(false);
    } catch {
      setMsg("Bağlantı hatası oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>{storeInfo.store_name || "Dresserp Store"}</h1>
          <p className="muted">
            Mağaza: <b>{store}</b>
          </p>
        </div>

        <a
          className="admin-link"
          href={`https://dresserp-admin.vercel.app/?store=${store}`}
          target="_blank"
          rel="noreferrer"
        >
          Admin Panel
        </a>
      </header>

      <div className="status-row">
        <span className={`badge ${apiOk ? "ok" : "bad"}`}>
          {apiOk ? "API erişiliyor" : "API erişilemiyor"}
        </span>

        <button className="refresh-btn" onClick={loadStore}>
          Yenile
        </button>
      </div>

      {msg ? <div className="alert">{msg}</div> : null}

      {loading ? (
        <div className="empty">Yükleniyor...</div>
      ) : products.length === 0 ? (
        <div className="empty">Bu mağazada henüz ürün yok.</div>
      ) : (
        <section className="grid">
          {products.map((p) => {
            const waLink = buildWhatsappLink(
              storeInfo.whatsapp_number,
              p.name,
              storeInfo.store_name
            );

            return (
              <article className="card" key={p.id}>
                <div className="image-wrap">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="product-image" />
                  ) : (
                    <div className="no-image">Görsel Yok</div>
                  )}
                </div>

                <div className="card-body">
                  <h3>{p.name}</h3>
                  <div className="price">{formatPrice(p.price)}</div>

                  {hasWhatsapp ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="wa-btn"
                    >
                      WhatsApp’tan Sor
                    </a>
                  ) : (
                    <button className="wa-btn disabled" disabled>
                      WhatsApp tanımlı değil
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <footer className="footer">
        © 2026 Dresserp
      </footer>
    </div>
  );
}