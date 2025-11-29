// src/lib/api.ts (crée ce fichier)
const API_URL = "https://koussaybackend.onrender.com/api"; // Change en production

export const api = {
  getProducts: (category?: string) => 
    fetch(`${API_URL}/products${category ? `?category=${category}` : ""}`)
      .then(r => r.json()),

  createOrder: (order: any) => 
    fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(r => {
      if (!r.ok) throw new Error("Erreur commande");
      return r.json();
    }),
};