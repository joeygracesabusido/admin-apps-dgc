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


// this is to print Purchase Order

const generatePDF = async ()  => {
    try {
        const poNo = document.querySelector('#print_po_number')
        const response = await fetch(`/api-get-purchase-orders-by-po-number/?po_no=${poNo}`);
        const data = await response.json();

        const docDefinition = {
            pageSize: { width: 595.28, height: 396.85 },
            pageOrientation: 'landscape', // Set landscape orientation
            pageMargins: [20, 30, 20, 30],
            content: [
                
                
                // Two columns layout
                {
                    columns: [
                        {
                            width: '*', // Adjust width as needed
                            stack: [
                                { text: 'Purchase Order Details', style: 'header' },
                                { text: `PO Number: ${data.po_no}`, style: 'subheader' },
                                { text: `Company: ${data.company}`, style: 'body' },
                                { text: `Date: ${data.date}`, style: 'body' },
                                { text: `Supplier: ${data.supplier}`, style: 'body' },
                                
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: ['*', '*'], // Each column takes half of the page width
                                        body: [
                                            ['Quantity', 'Description'], // Table headers
                                            [`${data.quantity}`, `${data.description}`] // Table content
                                        ]
                                    },
                                    layout: 'lightHorizontalLines' // Adds horizontal lines to the table
                                },
                                { text: `User: ${data.user}`, style: 'body' },
                               
                            ]
                        },
                        {
                            width: '*', // Adjust width as needed
                            stack: [
                                { text: 'Purchase Order Details', style: 'header' },
                                { text: `PO Number: ${data.po_no}`, style: 'subheader' },
                                { text: `Company: ${data.company}`, style: 'body' },
                                { text: `Date: ${data.date}`, style: 'body' },
                                { text: `Supplier: ${data.supplier}`, style: 'body' },
                                {
                                    table: {
                                        headerRows: 1,
                                        widths: ['*', '*'], // Each column takes half of the page width
                                        body: [
                                            ['Quantity', 'Description'], // Table headers
                                            [`${data.quantity}`, `${data.description}`] // Table content
                                        ]
                                    },
                                    layout: 'lightHorizontalLines' // Adds horizontal lines to the table
                                },
                                { text: `User: ${data.user}`, style: 'body' },
                            ]
                        }
                    ]
                }
            ],
            styles: {
                header: { fontSize: 18, bold: true },
                subheader: { fontSize: 14, margin: [0, 10, 0, 5] },
                body: { fontSize: 12, margin: [0, 5, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).download('Purchase_Order.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

// Attach the event listener to the button
var Btn_print = document.querySelector('#btn_print_purchase_order');
Btn_print.addEventListener("click", generatePDF);