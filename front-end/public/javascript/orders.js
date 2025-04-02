function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:3001/orders/${orderId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Order deleted successfully!");
                location.reload(); // Refresh to update the order list
            } else {
                alert("Failed to delete order: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Order
    document.querySelectorAll(".delete-order-btn").forEach(button => {
        button.addEventListener("click", function () {
            const orderId = this.getAttribute("data-id");
            deleteOrder(orderId);
        });
    });

    // Edit Order Modal
    document.querySelectorAll(".edit-order-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editOrderId").value = this.dataset.id;
            document.getElementById("editOrderStatus").value = this.dataset.statusid;
            console.log(this.dataset)
        });
    });

    // Handle Edit Order Form Submission
    document.getElementById("editOrderForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const orderId = document.getElementById("editOrderId").value;
        const updatedData = {
            statusid: document.getElementById("editOrderStatus").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/orders/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Order updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update order.");
            }
        })
        .catch(error => console.error("Error updating order:", error));
    });

});
