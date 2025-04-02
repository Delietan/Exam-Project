function deleteRole(roleId) {
    if (confirm("Are you sure you want to delete this role?")) {
        fetch(`http://localhost:3001/roles/${roleId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Role deleted successfully!");
                location.reload(); // Refresh to update the role list
            } else {
                alert("Failed to delete role: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Role
    document.querySelectorAll(".delete-role-btn").forEach(button => {
        button.addEventListener("click", function () {
            const roleId = this.getAttribute("data-id");
            console.log(roleId)
            deleteRole(roleId);
        });
    });

    // Edit Role Modal
    document.querySelectorAll(".edit-role-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editRoleId").value = this.dataset.id;
            document.getElementById("editRolename").value = this.dataset.name;
            console.log(this.dataset)
        });
    });

    // Handle Edit Role Form Submission
    document.getElementById("editRoleForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const roleId = document.getElementById("editRoleId").value;
        const updatedData = {
            name: document.getElementById("editRolename").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/roles/${roleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Role updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update role.");
            }
        })
        .catch(error => console.error("Error updating role:", error));
    });

    // Handle Add Role Form Submission
    document.getElementById("addRoleForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newRole = {
            name: document.getElementById("roleName").value,
        };

        fetch("http://localhost:3001/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRole),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Role added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add role.");
            }
        })
        .catch(error => console.error("Error adding role:", error));
    });
});
