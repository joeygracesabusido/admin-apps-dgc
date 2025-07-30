

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
                addRowClickHandlers();

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

        // Enable the update button
        $('#updateSupplierBtn').prop('disabled', false).removeClass('opacity-50');

        // Show a visual indicator that row is selected
        $('#updateSupplierBtn').html('<i class="fas fa-edit mr-2"></i>Update Selected Item');
    });
}

// Function to populate the update form with selected row data
function populateUpdateForm() {
    if (!selectedRowData) {
        alert('Please select a row from the table first!');
        return false;
    }

    // Populate the update form fields
    $('#idUpdate').val(selectedRowData.id);
    $('#item_code_update').val(selectedRowData.itemCode);
    $('#nameUpdate').val(selectedRowData.name);
    $('#category_update').val(selectedRowData.category);
    $('#description_update').val(selectedRowData.description);
    $('#quantity_update').val(selectedRowData.quantity);
    $('#unit_update').val(selectedRowData.unit);
    $('#reorder_level_update').val(selectedRowData.reorderLevel);
    $('#price_update').val(selectedRowData.price);
    $('#supplier_update').val(selectedRowData.supplier);

    console.log('Update form populated with:', selectedRowData);
    return true;
}


function initDataTable() {
        if (!$.fn.DataTable.isDataTable("#supplier_table")) {

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
            destroy: true
        });

        }
    }


$(document).ready(function() {
    $("#addSupplierBtn").click(function() {
      $("#supplierModal").removeClass("hidden");
        setSupplierAutocomplete();
        
    });
    

        
  
    // this is for Update function Modal insertBtn
     $("#updateSupplierBtn").click(function() {
        // Check if a row is selected and populate the form
        if (populateUpdateForm()) {
            $("#supplierModalUpdating").removeClass("hidden");
        }
    });

    // Optional: Close modal when clicking "Cancel"
    $(".close-modal").click(function() {
      location.reload()
      $(".z-10").addClass("hidden");
      
         //$("#supplierModal").addClass("hidden");

    //
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
  const escape = (str) => (str || '').toString().replace(/"/g, '\\"');

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



