import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [name, setName] = useState("");
const [price, setPrice] = useState("");

const [size, setSize] = useState("");
const [color, setColor] = useState("");
const [category, setCategory] = useState("");
const [stock, setStock] = useState(1);
const [deposit, setDeposit] = useState(0);
const [imageUrl, setImageUrl] = useState("");
const [notes, setNotes] = useState("");

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
    price: Number(price),
    size,
    color,
    category,
    stock,
    deposit,
    image_url: imageUrl,
    notes
  })
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
<input
  placeholder="Beden (S/M/L/36/38)"
  value={size}
  onChange={(e) => setSize(e.target.value)}
/>

<input
  placeholder="Renk"
  value={color}
  onChange={(e) => setColor(e.target.value)}
/>

<input
  placeholder="Kategori (Nişan / Nikah / Mezuniyet...)"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
/>

<input
  placeholder="Stok"
  type="number"
  value={stock}
  onChange={(e) => setStock(Number(e.target.value))}
  min={0}
/>

<input
  placeholder="Depozito (TL)"
  type="number"
  value={deposit}
  onChange={(e) => setDeposit(Number(e.target.value))}
  min={0}
/>

<input
  placeholder="Görsel URL (opsiyonel)"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
/>

<input
  placeholder="Not (opsiyonel)"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
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
<div>
  <div style={{ fontWeight: "bold" }}>{p.name}</div>
  <div>{p.price} TL</div>
  <div style={{ opacity: 0.8, fontSize: 12 }}>
    {p.category || "-"} • {p.size || "-"} • {p.color || "-"} • stok: {p.stock ?? 1} • depozito: {p.deposit ?? 0}
  </div>

  {p.image_url ? (
    <img
      src={p.image_url}
      alt={p.name}
      style={{ width: 120, height: "auto", marginTop: 8, borderRadius: 8 }}
    />
  ) : null}
</div>
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