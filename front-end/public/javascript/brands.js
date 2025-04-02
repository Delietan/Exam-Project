function deleteBrand(brandId) {
    if (confirm("Are you sure you want to delete this brand?")) {
        fetch(`http://localhost:3001/brands/${brandId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Brand deleted successfully!");
                location.reload(); // Refresh to update the brand list
            } else {
                alert("Failed to delete brand: " + data.data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Brand
    document.querySelectorAll(".delete-brand-btn").forEach(button => {
        button.addEventListener("click", function () {
            const brandId = this.getAttribute("data-id");
            deleteBrand(brandId);
        });
    });

    // Edit Brand Modal
    document.querySelectorAll(".edit-brand-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editBrandId").value = this.dataset.id;
            document.getElementById("editBrandname").value = this.dataset.brandname;
            console.log(this.dataset)
        });
    });

    // Handle Edit Brand Form Submission
    document.getElementById("editBrandForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const brandId = document.getElementById("editBrandId").value;
        const updatedData = {
            brandname: document.getElementById("editBrandname").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/brands/${brandId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Brand updated successfully!");
                window.location.reload();
            } else {
                alert(data.data.error);
            }
        })
        .catch(error => console.error("Error updating brand:", error));
    });

    // Handle Add Brand Form Submission
    document.getElementById("addBrandForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newBrand = {
            brandname: document.getElementById("brandName").value,
        };

        fetch("http://localhost:3001/brands", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBrand),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Brand added successfully!");
                window.location.reload();
            } else {
                alert(data.data.error);
            }
        })
        .catch(error => console.error("Error adding brand:", error));
    });
});
