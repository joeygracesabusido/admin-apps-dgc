 // jQuery to open the modal
 $('#insert_invt_items_btn').click(function() {
    $('#insert_invt_items_modal').modal('show');
});



// // this function is for inserting inventory list item
// $(document).ready(function() {
//     $('#btn_save_inventory').click(function() {
//         var inventoryData = {
//             inventory_company: $('#jo_offices').val(),
//             inventory_item: $('#inventory_item').val(),
//             inventory_purchase_date: $('#inventory_purchase_date').val(),
//             inventory_si_no: $('#inventory_si_no').val(),
//             inventory_quantity: $('#inventory_quantity').val(),
//             inventory_brand: $('#inventory_brand').val(),
//             inventory_amount: parseFloat($('#inventory_amount').val()),
//             inventory_serial_no: $('#inventory_serial_no').val(),
//             inventory_user: $('#inventory_user').val(),
//             inventory_department: $('#inventory_department').val(),
//             inventory_date_issue: $('#inventory_date_issue').val(),
//             inventory_description: $('#inventory_description').val()
//         };

//         console.log(inventoryData)
//         $.ajax({
//             url: '/api-insert-inventory-item',
//             type: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(inventoryData),
//             success: function(response) {
//                 alert('Data has been saved');
//                 window.location.href = "/inventory-list/"; // Redirect to the inventory list page
//             },
//             error: function(xhr, status, error) {
//                 alert('Error: ' + error);
//             }
//         });
//     });
// });





// $(document).ready(function() {
//     // Initialize DataTables on the table
//     var table = $('#table_inventory').DataTable();
//     // initializeDataTable()
//     function fetchInventoryData() {
//         $.ajax({
//             url: '/api-get-inventory-list',
//             type: 'GET',
//             success: function(data) {
//                 table.clear(); // Clear any existing data

//                 data.forEach(function(item) {
//                     table.row.add([

//                         item.inventory_company,
//                         item.inventory_item,
//                         item.inventory_purchase_date,
//                         item.inventory_si_no,
//                         item.inventory_quantity,
//                         item.inventory_brand,
//                         item.inventory_serial_no,
//                         item.inventory_date_issue,
//                         item.inventory_user,
//                         item.inventory_department,
//                         `<td>
//                             <a href="/inventory-update/${item.id}">
//                                 <button type="button" class="btn btn-primary">
//                                     <i class="fas fa-database"></i> Edit
//                                 </button>
//                             </a>
//                         </td>`
//                     ]).draw(false);
                   
//                 });
//                 // initializeDataTable()
//             },
            

//             error: function(xhr, status, error) {
//                 alert('Error: ' + error);
//             }
//         });
//     }

//     // Fetch inventory data on page load
//     fetchInventoryData();
// });


$(document).ready(function() {
   
    function fetchAndDisplayInventoryList() {
        $.ajax({
            url: '/api-get-inventory-list',  // API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tableBody = $('#table_inventory_list');
                tableBody.empty();  // Clear existing table rows
                
                // Iterate over each item in the data
                data.forEach(function(item) {
                    // Create a new row
                    var newRow = $('<tr></tr>');

                    // Append cells to the row
                    newRow.append('<td>' + item.inventory_company + '</td>');
                    newRow.append('<td>' + item.inventory_item + '</td>');
                    newRow.append('<td>' + item.inventory_purchase_date + '</td>');
                    newRow.append('<td>' + item.inventory_si_no + '</td>');
                    newRow.append('<td>' + item.inventory_quantity + '</td>');
                    newRow.append('<td>' + item.inventory_brand + '</td>');
                    newRow.append('<td>' + item.inventory_serial_no + '</td>');
                    newRow.append('<td>' + item.inventory_date_issue + '</td>');
                    newRow.append('<td>' + item.inventory_user + '</td>');
                    newRow.append('<td>' + item.inventory_department + '</td>');
                    newRow.append('<td>' + item.inventory_amount + '</td>');
                    newRow.append('<td><a href="/inventory-update/' + item.id + '"> \
                        <button type="button" class="btn btn-primary"> \
                        <i class="fas fa-database"></i> Edit</button></a></td>');

                    // Append the new row to the table body
                    tableBody.append(newRow);
                    
                    // Apply red color if jo_turn_overtime is empty
                    if (!item.inventory_item) {
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
    fetchAndDisplayInventoryList();
});



const initializeDataTable = () => {
    $('#table_inventory').DataTable();
};

// let table = new DataTable('#table_inventory_list');
 


$(document).ready(function () {
    var maxField = 10; // Input fields increment limitation
    var addButton = $('#add_button'); // Add button selector
    var wrapper = $('#addrow'); // Input field wrapper
    var x = 0; // Initial field counter

    // Function to format number with thousand separator
    function formatNumberWithSeparator(value) {
        return parseFloat(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Function to remove thousand separators and convert back to a number
    function parseFormattedNumber(value) {
        return value.replace(/,/g, '');
    }

    // Once add button is clicked
    $(addButton).click(function () {
        // Check maximum number of input fields
        x++; // Increment field counter
        var fieldHTML = `
            <tr>
                <td style="padding: 0; margin: 0;">
                    <input type="text" 
                    name="inventory_quantity${x}"
                    id="inventory_quantity${x}"
                    
                    step="0.01"
                     />
                </td>
 
          

                <td style="padding: 0; margin: 0;">
                    <input type="text" 
                    name="inventory_brand${x}" 
                    id="inventory_brand${x}"
                    
                    step="0.01"
                     />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="inventory_amount${x}"
                        id="inventory_amount${x}"
                        
                    />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="inventory_serial_no${x}"
                        id="inventory_serial_no${x}"
                        step="0.01"
                    />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="inventory_user${x}"
                        id="inventory_user${x}"
                        
                        step="0.01"
                    />
                </td>

                 <td style="padding: 0; margin: 0;">
                    <select class="form-select" id="inventory_department${x}" name="inventory_department${x}" aria-label="Floating label select example">
                            <option selected>----Select Menu----</option>
                            <option value="Admin">Admin</option>
                            <option value="Accounting">Accounting</option>
                            <option value="HR">HR</option>
                            <option value="Engineering-Antipolo">Engineering-Antipolo</option>
                            <option value="Engineering-Cavite">Engineering-Cavite</option>
                            <option value="Legal">Legal</option>
                            <option value="Permits">Permits</option>
                            <option value="Sales & Docs">Sales & Docs</option>
                            <option value
                    </select>
                </td>


                <td style="padding: 0; margin: 0;">
                    <input
                        type="date"
                        name="inventory_date_issue${x}"
                        id="inventory_date_issue${x}"
                        
                        step="0.01"

                        
                    />
                </td>

                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="inventory_description${x}"
                        id="inventory_description"${x}"
                        
                        step="0.01"

                        
                    />
                </td>


                
                
                
                <td style="padding: 0; margin: 0;">
                    <button type="button" id="remove_button" class="btn btn-danger">
                        <i class="fas fa-database"></i> Remove
                    </button>
                </td>

               

                

                
            </tr>`; // New input field HTML

        $(wrapper).append(fieldHTML); // Add field HTML
    });

    // Event delegation for input blur to handle formatting
    $(document).on('blur', 'input[name^="amount"], input[name^="credit_amount"]', function () {
        let input = $(this);
        let inputValue = input.val().trim();
        if (inputValue !== '' && !isNaN(inputValue)) {
            input.val(formatNumberWithSeparator(parseFormattedNumber(inputValue)));
        }
        //myFunction2();
    });

    // Event delegation for input focus to handle formatting
    $(document).on('focus', 'input[name^="amount"], input[name^="credit_amount"]', function () {
        let input = $(this);
        let inputValue = input.val().trim();
        input.val(parseFormattedNumber(inputValue)); // Remove formatting for editing
        //myFunction2();
    });

    // Once remove button is clicked
    $(wrapper).on('click', '#remove_button', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove(); // Remove field HTML 
       // myFunction2();
        x--; // Decrement field counter
    });

    // Autocomplete for accountTitle

    
});



// this is to insert data

$(document).ready(function() {
    // Event listener for the "Save changes" button
    $('#btn_save_inventory').click(function() {
        // Initialize an array to hold the inventory items
        let inventoryItems = [];

        // Loop through each row in the table body (with ID `addrow`)
        $('#addrow tr').each(function() {
            // Collect data from each input field inside the current row
            let inventoryItem = {
                inventory_company: $('#jo_offices').val(),
                inventory_item: $('#inventory_item').val(),
                inventory_purchase_date: $('#inventory_purchase_date').val(),
                inventory_si_no: $('#inventory_si_no').val(),
                inventory_quantity: $(this).find('input[name^="inventory_quantity"]').val(),
                inventory_brand: $(this).find('input[name^="inventory_brand"]').val(),
                inventory_amount: $(this).find('input[name^="inventory_amount"]').val(),
                inventory_serial_no: $(this).find('input[name^="inventory_serial_no"]').val(),
                inventory_user: $(this).find('input[name^="inventory_user"]').val(),
                inventory_department: $(this).find('select[name^="inventory_department"]').val(),
                inventory_date_issue: $(this).find('input[name^="inventory_date_issue"]').val(),
                inventory_description: $(this).find('input[name^="inventory_description"]').val()
            };

            // Add this item to the array
            inventoryItems.push(inventoryItem);
        });

        // AJAX POST request to submit the data to the FastAPI backend
        $.ajax({
            url: '/api-insert-inventory-item',  // FastAPI endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(inventoryItems),  // Send the array of inventory items
            success: function(response) {
                // Success handling: Display a success message, close the modal, or refresh the table
                alert(response.message);
                $('#insert_invt_items_modal').modal('hide');
                window.location.href = "/inventory-list/"; 
                // Optionally, you can refresh the table or redirect
            },
            error: function(xhr, status, error) {
                // Error handling: Display an error message
                alert('Error: ' + error);
            }
        });
    });

})

