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
        $.ajax({
            url: '/api-insert-employee/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                alert('Employee saved successfully');
                window.location.href = "/ticketing/"; // Redirect to the inventory list page
                // Optionally, close the modal
                // $('#insert_employee_modal').modal('hide');
            },
            error: function(xhr, status, error) {
                alert('Failed to save employee: ' + xhr.responseText);
            }
        });
    });
});

// this function is for displaying data from Employee


// $(document).ready(function() {
//     // Fetch data from the API when the document is ready
//     $.ajax({
//         url: '/api-get-employee-list',
//         type: 'GET',
//         success: function(response) {
//             // Clear existing table rows
//             $('#table_employee_list').empty();

//             // Populate table with new data
//             response.forEach(function(item) {
//                 $('#table_employee_list').append(
//                     `<tr>
//                         <td>${item.company}</td>
//                         <td>${item.department}</td>
//                         <td>${item.employee_no}</td>
//                         <td>${item.first_name}</td>
//                         <td>${item.last_name}</td>
//                         <td>${item.designation}</td>
//                         <td>${item.salary_status}</td>
//                         <td>${item.rate}</td>
//                         <td>${item.employee_status}</td>
//                     </tr>`
//                 );
//             });
//         },
//         error: function(xhr, status, error) {
//             console.error('Failed to fetch employee list:', error);
//         }
//     });
// });


$(document).ready(function() {
    // Function to fetch and display job orders

    // var table = $('#table_job_order').DataTable();
    function fetchAndDisplayJobOrders() {
        $.ajax({
            url: '/api-get-employee-list/',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_employee_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + item.company + '</td>');
                    newRow.append('<td>' + item.department + '</td>');
                    newRow.append('<td>' + item.employee_no + '</td>');
                    newRow.append('<td>' + item.first_name + '</td>');
                    newRow.append('<td>' + item.last_name + '</td>');
                    newRow.append('<td>' + item.designation + '</td>');
                    newRow.append('<td>' + item.salary_status + '</td>');
                    newRow.append('<td>' + (item.rate ? item.rate : '') + '</td>');
                    newRow.append('<td>' + (item.employee_status ? item.employee_status : '') + '</td>');
                    newRow.append('<td><a href="/api-update-employee-temp/' + item.id + '"> \
                        <button type="button" class="btn btn-primary"> \
                        <i class="fas fa-database"></i> Edit</button></a></td>');

                    // Append the new row to the table body
                    tableBody.append(newRow);
                    
                    // Apply red color if jo_turn_overtime is empty
                    if (!item.company) {
                        newRow.css('background-color', 'green');
                    }

                   
                });
                initializeDataTable()
            },
            error: function(xhr, status, error) {
                console.error('Error fetching job orders:', error);
                alert('Error fetching job orders. Please try again later.');
            }
        });
    }

    // Fetch job orders on page load
    fetchAndDisplayJobOrders();
});


const initializeDataTable = () => {
    $('#table_employeeList').DataTable();
};


