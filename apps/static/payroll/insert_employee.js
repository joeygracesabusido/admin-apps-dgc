// this function is for inserting 

$(document).ready(function() {
    // Handle the "Save changes" button click
    $('#btn_save_employee').click(function() {
        // Collect data from the form
        var data = {
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
        console.log(data)

        // Send the data to the FastAPI endpoint
        // $.ajax({
        //     url: '/api-insert-employee/',
        //     type: 'POST',
        //     contentType: 'application/json',
        //     data: JSON.stringify(data),
        //     success: function(response) {
        //         alert('Employee saved successfully');
        //         window.location.href = "/ticketing/"; // Redirect to the inventory list page
        //         // Optionally, close the modal
        //         // $('#insert_employee_modal').modal('hide');
        //     },
        //     error: function(xhr, status, error) {
        //         alert('Failed to save employee: ' + xhr.responseText);
        //     }
        // });
    });
});

// this function is for displaying data from Employee


$(document).ready(function() {
    // Fetch data from the API when the document is ready
    $.ajax({
        url: '/api-get-employee-list',
        type: 'GET',
        success: function(response) {
            // Clear existing table rows
            $('#table_employee_list').empty();

            // Populate table with new data
            response.forEach(function(item) {
                $('#table_employee_list').append(
                    `<tr>
                        <td>${item.company}</td>
                        <td>${item.department}</td>
                        <td>${item.employee_no}</td>
                        <td>${item.first_name}</td>
                        <td>${item.last_name}</td>
                        <td>${item.designation}</td>
                        <td>${item.salary_status}</td>
                        <td>${item.rate}</td>
                        <td>${item.employee_status}</td>
                    </tr>`
                );
            });
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch employee list:', error);
        }
    });
});


