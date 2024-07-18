 // jQuery to open the modal
 $('#insert_invt_items_btn').click(function() {
    $('#insert_invt_items_modal').modal('show');
});



// this function is for inserting inventory list item
$(document).ready(function() {
    $('#btn_save_inventory').click(function() {
        var inventoryData = {
            inventory_company: $('#inventory_company').val(),
            inventory_item: $('#inventory_item').val(),
            inventory_brand: $('#inventory_brand').val(),
            inventory_amount: parseFloat($('#inventory_amount').val()),
            inventory_serial_no: $('#inventory_serial_no').val(),
            inventory_user: $('#inventory_user').val(),
            inventory_department: $('#inventory_department').val(),
            inventory_date_issue: $('#inventory_date_issue').val(),
            inventory_description: $('#inventory_description').val()
        };

        console.log(inventoryData)
        $.ajax({
            url: '/api-insert-inventory-item',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(inventoryData),
            success: function(response) {
                alert('Data has been saved');
                window.location.href = "/inventory-list/"; // Redirect to the inventory list page
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});





$(document).ready(function() {
    // Initialize DataTables on the table
    var table = $('#table_inventory').DataTable();

    function fetchInventoryData() {
        $.ajax({
            url: '/api-get-inventory-list',
            type: 'GET',
            success: function(data) {
                table.clear(); // Clear any existing data

                data.forEach(function(item) {
                    table.row.add([

                        item.inventory_company,
                        item.inventory_item,
                        item.inventory_brand,
                        item.inventory_serial_no,
                        item.inventory_date_issue,
                        item.inventory_user,
                        item.inventory_department,
                        `<td>
                            <a href="/inventory-update/${item.id}">
                                <button type="button" class="btn btn-primary">
                                    <i class="fas fa-database"></i> Edit
                                </button>
                            </a>
                        </td>`
                    ]).draw(false);
                });
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    }

    // Fetch inventory data on page load
    fetchInventoryData();
});


// let table = new DataTable('#table_inventory_list');