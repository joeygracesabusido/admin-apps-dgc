$(document).ready(function() {
    $("#update_repair_btn").click(function(event) {
        event.preventDefault();

        var id = $("#repair_id").val(); 
        var updateData = {
            
            "company": $("#company").val(),
            "repair_date": $("#repair_date").val(),
            "srs": $("#srs").val(),
            "brand": $("#brand").val(),
            "model": $("#model").val(),
            "serial_number": $("#serial_number").val(),
            "remarks": $("#remarks").val(),
            "repair_user": $("#repair_user").val(),
            "amount": $("#amount").val(),
            "department": $("#department").val()
        };

        $.ajax({
            url: `/repair-update/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function(response) {
                alert("Repair updated successfully!");
                // Optionally, you can redirect or update the UI based on the response
                window.location.href= "/api-repair/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert("Failed to update inventory: " + xhr.responseText);
            }
        });
    });
});
