// this function is for inserting rental printer
$(document).ready(function() {
    $('#btn_save_printer_rental').click(function() {
        var rentalData = {
            company: $('#company').val(),
            printer_model: $('#printer_model').val(),
            serial_no: $('#serial_number').val(),
            validity_date: $('#validity_date').val(),
            monthly_rent: $('#monthly_rent').val(),           
            location: $('#location').val(),

        };

      

        console.log(rentalData)
        $.ajax({
            url: '/api-insert-printer-rent/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify([rentalData]),
            success: function(response) {
                alert('Data has been saved');
                window.location.href = "/rental-printer/"; // Redirect to the inventory list page
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
            url: '/api-get-printer-rental/',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_rental_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + item.company + '</td>');
                    newRow.append('<td>' + item.printer_model + '</td>');
                    newRow.append('<td>' + item.serial_no + '</td>');
                    newRow.append('<td>' + item.location + '</td>');
                    newRow.append('<td>' + item.validity_date + '</td>');
                    newRow.append('<td>' + item.monthly_rent + '</td>');
                  
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
    $('#table_rental').DataTable({
        responsive: true,
        scrollX: true,          // Enable horizontal scrolling if needed
        autoWidth: false,       // Disable fixed width
        scrollY: '350px',       // Set a specific height
        scrollCollapse: true,   // Collapse height if fewer rowsi 
    });
    
};



