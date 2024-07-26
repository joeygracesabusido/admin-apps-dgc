// this function is for inserting job order list item
$(document).ready(function() {
    $('#btn_save_job_order').click(function() {
        var inventoryData = {
            jo_offices: $('#jo_offices').val(),
            jo_department: $('#jo_department').val(),
            jo_requested_by: $('#jo_requested_by').val(),
            jo_particular: $('#jo_particular').val(),
            jo_status: $('#jo_status').val(),
        };

        console.log(inventoryData)
        $.ajax({
            url: '/api-insert-job-order',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(inventoryData),
            success: function(response) {
                alert('Data has been saved');
                window.location.href = "/ticketing/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});


// this function is for displaying data from Job order table

// $(document).ready(function() {
//     // Initialize DataTables on the table
//     var table = $('#table_job_order').DataTable();

//     function fetchJOData() {
//         $.ajax({
//             url: '/api-get-job-order-list',
//             type: 'GET',
//             success: function(data) {
//                 table.clear(); // Clear any existing data

//                 data.forEach(function(item) {
//                     var newRow = table.row.add([
//                         item.jo_offices,
//                         item.jo_department,
//                         item.date_created,
//                         item.jo_ticket_no,
//                         item.jo_requested_by,
//                         item.jo_particular,
//                         item.jo_status,
//                         item.jo_turn_overtime,
//                         item.jo_remarks,
//                         `<td>
//                             <a href="/job-order/${item.id}">
//                                 <button type="button" class="btn btn-primary">
//                                     <i class="fas fa-database"></i> Edit
//                                 </button>
//                             </a>
//                         </td>`
//                     ]).draw(false).node();

//                     // Apply red color if jo_turn_overtime is empty
//                     if (!item.jo_turn_overtime) {
//                         $(newRow).css('background-color', 'green');
//                     }
//                 });
//             },
//             error: function(xhr, status, error) {
//                 alert('Error: ' + error);
//             }
//         });
//     }

//     // Fetch JOB ORDER data on page load
//     fetchJOData();
// });


$(document).ready(function() {
    // Function to fetch and display job orders

    // var table = $('#table_job_order').DataTable();
    function fetchAndDisplayJobOrders() {
        $.ajax({
            url: '/api-get-job-order-list',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_job_order_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + item.jo_offices + '</td>');
                    newRow.append('<td>' + item.jo_department + '</td>');
                    newRow.append('<td>' + item.date_created + '</td>');
                    newRow.append('<td>' + item.jo_ticket_no + '</td>');
                    newRow.append('<td>' + item.jo_requested_by + '</td>');
                    newRow.append('<td>' + item.jo_particular + '</td>');
                    newRow.append('<td>' + item.jo_status + '</td>');
                    newRow.append('<td>' + (item.jo_turn_overtime ? item.jo_turn_overtime : '') + '</td>');
                    newRow.append('<td>' + (item.jo_remarks ? item.jo_remarks : '') + '</td>');
                    newRow.append('<td><a href="/job-order/' + item.id + '"> \
                        <button type="button" class="btn btn-primary"> \
                        <i class="fas fa-database"></i> Edit</button></a></td>');

                    // Append the new row to the table body
                    tableBody.append(newRow);
                    
                    // Apply red color if jo_turn_overtime is empty
                    if (!item.jo_turn_overtime) {
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
    $('#table_job_order').DataTable();
};

// let table = $('#table_job_order').DataTable();




// $(document).ready(function() {
//     // Initialize DataTables on the table
//     var table = $('#table_job_order').DataTable();

//     function fetchJOData() {
//         $.ajax({
//             url: '/api-get-job-order-list',
//             type: 'GET',
//             success: function(data) {
//                 table.clear(); // Clear any existing data

//                 data.forEach(function(item) {
//                     table.row.add([

//                         item.jo_offices,
//                         item.jo_department,
//                         item.date_created,
//                         item.jo_ticket_no,
//                         item.jo_requested_by,
//                         item.jo_particular,
//                         item.jo_status,
//                         item.jo_turn_overtime,
//                         item.jo_remarks,

//                         `<td>
//                             <a href="/job-order/${item.id}">
//                                 <button type="button" class="btn btn-primary">
//                                     <i class="fas fa-database"></i> Edit
//                                 </button>
//                             </a>
//                         </td>`
//                     ]).draw(false);
//                 });
//             },
//             error: function(xhr, status, error) {
//                 alert('Error: ' + error);
//             }
//         });
//     }

//     // Fetch JOB ORDER data on page load
//     fetchJOData();
// });



