$(document).ready(function() {
    $('#btn_save_purchase_order').on('click', function() {
        // Collect form data
        let data = {
            date: $('#date').val(),
            company: $('#company').val(),
            supplier: $('#supplier').val(),
            quantity: $('#quantity').val(),
            description: $('#description').val(),
            user: $('#user').val()
        };

        // Send AJAX request to FastAPI
        $.ajax({
            url: '/api-insert-purchase-orber/', // Your FastAPI endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // Handle success response
                alert(response.message || 'Purchase order saved successfully!');
                window.location.href = "/api-purchase-order-temp/"; // Redirect to the inventory list page
                // $('#insert_invt_items_modal').modal('hide'); // Hide the modal after success
            },
            error: function(xhr, status, error) {
                // Handle error response
                alert('Error: ' + (xhr.responseJSON ? xhr.responseJSON.detail : error));
            }
        });
    });
});


// this function is to display for table the Purchase Order Data
$(document).ready(function() {
    // Function to fetch and display purchase orders
    function fetchAndDisplayPurchaseOrders() {
        $.ajax({
            url: '/api-get-purchase-orders/',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_purchase_order_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + (item.date ? new Date(item.date).toLocaleDateString() : '') + '</td>');
                    newRow.append('<td>' + (item.company || '') + '</td>');
                    newRow.append('<td>' + (item.po_no || '') + '</td>');
                    newRow.append('<td>' + (item.supplier || '') + '</td>');
                    newRow.append('<td>' + item.quantity + '</td>');
                    newRow.append('<td>' + (item.description || '') + '</td>');
                    newRow.append('<td>' + (item.user || '') + '</td>');

                    newRow.append('<td><a href="/job-order/' + item.id + '"> \
                        <button type="button" class="btn btn-primary"> \
                        <i class="fas fa-database"></i> Edit</button></a></td>');
                    
                    
                    // Append the new row to the table body
                    tableBody.append(newRow);
                });

                // Initialize DataTable after adding rows
                initializeDataTable();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching purchase orders:', error);
                alert('Error fetching purchase orders. Please try again later.');
            }
        });
    }

    // Fetch purchase orders on page load
    fetchAndDisplayPurchaseOrders();

    // Initialize DataTable
    const initializeDataTable = () => {
        $('#table_purchase_order').DataTable();
    };
});