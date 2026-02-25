import React, { useEffect, useState } from "react";

// env varsa onu kullan, yoksa Railway URL fallback
const API =
  import.meta.env.VITE_API_URL ||
  "https://dresserp-backend-production.up.railway.app";

export default function App() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);

      if (!res.ok) {
        throw new Error("API response not ok");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.data) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      alert("Backend bağlantı hatası");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>DRESSERP</h1>

      {products.length === 0 && <p>Ürün yok</p>}

      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.price} TL</p>
        </div>
      ))}
    </div>
  );
}