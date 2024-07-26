$(document).ready(function() {
    $("#update_inventory_btn").click(function(event) {
        event.preventDefault();

        var id = $("#inventory_id").val(); // Assuming you have an input field with id="inventory_id" to hold the inventory ID
        var updateData = {
            "inventory_company": $("#inventory_company").val(),
            "inventory_item": $("#inventory_item").val(),
            "inventory_purchase_date": $("#inventory_purchase_date").val(),
            "inventory_si_no": $("#inventory_si_no").val(),
            "inventory_quantity": $("#inventory_quantity").val(),
            "inventory_brand": $("#inventory_brand").val(),
            "inventory_amount": $("#inventory_amount").val(),
            "inventory_serial_no": $("#inventory_serial_no").val(),
            "inventory_user": $("#inventory_user").val(),
            "inventory_department": $("#inventory_department").val(),
            "inventory_date_issue": $("#inventory_date_issue").val(),
            "inventory_description": $("#inventory_description").val()
        };

        $.ajax({
            url: `/inventory-update/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function(response) {
                alert("Inventory updated successfully!");
                // Optionally, you can redirect or update the UI based on the response
                window.location.href= "/inventory-list/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert("Failed to update inventory: " + xhr.responseText);
            }
        });
    });
});