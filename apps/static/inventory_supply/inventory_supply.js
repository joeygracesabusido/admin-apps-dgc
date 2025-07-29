function fetchSupplier() {
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
                                supplierID
                                user
                                createdAt
                                updatedAt

                         }


                    }
                `
            }),
            success: function (response) {
                let tableBody = $("#supplier_table tbody");
                tableBody.empty();

                let data = response.data.getSupplierList;
                data.forEach(function (supp) {
                    let row = `
                        <tr class="text-xs">
                            <td>${supp.itemCode}</td>
                            <td>${supp.name}</td>
                            <td>${supp.category || ''}</td>
                            <td>${supp.description || ''}</td>
                            <td>${supp.quantityInStock || ''}</td>
                            <td>${supp.unit || ''}</td>
                            <td>${supp.reorderLevel || ''}</td>
                            <td>${supp.pricePerUnit || ''}</td>

                            <td>${supp.user}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                }); 

                // Initialize DataTable after data load
                initDataTable();
            },
            error: function (xhr) {
                console.error("❌ Error fetching GraphQL data:", xhr);
                alert("Failed to load data");
            }
        });


      
    }


$(document).ready(function() {
    $("#addSupplierBtn").click(function() {
      $("#supplierModal").removeClass("hidden");
        setSupplierAutocomplete();
        
    });
    

        
  
    // this is for Update function Modal insertBtn
     $("#updateSupplierBtn").click(function() {            
      $("#supplierModalUpdating").removeClass("hidden");
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



