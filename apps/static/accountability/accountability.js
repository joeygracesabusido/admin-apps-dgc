$(document).ready(function() {
    // Add Accountability Item
    $('#btn_save_accountability').click(function() {
        const accountabilityData = {
            date: $('#trans_date').val(),
            company: $('#company').val(),
            name: $('#name').val(),
            position: $('#position').val(),
            department: $('#department').val(),
            item: $('#item').val(),
            item_description: $('#item_description').val(),
            serial_no_model_no: $('#serial_no_model_no').val(),
            remarks: $('#remarks').val()
        };

        $.ajax({
            url: '/api-insert-accountability-item',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(accountabilityData),
            success: function(response) {
                alert(response.message);
                loadAccountabilityList();
                $('#myForm')[0].reset(); // Clear the form fields
            },
            error: function(err) {
                console.log(err);
                alert("Error saving data");
            }
        });
    });

    // Load Accountability List
    function loadAccountabilityList() {
        $.ajax({
            url: '/api-get-accountability-list/',
            type: 'GET',
            success: function(data) {
                $('#table_accountability_list').empty();
                data.forEach(item => {
                    const formattedDate = item.date.split('T')[0];
                    $('#table_accountability_list').append(`
                        
                        <tr data-id="${item.id}">
                            
                            <td>${formattedDate}</td>
                            <td>${item.company}</td>
                            <td>${item.name}</td>
                            <td>${item.position}</td>
                            <td>${item.department}</td>
                            <td>${item.item}</td>
                            <td>${item.item_description}</td>
                            <td>${item.serial_no_model_no}</td>
                            <td>${item.remarks}</td>
                        </tr>
                    `);
                });

                initializeDataTable2()
            },
            error: function(err) {
                console.log(err);
                alert("Error loading accountability list");
            }
        });
    }

    // for double click to display
    $('#table_accountability_list').on('dblclick', 'tr', function() {
        const accountabilityId = $(this).data('id');
        console.log(`Selected accountabilityId: ${accountabilityId}`); // Log to confirm ID is selected
    
        $.ajax({
            url: `/api-update-accountability/${accountabilityId}`,  // Fetch specific item data
            type: 'GET',
            success: function(data) {
                console.log(data); // Log response to inspect structure
    
                // Ensure data is an array and has at least one item
                if (data) {
                    // const item = data[0];  // Get the first item in the array

                    // Extract the date part from "2024-10-01T00:00:00"
                    const formattedDate = data.date.split('T')[0];
    
                    // Populate form fields with data from the item
                    $('#trans_date').val(formattedDate);
                    $('#company').val(data.company);
                    $('#name').val(data.name);
                    $('#position').val(data.position);
                    $('#department').val(data.department);
                    $('#item').val(data.item);
                    $('#item_description').val(data.item_description);
                    $('#serial_no_model_no').val(data.serial_no_model_no);
                    $('#remarks').val(data.remarks);
    
                    $('#btn_save_accountability').hide();
                    $('#btn_update_accountability').show().data('id', accountabilityId);
                } else {
                    alert("No data found for selected item.");
                }

                initializeDataTable2()
            },
            error: function(err) {
                console.log(err);
                alert("Error loading data for update");
            }
        });
    });

    // Update Accountability Item
    $('#btn_update_accountability').click(function() {
        const accountabilityId = $(this).data('id');
        const updatedData = {
            date: $('#trans_date').val(),
            company: $('#company').val(),
            name: $('#name').val(),
            position: $('#position').val(),
            department: $('#department').val(),
            item: $('#item').val(),
            item_description: $('#item_description').val(),
            serial_no_model_no: $('#serial_no_model_no').val(),
            remarks: $('#remarks').val()
        };

        $.ajax({
            url: `/accountability-update/${accountabilityId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(response) {
                alert("Data has been updated");
                loadAccountabilityList();
                $('#myForm')[0].reset();
                $('#btn_save_accountability').show();
                $('#btn_update_accountability').hide();
            },
            error: function(err) {
                console.log(err);
                alert("Error updating data");
            }
        });
    });

    // Initial Setup
    loadAccountabilityList();
    $('#btn_update_accountability').hide(); // Hide update button by default
});


const initializeDataTable2 = () => {
    new DataTable('#table_accountability', {
        perPage: 10,
        searchable: true,
        sortable: true,

        responsive: true,
        scrollX: true,          // Enable horizontal scrolling if needed
        autoWidth: false,       // Disable fixed width
        scrollY: '350px',       // Set a specific height
        scrollCollapse: true,
        destroy: true // Destroy any existing DataTable instance
    });
}
