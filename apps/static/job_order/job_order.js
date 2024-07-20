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

$(document).ready(function() {
    // Initialize DataTables on the table
    var table = $('#table_job_order').DataTable();

    function fetchJOData() {
        $.ajax({
            url: '/api-get-job-order-list',
            type: 'GET',
            success: function(data) {
                table.clear(); // Clear any existing data

                data.forEach(function(item) {
                    table.row.add([

                        item.jo_offices,
                        item.jo_department,
                        item.date_created,
                        item.jo_ticket_no,
                        item.jo_requested_by,
                        item.jo_particular,
                        item.jo_status,
                        item.jo_turn_overtime,
                        item.jo_remarks,

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

    // Fetch JOB ORDER data on page load
    fetchJOData();
});



