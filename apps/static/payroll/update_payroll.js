$(document).ready(function() {
    $('#btn_update_employee').on('click', function() {
        // Collect form data
        const id = $('#trans_id').val(); // Replace with the actual ID you want to update
        
        const employeeData = {
            company: $('#company').val(),
            department: $('#department').val(),
            employee_no: $('#employee_no').val(),
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            designation: $('#designation').val(),
            salary_status: $('#salary_status').val(),
            rate: $('#rate').val(),
            employee_status: $('#employee_status').val()
        };
        // console.log(employeeData)
        // Send AJAX request
        $.ajax({
            url: `/api-update-employee/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(employeeData),
            success: function(response) {
                alert('Data has been updated successfully.');
                window.location.href = "/api-payroll-temp/"; // Redirect to the inventory list page
                // Optionally, you can redirect or clear the form here
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + xhr.responseText);
            }
        });
    });
});