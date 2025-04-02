function deleteOrderstatus(orderstatusId) {
    if (confirm("Are you sure you want to delete this orderstatus?")) {
        fetch(`http://localhost:3001/orderstatuses/${orderstatusId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Orderstatus deleted successfully!");
                location.reload(); // Refresh to update the orderstatus list
            } else {
                alert("Failed to delete orderstatus: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Orderstatus
    document.querySelectorAll(".delete-orderstatus-btn").forEach(button => {
        button.addEventListener("click", function () {
            const orderstatusId = this.getAttribute("data-id");
            deleteOrderstatus(orderstatusId);
        });
    });

    // Edit Orderstatus Modal
    document.querySelectorAll(".edit-orderstatus-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editOrderstatusId").value = this.dataset.id;
            document.getElementById("editOrderstatusname").value = this.dataset.orderstatusname;
            console.log(this.dataset)
        });
    });

    // Handle Edit Orderstatus Form Submission
    document.getElementById("editOrderstatusForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const orderstatusId = document.getElementById("editOrderstatusId").value;
        const updatedData = {
            orderstatusname: document.getElementById("editOrderstatusname").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/orderstatuses/${orderstatusId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Orderstatus updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update orderstatus.");
            }
        })
        .catch(error => console.error("Error updating orderstatus:", error));
    });

    // Handle Add Orderstatus Form Submission
    document.getElementById("addOrderstatusForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newOrderstatus = {
            orderstatusname: document.getElementById("orderstatusName").value,
        };

        fetch("http://localhost:3001/orderstatuses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrderstatus),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Orderstatus added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add orderstatus.");
            }
        })
        .catch(error => console.error("Error adding orderstatus:", error));
    });
});
