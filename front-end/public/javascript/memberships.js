function deleteMembership(membershipId) {
    if (confirm("Are you sure you want to delete this membership?")) {
        fetch(`http://localhost:3001/memberships/${membershipId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include" // This automatically includes the token from the cookie
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Membership deleted successfully!");
                location.reload(); // Refresh to update the membership list
            } else {
                alert(data.data.result);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Delete Membership
    document.querySelectorAll(".delete-membership-btn").forEach(button => {
        button.addEventListener("click", function () {
            const membershipId = this.getAttribute("data-id");
            deleteMembership(membershipId);
        });
    });

    // Edit Membership Modal
    document.querySelectorAll(".edit-membership-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.getElementById("editMembershipId").value = this.dataset.id;
            document.getElementById("editMembershipName").value = this.dataset.name;
            document.getElementById("editMembershipDiscount").value = this.dataset.discount;
            document.getElementById("editMembershipThreshold").value = this.dataset.threshold;
            console.log(this.dataset)
        });
    });

    // Handle Edit Membership Form Submission
    document.getElementById("editMembershipForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const membershipId = document.getElementById("editMembershipId").value;
        const updatedData = {
            name: document.getElementById("editMembershipName").value,
            discount: document.getElementById("editMembershipDiscount").value,
            threshold: document.getElementById("editMembershipThreshold").value,
        };
        console.log(updatedData)
        fetch(`http://localhost:3001/memberships/${membershipId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Membership updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update membership.");
            }
        })
        .catch(error => console.error("Error updating membership:", error));
    });

    // Handle Add Membership Form Submission
    document.getElementById("addMembershipForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const newMembership = {
            name: document.getElementById("membershipName").value,
            discount: document.getElementById("membershipDiscount").value,
            threshold: document.getElementById("membershipThreshold").value,
        };

        fetch("http://localhost:3001/memberships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMembership),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Membership added successfully!");
                window.location.reload();
            } else {
                alert("Failed to add membership.");
            }
        })
        .catch(error => console.error("Error adding membership:", error));
    });
});
