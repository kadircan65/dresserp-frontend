import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const getProducts = async () => {
    try {
      const res = await fetch(API + "/products");
      if (!res.ok) throw new Error("GET /products failed: " + res.status);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Ürünleri çekerken hata: " + err.message);
    }
  };

  const addProduct = async () => {
    // Basit validation
    if (!name.trim() || !price.toString().trim()) {
      alert("Ürün adı ve fiyat zorunlu");
      return;
    }

    try {
      const res = await fetch(API + "/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          // fiyatı sayıya çevir (DB text ise istersen kaldır)
          price: Number(price),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("POST /products failed: " + res.status + " " + txt);
      }

      // Formu temizle + listeyi yenile
      setName("");
      setPrice("");
      await getProducts();
    } catch (err) {
      console.error(err);
      alert("Ürün eklerken hata: " + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(API + "/products/" + id, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("DELETE /products failed: " + res.status + " " + txt);
      }

      await getProducts();
    } catch (err) {
      console.error(err);
      alert("Ürün silerken hata: " + err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>DRESSERP</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="numeric"
        />

        <button onClick={addProduct}>Ekle</button>
      </div>

      <hr />

      <h3>Ürünler</h3>

      {products.length === 0 ? (
        <p>Henüz ürün yok.</p>
      ) : (
        products.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ minWidth: 40 }}>#{p.id}</div>
            <div style={{ minWidth: 200 }}>{p.name}</div>
            <div style={{ minWidth: 80 }}>{p.price} TL</div>
            <button onClick={() => deleteProduct(p.id)}>Sil</button>
          </div>
        ))
      )}
    </div>
  );
}