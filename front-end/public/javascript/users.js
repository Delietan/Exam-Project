function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        fetch(`http://localhost:3001/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("User deleted successfully!");
                location.reload(); // Refresh to update the user list
            } else {
                alert("Failed to delete user: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-user-btn").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id");
            deleteUser(userId);
        });
    });
    document.querySelectorAll(".edit-user-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editUserId").value = this.dataset.id;
            document.getElementById("editUsername").value = this.dataset.username;
            document.getElementById("editFirstName").value = this.dataset.firstname;
            document.getElementById("editLastName").value = this.dataset.lastname;
            document.getElementById("editEmail").value = this.dataset.email;
            document.getElementById("editAddress").value = this.dataset.address;
            document.getElementById("editTelephone").value = this.dataset.telephone;
    
            // Set the selected role
            document.getElementById("editRole").value = this.dataset.roleid;
    
            // Set the selected membership
            document.getElementById("editMembership").value = this.dataset.membershipid;
        });
    });

    document.getElementById("editUserForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const userId = document.getElementById("editUserId").value;
        const updatedData = {
            username: document.getElementById("editUsername").value,
            firstname: document.getElementById("editFirstName").value,
            lastname: document.getElementById("editLastName").value,
            email: document.getElementById("editEmail").value,
            address: document.getElementById("editAddress").value,
            telephone: document.getElementById("editTelephone").value,
            roleId: document.getElementById("editRole").value,
            membershipId: document.getElementById("editMembership").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("User updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update user.");
            }
        })
        .catch(error => console.error("Error updating user:", error));
    });

    // Handle Add User Form Submission
    document.getElementById("addUserForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newUser = {
            firstname: document.getElementById("addFirstName").value,
            lastname: document.getElementById("addLastName").value,
            username: document.getElementById("addUsername").value,
            email: document.getElementById("addEmail").value,
            password: document.getElementById("addPassword").value,
            // password: "TestPassword123!", 
            address: document.getElementById("addAddress").value,
            phone: document.getElementById("addTelephone").value,
            // roleId: document.getElementById("addRole").value,
            // membershipId: document.getElementById("addMembership").value
        };

        console.log(newUser)

        fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(data => {
            if (data.statuscode === 201) {
                alert("User added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add user.");
            }
        })
        .catch(error => console.error("Error adding user:", error));
    });
});
