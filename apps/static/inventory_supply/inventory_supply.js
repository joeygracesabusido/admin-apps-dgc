

function fetchInventory() {
        $.ajax({
            url: '/mygraphql/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                query: `  
                    query {
                        
                      getInventoryWithSupplier {
                                id
                                itemCode
                                name
                                category
                                description
                                quantityInStock
                                unit
                                reorderLevel
                                pricePerUnit
                                supplierId
                                user
                                

                         }


                    }
                `
            }),
            success: function (response) {

                console.log(response);
                let tableBody = $("#supplier_table tbody");
                tableBody.empty();

                let data = response.data.getInventoryWithSupplier;
                data.forEach(function (supp) {
                    let row = `
                        <tr class="text-sm clickable-row cursor-pointer hover:bg-gray-100"
                            data-id="${supp.id}"
                            data-item-code="${supp.itemCode}"
                            data-name="${supp.name}"
                            data-category="${supp.category || ''}"
                            data-description="${supp.description || ''}"
                            data-quantity="${supp.quantityInStock || ''}"
                            data-unit="${supp.unit || ''}"
                            data-reorder-level="${supp.reorderLevel || ''}"
                            data-price="${supp.pricePerUnit || ''}"
                            data-supplier="${supp.supplierId || ''}"
                            data-user="${supp.user || ''}">
                            <td>${supp.itemCode}</td>
                            <td>${supp.name}</td>
                            <td>${supp.category || ''}</td>
                            <td>${supp.description || ''}</td>
                            <td>${supp.quantityInStock || ''}</td>
                            <td>${supp.unit || ''}</td>
                            <td>${supp.reorderLevel || ''}</td>
                            <td>${supp.pricePerUnit || ''}</td>
                            <td>${supp.supplierId}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });

                // Add click handlers to table rows
                // addRowClickHandlers();

                // Initialize DataTable after data load
                initDataTable();
            },
            error: function (xhr) {
                console.error("❌ Error fetching GraphQL data:", xhr);
                alert("Failed to load data");
            }
        });


      
    }

fetchInventory();

// Global variable to store selected row data
let selectedRowData = null;

// Function to add click handlers to table rows
function addRowClickHandlers() {
    $('.clickable-row').off('click').on('click', function() {
        // Remove previous selection styling
        $('.clickable-row').removeClass('bg-blue-100 selected-row');

        // Add selection styling to clicked row
        $(this).addClass('bg-blue-100 selected-row');

        // Store the selected row data
        selectedRowData = {
            id: $(this).data('id'),
            itemCode: $(this).data('item-code'),
            name: $(this).data('name'),
            category: $(this).data('category'),
            description: $(this).data('description'),
            quantity: $(this).data('quantity'),
            unit: $(this).data('unit'),
            reorderLevel: $(this).data('reorder-level'),
            price: $(this).data('price'),
            supplier: $(this).data('supplier'),
            user: $(this).data('user')
        };

        console.log('Row selected:', selectedRowData);

        // Enable the update button (this might not be needed if modal opens directly)
        $('#updateItemBtn').prop('disabled', false).removeClass('opacity-50');

        // Show a visual indicator that row is selected (might not be needed)
        $('#updateItemBtn').html('<i class="fas fa-edit mr-2"></i>Update Selected Item');

        // Populate the update form and open the modal
        if (populateUpdateForm()) {
            const modalElement = document.getElementById("itemDetailsModal");
            if (modalElement) {
                modalElement.classList.remove("hidden");
                modalElement.style.setProperty('display', 'flex', 'important'); // Use setProperty with !important
            }
        }
    });
}

// Function to populate the update form with selected row data
function populateUpdateForm() {
    if (!selectedRowData) {
        alert('Please select a row from the table first!');
        return false;
    }

    // Populate the update form fields
    $('#itemId').val(selectedRowData.id);
    $('#itemCode').val(selectedRowData.itemCode);
    $('#itemName').val(selectedRowData.name);
    $('#itemCategory').val(selectedRowData.category);
    $('#itemDescription').val(selectedRowData.description);
    $('#itemQuantity').val(selectedRowData.quantity);
    $('#itemUnit').val(selectedRowData.unit);
    $('#itemReorderLevel').val(selectedRowData.reorderLevel);
    $('#itemPrice').val(selectedRowData.price);
    $('#itemSupplier').val(selectedRowData.supplier);

    console.log('Update form populated with:', selectedRowData);
    return true;
}


function initDataTable() {
    if ($.fn.DataTable.isDataTable("#supplier_table")) {
        $('#supplier_table').DataTable().destroy();
    }

    new DataTable('#supplier_table', {
        layout: { topStart: 'buttons' },
        buttons: ['copy', {
            extend: 'csv',
            filename: 'Supplier',
            title: 'Supplier'
        }],
        perPage: 10,
        searchable: true,
        sortable: true,
        responsive: true,
        scrollX: true,
        scrollY: true,
        scrollCollapse: true,
        width: false,
        initComplete: function() {
            addRowClickHandlers();
            console.log("DataTable initialized and click handlers re-attached.");
        }
    });
}


$(document).ready(function() {
    $("#addSupplierBtn").click(function() {
      $("#supplierModal").removeClass("hidden");
        setSupplierAutocomplete();
        
    });
    

        
  
    // this is for Update function Modal insertBtn
     $("#updateItemBtn").click(function() {
        // Check if a row is selected and populate the form
        if (populateUpdateForm()) {
            $("#itemDetailsModal").removeClass("hidden");
        }
    });

    // Optional: Close modal when clicking "Cancel"
    $(".close-modal").click(function() {
      $(".z-10").addClass("hidden");
      $(".z-10").css('display', 'none'); // Ensure it's hidden
    });
    
     // $("#updateBtn").click(function (e) {
     //    e.preventDefault();
     //    updateSupplier();
     //  });


  });



setSupplierAutocomplete();
// this function is for autocomplete of supplier_table
 function setSupplierAutocomplete() {
  $("#supplier_id").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "/mygraphql", // GraphQL endpoint
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          query: `
            query getSupplierAutocomplete($searchTerm: String!) {
              getSupplierAutocomplete(searchTerm: $searchTerm) {
                id
                name
              }
            }
          `,
          variables: {
            searchTerm: request.term
          }
        }),
        success: function(res) {
          if (res.data && res.data.getSupplierAutocomplete) {
            let suggestions = res.data.getSupplierAutocomplete.map(item => ({
              label: item.name,
              value: item.id,
              
              }));
            response(suggestions);
          }
        },
        error: function(err) {
          console.error("GraphQL Autocomplete error:", err);
        }
      });
    },
    minLength: 0,
    select: function(event, ui) {
      $("#supplier_id").val(ui.item.value);
      return false;
    }
  });
}



//this function is to Insert Inventory by clicking the button
 

$(document).on('click', '#insertBtn', function () {
  insertInventory();
})


// this function is for inserting inventory module


function insertInventory() {
  const itemCode = $('#item_code').val();
  const name = $('#name').val();
  const description = $('#description').val();
  const category = $('#category').val();
  const quantityInStock = parseFloat($('#quantity_in_stock').val()) || 0;
  const unit = $('#unit').val();
  const reorderLevel = parseFloat($('#reorder_level').val()) || 0;
  const pricePerUnit = parseFloat($('#price_per_unit').val()) || 0;

  const supplierId = $('#supplier_id').val();
 

  // Optional: Escape double quotes
  const escape = (str) => (str || '').toString().replace(/"/g, '"');

  const query = `
    mutation {
      insertInventorySupplyItem(
        inventoryItems: {
          itemCode: "${escape(itemCode)}"
          name: "${escape(name)}"
          description: "${escape(description)}"
          category: "${escape(category)}"
          quantityInStock: ${quantityInStock}
          unit: "${escape(unit)}"
          reorderLevel: ${reorderLevel}
          pricePerUnit: ${pricePerUnit}
          supplierId: "${escape(supplierId)}"


        }
      )
    }
  `;

  $.ajax({
    url: '/mygraphql', // Update this to your actual GraphQL endpoint
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ query: query }),
    success: function (response) {
      if (response.data && response.data.insertInventorySupplyItem) {
        alert('Inventory inserted successfully!');
        $('#supplierModal').addClass('hidden');
        // Optionally clear inputs
       // $('#name, #contact_person, #email, #phone, #address').val('');
        // Optionally refresh the supplier table,
				location.reload();
      } else {
        alert('Failed to insert Inventory.');
      }
    },
    error: function (xhr, status, error) {
      alert('Error: ' + xhr.responseText);
    }
  });

}


document.addEventListener('DOMContentLoaded', function() {
    const updateItemCodeInput = document.getElementById('update_item_code');

    if (updateItemCodeInput) {
        updateItemCodeInput.addEventListener('input', function() {
            const itemCode = this.value.trim();
            if (itemCode) {
                fetch(`/inventory_supply/item_code/${itemCode}`)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                console.log('Item not found for code:', itemCode);
                                // Clear fields if item not found
                                document.getElementById('update_item_name').value = '';
                                document.getElementById('update_unit').value = '';
                                document.getElementById('update_quantity').value = '';
                                document.getElementById('update_price').value = '';
                                document.getElementById('update_supplier').value = '';
                                document.getElementById('update_date_stock_in').value = '';
                                document.getElementById('update_expiration_date').value = '';
                                return;
                            }
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            document.getElementById('update_item_name').value = data.item_name || '';
                            document.getElementById('update_unit').value = data.unit || '';
                            document.getElementById('update_quantity').value = data.quantity || '';
                            document.getElementById('update_price').value = data.price || '';
                            document.getElementById('update_supplier').value = data.supplier || '';
                            document.getElementById('update_date_stock_in').value = data.date_stock_in || '';
                            document.getElementById('update_expiration_date').value = data.expiration_date || '';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching item details:', error);
                    });
            } else {
                // Clear fields if item code is empty
                document.getElementById('update_item_name').value = '';
                document.getElementById('update_unit').value = '';
                document.getElementById('update_quantity').value = '';
                document.getElementById('update_price').value = '';
                document.getElementById('update_supplier').value = '';
                document.getElementById('update_date_stock_in').value = '';
                document.getElementById('update_expiration_date').value = '';
            }
        });
    }
});



$(document).ready(function() {
    console.log('🧪 CLEAN ENHANCED TEMPLATE JAVASCRIPT IS LOADING!');

    // Debug: Check if table and rows exist
    

    // Debug logs
    console.log('Clean enhanced template loaded');
    console.log('Add button exists:', $("#addSupplierBtn").length);
    console.log('Modal exists:', $("#supplierModal").length);

    // Wait a bit for original script to load, then override
    setTimeout(function() {
        console.log('🔧 Overriding Add Inventory button...');

        // Remove all existing handlers and add our enhanced handler
        $("#addSupplierBtn").off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Add Inventory button clicked (CLEAN ENHANCED VERSION)');

            const modal = $("#supplierModal");
            console.log('Modal element:', modal);
            console.log('Modal length:', modal.length);

            if (modal.length > 0) {
                console.log('🔧 Showing modal...');

                // Force remove all hiding classes and styles
                modal.removeClass('hidden');
                modal.addClass('modal-show');

                // Use direct DOM manipulation for more reliable CSS application
                const modalElement = modal[0];
                modalElement.style.cssText = `
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    z-index: 9999 !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0, 0, 0, 0.8) !important;
                    align-items: center !important;
                    justify-content: center !important;
                `;

                // Also ensure the modal content has proper dimensions
                const modalContent = modal.find('.rounded-2xl');
                if (modalContent.length > 0) {
                    const contentElement = modalContent[0];
                    contentElement.style.cssText = `
                        width: auto !important;
                        max-width: 600px !important;
                        min-height: 400px !important;
                        background: white !important;
                        border-radius: 16px !important;
                        padding: 20px !important;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                    `;
                }

                modal.show();

                // Double check if modal is visible
                console.log('Modal display style:', modal.css('display'));
                console.log('Modal visibility:', modal.css('visibility'));
                console.log('Modal opacity:', modal.css('opacity'));
                console.log('Modal z-index:', modal.css('z-index'));
                console.log('Modal position:', modal.css('position'));
                console.log('Modal has hidden class:', modal.hasClass('hidden'));

                // Check if modal is in viewport
                const rect = modal[0].getBoundingClientRect();
                console.log('Modal position in viewport:', rect);
                console.log('Modal is in viewport:', rect.top >= 0 && rect.left >= 0);

                // Check modal content dimensions (reuse existing modalContent variable)
                if (modalContent.length > 0) {
                    const contentRect = modalContent[0].getBoundingClientRect();
                    console.log('Modal content dimensions:', contentRect);
                    console.log('Modal content has height:', contentRect.height > 0);
                } else {
                    console.log('Modal content not found');
                }

                console.log('✅ Modal should be visible now');

                // Call existing function if available
                if (typeof setSupplierAutocomplete === 'function') {
                    console.log('🔧 Calling setSupplierAutocomplete...');
                    setSupplierAutocomplete();
                }
            } else {
                console.error('❌ Modal not found when trying to show it');
            }

            return false;
        });


        




        // Override Update button too
        $("#updateSupplierBtn").off('click').on('click', function(e) {
            e.preventDefault();
            console.log('✅ Update Inventory button clicked');

            // For testing - just show the modal regardless
            console.log('🧪 Test mode - showing modal without row selection check');

            // Check if a row is selected (but don't block for testing)
            if (typeof selectedRowData === 'undefined' || !selectedRowData) {
                console.log('⚠️ No row selected, but continuing in test mode');
                // Don't return - continue to show modal for testing
            }

            const modal = $("#supplierModalUpdating");

            // Use the same enhanced modal display logic
            const modalElement = modal[0];
            modalElement.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 9999 !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.8) !important;
                align-items: center !important;
                justify-content: center !important;
            `;

            modal.removeClass('hidden');
            modal.show();

            console.log('✅ Update modal should be visible now');

            if (typeof setSupplierAutocomplete === 'function') {
                setSupplierAutocomplete();
            }
        });

    }, 1000); // 1 second delay

    // Close modal functionality
    $(document).on('click', '.close-modal', function() {
        const modal = $(this).closest('[role="dialog"]');
        modal.addClass('hidden');
        modal.css('display', 'none');
        modal.hide();
    });

    // Close on backdrop click
    $(document).on('click', '[role="dialog"]', function(e) {
        if (e.target === this) {
            $(this).addClass('hidden');
            $(this).css('display', 'none');
            $(this).hide();
        }
    });
});


// Add this JavaScript code to make rows clickable and display the update modal

$(document).ready(function() {
    // Store selected row data globally
    window.selectedRowData = null;
    
    // Function to populate update modal with row data
    function populateUpdateModal(rowData) {
        console.log('Populating update modal with:', rowData);
        
        // Populate the form fields with the row data
        $('#idUpdate').val(rowData.id || '');
        $('#item_code_update').val(rowData.item_code || '');
        $('#nameUpdate').val(rowData.name || '');
        $('#category_update').val(rowData.category || '');
        $('#quantity_update').val(rowData.quantity || '');
        $('#unit_update').val(rowData.unit || '');
        $('#reorder_level_update').val(rowData.reorder_level || '');
        $('#price_update').val(rowData.price || '');
        $('#supplier_update').val(rowData.supplier || '');
        $('#description_update').val(rowData.description || '');
    }
    
    // Function to show update modal
    function showUpdateModal() {
        const modal = $("#supplierModalUpdating");
        
        // Remove hidden class and force display
        modal.removeClass('hidden');
        modal.addClass('modal-show');
        
        // Use direct DOM manipulation for reliable display
        const modalElement = modal[0];
        modalElement.style.cssText = `
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 9999 !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
            align-items: center !important;
            justify-content: center !important;
        `;
        
        modal.show();
        console.log('Update modal displayed');
    }
    
    // Function to extract data from table row
    function extractRowData(row) {
        const cells = row.find('td');
        
        return {
            id: row.data('id') || '', // Assuming you have data-id attribute
            item_code: cells.eq(0).text().trim(),
            name: cells.eq(1).text().trim(),
            category: cells.eq(2).text().trim(),
            description: cells.eq(3).text().trim(),
            quantity: cells.eq(4).text().trim(),
            unit: cells.eq(5).text().trim(),
            reorder_level: cells.eq(6).text().trim(),
            price: cells.eq(7).text().trim().replace('$', ''), // Remove currency symbol
            supplier: cells.eq(8).text().trim()
        };
    }
    
    // Wait for DataTables to initialize, then add click handlers
    setTimeout(function() {
        console.log('Setting up clickable rows...');
        
        // Method 1: Direct jQuery event delegation (works with DataTables)
        $('#supplier_table tbody').on('click', 'tr', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Row clicked!');
            
            // Remove previous selection
            $('#supplier_table tbody tr').removeClass('selected-row');
            
            // Add selection to clicked row
            $(this).addClass('selected-row');
            
            // Extract data from the row
            const rowData = extractRowData($(this));
            console.log('Extracted row data:', rowData);
            
            // Store selected data globally
            window.selectedRowData = rowData;
            
            // Populate and show the update modal
            populateUpdateModal(rowData);
            showUpdateModal();
        });
        
        // Method 2: If DataTables is being used, you might need this approach instead
        if ($.fn.DataTable && $.fn.DataTable.isDataTable('#supplier_table')) {
            $('#supplier_table').DataTable().on('click', 'tbody tr', function() {
                console.log('DataTables row clicked!');
                
                // Get DataTables row data
                const table = $('#supplier_table').DataTable();
                const data = table.row(this).data();
                
                if (data) {
                    // Remove previous selection
                    $('#supplier_table tbody tr').removeClass('selected-row');
                    
                    // Add selection to clicked row
                    $(this).addClass('selected-row');
                    
                    // If data is an array, map it to object
                    const rowData = {
                        id: data[0] || $(this).data('id') || '',
                        item_code: data[0] || '',
                        name: data[1] || '',
                        category: data[2] || '',
                        description: data[3] || '',
                        quantity: data[4] || '',
                        unit: data[5] || '',
                        reorder_level: data[6] || '',
                        price: data[7] || '',
                        supplier: data[8] || ''
                    };
                    
                    console.log('DataTables row data:', rowData);
                    window.selectedRowData = rowData;
                    
                    populateUpdateModal(rowData);
                    showUpdateModal();
                }
            });
        }
        
        console.log('Clickable rows setup complete');
    }, 2000);
    
    // Alternative: Add click handler when table is fully loaded
    $(document).on('click', '#supplier_table tbody tr', function(e) {
        console.log('Alternative click handler triggered');
        // This serves as a backup if the above methods don't work
    });
    
    // Enhanced Update button (keep your existing logic but add row selection check)
    $("#updateSupplierBtn").off('click').on('click', function(e) {
        e.preventDefault();
        console.log('Update button clicked');
        
        if (!window.selectedRowData) {
            alert('Please select a row first by clicking on it.');
            return;
        }
        
        populateUpdateModal(window.selectedRowData);
        showUpdateModal();
    });
});

// CSS to make rows look clickable (add this to your existing styles)
const clickableRowsCSS = `
<style>
#supplier_table tbody tr {
    cursor: pointer;
    transition: all 0.2s ease;
}

#supplier_table tbody tr:hover {
    background-color: #f8fafc !important;
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#supplier_table tbody tr.selected-row {
    background-color: #dbeafe !important;
    border-left: 4px solid #3b82f6 !important;
    font-weight: 500;
}

#supplier_table tbody tr.selected-row:hover {
    background-color: #bfdbfe !important;
}
</style>
`;

// Inject the CSS
$('head').append(clickableRowsCSS);








  // FIXED JavaScript Update Function
function updateInventory() {
    console.log('Update inventory function called');
    
    // Get values from the update form
    const id = $('#idUpdate').val();
    const itemCode = $('#item_code_update').val();
    const name = $('#nameUpdate').val();
    const category = $('#category_update').val();
    const description = $('#description_update').val();
    const quantity = parseFloat($('#quantity_update').val()) || 0;
    const unit = $('#unit_update').val();
    const reorderLevel = parseInt($('#reorder_level_update').val()) || 0;
    const price = parseFloat($('#price_update').val()) || 0;
    const supplier = $('#supplier_update').val();
    const supplierID_update = $('#supplierID_update').val();

    console.log('Form values:', {
        id, itemCode, name, category, description, 
        quantity, unit, reorderLevel, price, supplier
    });

    // Validate required fields
    if (!id) {
        alert('No item selected for update!');
        return;
    }

    if (!itemCode || !name) {
        alert('Item code and name are required!');
        return;
    }

    if (!supplierID_update) {
        alert('Supplier ID  are required!');
        return;
    }

    // Escape function for GraphQL strings
    const escape = (str) => (str || '').toString().replace(/"/g, '\\"').replace(/\n/g, '\\n');

    // FIXED: GraphQL mutation query with correct field names (snake_case to match your schema)
    const query = `
        mutation {
            updateInventorySupplyItem(
                updatedData: {
                    id: "${id}"
                    itemCode: "${escape(itemCode)}"
                    name: "${escape(name)}"
                    category: "${escape(category)}"
                    description: "${escape(description)}"
                    quantityInStock: ${quantity}
                    unit: "${escape(unit)}"
                    reorderLevel: ${reorderLevel}
                    pricePerUnit: ${price}
                    supplierId: "${escape(supplier)}"
                }
            )
        }
    `;

    console.log('GraphQL Query:', query);

    // Show loading state
    const updateBtn = $('#updateBtn');
    const originalText = updateBtn.html();
    updateBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i>Updating...');

    // Make AJAX request
    $.ajax({
        url: '/mygraphql/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ query: query }),
        success: function(response) {
            console.log('Update response:', response);
            
            if (response.data && response.data.updateInventorySupplyItem) {
                const message = response.data.updateInventorySupplyItem;
                alert('Update successful: ' + message);
                
                // Hide the modal
                // $('#supplierModalUpdating').addClass('hidden');
                // $('#supplierModalUpdating').css('display', 'none');
                
                // Clear the form
                // clearUpdateForm();
                

                // Refresh the table data
                location.reload();
                // fetchInventory();
                
                // Clear selected row data
                selectedRowData = null;
                $('.clickable-row').removeClass('bg-blue-100 selected-row');
                
            } else if (response.errors) {
                console.error('GraphQL Errors:', response.errors);
                alert('Update failed: ' + response.errors[0].message);
            } else {
                console.error('Unexpected response:', response);
                alert('Update failed: No data returned from server');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText,
                error: error
            });
            
            let errorMessage = 'Unknown error occurred';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse.errors && errorResponse.errors.length > 0) {
                    errorMessage = errorResponse.errors[0].message;
                }
            } catch (e) {
                errorMessage = xhr.responseText || error;
            }
            
            alert('Error updating inventory: ' + errorMessage);
        },
        complete: function() {
            // Restore button state
            updateBtn.prop('disabled', false).html(originalText);
        }
    });
}

// DEBUGGING: Add console logs to track the flow
$(document).ready(function() {
    console.log('Document ready - setting up update handlers');
    
    // Attach the update function to the update button
    $(document).on('click', '#updateBtn', function(e) {
        e.preventDefault();
        console.log('Update button clicked');
        updateInventory();
    });
    
    // Test if button exists
    setTimeout(function() {
        const updateBtn = $('#updateBtn');
        console.log('Update button found:', updateBtn.length > 0);
        console.log('Update button element:', updateBtn);
    }, 2000);
});

// DEBUGGING: Enhanced populate function with more logging
function populateUpdateModal(rowData) {
    console.log('Populating update modal with:', rowData);
    
    // Map the data to the correct form fields
    $('#idUpdate').val(rowData.id || '');
    $('#item_code_update').val(rowData.itemCode || '');
    $('#nameUpdate').val(rowData.name || '');
    $('#category_update').val(rowData.category || '');
    $('#description_update').val(rowData.description || '');
    $('#quantity_update').val(rowData.quantity || '');
    $('#unit_update').val(rowData.unit || '');
    $('#reorder_level_update').val(rowData.reorderLevel || '');
    $('#price_update').val(rowData.price || '');
    $('#supplier_update').val(rowData.supplier || '');
    
    // Verify population worked
    console.log('Form populated - verification:', {
        id: $('#idUpdate').val(),
        itemCode: $('#item_code_update').val(),
        name: $('#nameUpdate').val(),
        category: $('#category_update').val()
    });
    
    console.log('Update modal populated successfully');
}

// TESTING: Add a test function you can call from console
window.testUpdate = function() {
    console.log('Testing update function...');
    
    // Fill with test data
    $('#idUpdate').val('test_id');
    $('#item_code_update').val('TEST001');
    $('#nameUpdate').val('Test Item');
    $('#category_update').val('Test Category');
    $('#description_update').val('Test Description');
    $('#quantity_update').val('10');
    $('#unit_update').val('pcs');
    $('#reorder_level_update').val('5');
    $('#price_update').val('99.99');
    $('#supplier_update').val('test_supplier');
    
    updateInventory();
};







  function setSupplierAutocomplete() {
  $("#supplier_update").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "/mygraphql", // GraphQL endpoint
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          query: `
            query getSupplierAutocomplete($searchTerm: String!) {
              getSupplierAutocomplete(searchTerm: $searchTerm) {
                id
                name
                phone
                email
                contactPerson
                address
              }
            }
          `,
          variables: {
            searchTerm: request.term
          }
        }),
        success: function(res) {
          if (res.data && res.data.getSupplierAutocomplete) {
            let suggestions = res.data.getSupplierAutocomplete.map(item => ({
              label: item.name,
              value: item.name,
              customer_id: item.id,
              phone: item.phone,
              email: item.email,
              contactPerson: item.contactPerson,
              address: item.address
            }));
            response(suggestions);
          }
        },
        error: function(err) {
          console.error("GraphQL Autocomplete error:", err);
        }
      });
    },
    minLength: 0,
    select: function(event, ui) {
      $("#supplier_update").val(ui.item.customer_id);
      $("#supplierID_update").val(ui.item.customer_id);
     
      return false;
    }
  });

 
}


setSupplierAutocomplete()


