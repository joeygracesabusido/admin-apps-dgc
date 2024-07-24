$(document).ready(function() {
    $("#btn_update_jo").click(function(event) {
        event.preventDefault();

        var id = $("#update_jo_id").val(); // Assuming you have an input field with id="inventory_id" to hold the inventory ID
        var updateData = {
            
            "jo_status": $("#jo_status").val(),
            "jo_remarks": $("#jo_remarks").val()
        };

        $.ajax({
            url: `/api-update-job-order/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function(response) {
                alert("Job Order updated successfully!");
                // Optionally, you can redirect or update the UI based on the response
                window.location.href= "/ticketing/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert("Failed to update inventory: " + xhr.responseText);
            }
        });
    });
});