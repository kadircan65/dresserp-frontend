import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // ekstra alanlar (istersen kullan)
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [deposit, setDeposit] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");

  const getProducts = async () => {
    try {
      const res = await fetch(API + "/products");
      if (!res.ok) throw new Error("GET /products failed: " + res.status);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Ürünleri çekerken hata: " + err.message);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async () => {
    // basic validation
    if (!name.trim() || !String(price).trim()) {
      alert("Ürün adı ve fiyat zorunlu");
      return;
    }

    const priceNum = Number(price);
    if (Number.isNaN(priceNum)) {
      alert("Fiyat sayısal olmalı");
      return;
    }

    try {
      const res = await fetch(API + "/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: priceNum,
          size,
          color,
          category,
          stock: stock === "" ? null : Number(stock),
          deposit: deposit === "" ? null : Number(deposit),
          image_url: imageUrl,
          notes,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "POST /products failed: " + res.status);
      }

      // reset inputs
      setName("");
      setPrice("");
      setSize("");
      setColor("");
      setCategory("");
      setStock("");
      setDeposit("");
      setImageUrl("");
      setNotes("");

      await getProducts();
    } catch (err) {
      console.error(err);
      alert("Ürün eklenirken hata: " + err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(API + `/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "DELETE failed: " + res.status);
      }
      await getProducts();
    } catch (err) {
      console.error(err);
      alert("Ürün silerken hata: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1>DRESSERP</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
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

      {/* İstersen alt alanları açarsın (şimdilik sade) */}
      {/* 
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input placeholder="Beden (S/M/L/36/38)" value={size} onChange={(e) => setSize(e.target.value)} />
        <input placeholder="Renk" value={color} onChange={(e) => setColor(e.target.value)} />
        <input placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" />
        <input placeholder="Depozito" value={deposit} onChange={(e) => setDeposit(e.target.value)} inputMode="numeric" />
        <input placeholder="Resim URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <input placeholder="Not" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      */}

      <h2>Ürünler</h2>

      {products.length === 0 ? (
        <p>Henüz ürün yok.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #333",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div>{p.price} TL</div>
              </div>

              <button onClick={() => deleteProduct(p.id)}>Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}