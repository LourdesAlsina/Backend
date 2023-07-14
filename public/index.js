const socket = io();

const form = document.getElementById("form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  let product = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    price: document.querySelector("#Price").value,
    code: document.querySelector("#code").value,
    category: document.querySelector("#category").value,
    stock: document.querySelector("#Stock").value,
  };

 
  const res = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await res.json();
    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      const resultProducts = await fetch("/api/products");
      const results = await resultProducts.json();
      if (results.status === "error") {
        throw new Error(results.error);
      } else {
        socket.emit("productList", results.products);

        Toastify({
          text: "new product added successfully",
          duration: 2000,
          newWindow: true,
          close: true,
          gravity: "top", 
          position: "right", 
          stopOnFocus: true, 
          style: {
            background: "#008000",
          },
          onClick: function(){} 
        }).showToast();

        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#Price").value = "";
        document.querySelector("#code").value = "";
        document.querySelector("#category").value = "";
        document.querySelector("#Stock").value = "";
      }
    }
  } catch (error) {
    console.log(error);
  }
});


const deleteProduct = async (id) => {
  console.log(typeof(id));
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.status === "error") throw new Error(result.error);
    else socket.emit("productList", result.products);

    
    Toastify({
      text: "product removed successfully",
      duration: 2000,
      newWindow: true,
      close: true,
      gravity: "bottom", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "#ff0000",
      },
      onClick: function(){} 
    }).showToast();

  } catch (error) {
    console.log(error);
  }
};


socket.on("updatedProducts", (products) => {
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.category}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}')" id="btnDelete">Delete</button>
        </td>
      `;
    tbody.appendChild(row);
  });
});