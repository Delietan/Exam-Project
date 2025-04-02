// function deleteProduct(productId) {
//     if (confirm("Are you sure you want to delete this product?")) {
//         fetch(`http://localhost:3001/products/${productId}`, {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             credentials: "include" // This automatically includes the token from the cookie
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "success") {
//                 alert("Product deleted successfully!");
//                 location.reload(); // Refresh to update the product list
//             } else {
//                 alert("Failed to delete product: " + data.message);
//             }
//         })
//         .catch(error => console.error("Error:", error));
//     }
// }

function deleteProduct(productId) {
    fetch(`http://localhost:3001/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // This automatically includes the token from the cookie
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // alert("Product deleted successfully!");
            location.reload(); // Refresh to update the product list
        } else {
            alert("Failed to delete product: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-delete-product-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-id");
            deleteProduct(productId);
        });
    });
    document.querySelectorAll(".edit-product-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editProductId").value = this.dataset.id;
            document.getElementById("editProductName").value = this.dataset.name;
            document.getElementById("editProductDescription").value = this.dataset.description;
            document.getElementById("editProductQuantity").value = this.dataset.quantity;
            document.getElementById("editProductPrice").value = this.dataset.unitprice;
            document.getElementById("editProductImgUrl").value = this.dataset.imgurl;
            document.getElementById("editProductBrand").value = this.dataset.brandid;
            document.getElementById("editProductCategory").value = this.dataset.categoryid;
        });
    });

    document.getElementById("editProductForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const productId = document.getElementById("editProductId").value;
        const updatedData = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            quantity: document.getElementById("editProductQuantity").value,
            unitprice: document.getElementById("editProductPrice").value,
            imgurl: document.getElementById("editProductImgUrl").value,
            brandid: document.getElementById("editProductBrand").value,
            categoryid: document.getElementById("editProductCategory").value,
        };

        fetch(`http://localhost:3001/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include" // This automatically includes the token from the cookie

        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Product updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update product.");
            }
        })
        .catch(error => console.error("Error updating product:", error));
    });

        // Handle Add Product Form Submission
        document.getElementById("addProductForm").addEventListener("submit", function (e) {
            e.preventDefault();
            
            const newProduct = {
                name: document.getElementById("addProductName").value,
                description: document.getElementById("addProductDescription").value,
                quantity: document.getElementById("addProductQuantity").value,
                unitprice: document.getElementById("addProductPrice").value,
                imgurl: document.getElementById("addProductImgUrl").value,
                brandid: document.getElementById("addProductBrand").value,
                categoryid: document.getElementById("addProductCategory").value
            };

            console.log(newProduct)
            
            fetch("http://localhost:3001/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
                credentials: "include"

            })
            .then(response => response.json())
            .then(data => {
                if (data.statuscode === 201) {
                    alert("Product added successfully!");
                    window.location.reload();
                } else {
                    alert("Failed to add product." + data.data.result);
                }
            })
            .catch(error => console.error("Error adding product:", error));
        });
});
