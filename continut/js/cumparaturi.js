class Product {
    constructor(id, name, quantity) {
      this.id = id;
      this.name = name;
      this.quantity = quantity;
    }
  }
  
  const form = document.getElementById("productsForm");
  const tableBody = document.querySelector("#productsTable tbody");
  
  // Funcție pentru salvare în localStorage
  const saveToStorage = (product) => {
    return new Promise((resolve) => {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));
      resolve(product);
    });
  };
  
  // Afișează un produs în tabel
  const displayProduct = (product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
    `;
    tableBody.appendChild(row);
  };
  
  // La încărcarea paginii, afișăm produsele deja salvate
  window.addEventListener("DOMContentLoaded", () => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach(displayProduct);
  });
  
  // La trimiterea formularului
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const id = products.length + 1;
  
    const product = new Product(id, name, quantity);
  
    saveToStorage(product).then((p) => {
      displayProduct(p);
      form.reset();
    });
  });
  