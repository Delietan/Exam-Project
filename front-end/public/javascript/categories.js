function deleteCategory(categoryId) {
    if (confirm("Are you sure you want to delete this category?")) {
        fetch(`http://localhost:3001/categories/${categoryId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Category deleted successfully!");
                location.reload(); // Refresh to update the category list
            } else {
                alert("Failed to delete category: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Category
    document.querySelectorAll(".delete-category-btn").forEach(button => {
        button.addEventListener("click", function () {
            const categoryId = this.getAttribute("data-id");
            deleteCategory(categoryId);
        });
    });

    // Edit Category Modal
    document.querySelectorAll(".edit-category-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editCategoryId").value = this.dataset.id;
            document.getElementById("editCategoryname").value = this.dataset.categoryname;
            console.log(this.dataset)
        });
    });

    // Handle Edit Category Form Submission
    document.getElementById("editCategoryForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const categoryId = document.getElementById("editCategoryId").value;
        const updatedData = {
            name: document.getElementById("editCategoryname").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/categories/${categoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Category updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update category.");
            }
        })
        .catch(error => console.error("Error updating category:", error));
    });

    // Handle Add Category Form Submission
    document.getElementById("addCategoryForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newCategory = {
            name: document.getElementById("categoryName").value,
        };

        fetch("http://localhost:3001/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCategory),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Category added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add category.");
            }
        })
        .catch(error => console.error("Error adding category:", error));
    });
});
