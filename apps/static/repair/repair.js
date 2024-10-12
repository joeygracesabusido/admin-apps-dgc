// this function is for inserting job order list item
$(document).ready(function() {
    $('#btn_save_repair').click(function() {
        var repairData = {
            company: $('#company').val(),
            srs: $('#srs').val(),
            repair_date: $('#repair_date').val(),
            brand: $('#brand').val(),
            model: $('#model').val(),           
            serial_number: $('#serial_number').val(),
            remarks: $('#remarks').val(),           
            repair_user: $('#repair_user').val(),
            amount: $('#amount').val(),           
            department: $('#department').val(),

        };

      

        console.log(repairData)
        $.ajax({
            url: '/api-insert-repair-item',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(repairData),
            success: function(response) {
                alert('Data has been saved');
                window.location.href = "/api-repair/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});


//this function is to display data from repair table

$(document).ready(function() {
    // Function to fetch and display job orders

    // var table = $('#table_job_order').DataTable();
    function fetchAndDisplayJobOrders() {
        $.ajax({
            url: '/api-get-repair-list/',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_repair_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + item.company + '</td>');
                    newRow.append('<td>' + item.srs + '</td>');
                    newRow.append('<td>' + item.repair_date + '</td>');
                    newRow.append('<td>' + item.brand + '</td>');
                    newRow.append('<td>' + item.model + '</td>');
                    newRow.append('<td>' + item.serial_number + '</td>');
                    newRow.append('<td>' + item.remarks + '</td>');                  
                    newRow.append('<td>' + item.repair_user + '</td>');
                    newRow.append('<td>' + item.amount + '</td>');
                    newRow.append('<td>' + item.department + '</td>');
                    newRow.append('<td><a href="/api-update-repair/' + item.id + '"> \
                        <button type="button" class="btn btn-primary"> \
                        <i class="fas fa-database"></i> Edit</button></a></td>');

                    // Append the new row to the table body
                    tableBody.append(newRow);
                    
                    // Apply red color if jo_turn_overtime is empty
                    if (!item.company) {
                        newRow.css('background-color', 'white');
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
    $('#table_repair').DataTable();
};



