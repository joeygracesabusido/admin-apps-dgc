function fetchSupplier() {
        $.ajax({
            url: '/mygraphql/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                query: `
                    query {
                        
                      getSupplierList {
                                id
                                name
                                phone
                                email
                                contactPerson
                                address
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
                            <td>${supp.name}</td>
                            <td>${supp.contactPerson || ''}</td>
                            <td>${supp.email || ''}</td>
                            <td>${supp.phone || ''}</td>
                            <td>${supp.address || ''}</td>
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
    });

    // // Optional: Close modal when clicking "Cancel"
    // $(".close-modal").click(function() {
    //   $("#supplierModal").addClass("hidden");
    // });
  
    // this is for Update function Modal insertBtn
     $("#updateSupplierBtn").click(function() {

      setSupplierAutocomplete();
      
      $("#supplierModalUpdating").removeClass("hidden");
    });

    // Optional: Close modal when clicking "Cancel"
    $(".close-modal").click(function() {
      location.reload()
      $(".z-10").addClass("hidden");
      
         //$("#supplierModal").addClass("hidden");

    //
    });
    
     $("#updateBtn").click(function (e) {
        e.preventDefault();
        updateSupplier();
      });


  });



fetchSupplier()


function insertSupplier() {
  const name = $('#name').val();
  const contactPerson = $('#contact_person').val();
  const email = $('#email').val();
  const phone = $('#phone').val();
  const address = $('#address').val();

  // Optional: Escape double quotes
  const escape = (str) => str.replace(/"/g, '\\"');

  const query = `
    mutation {
      insertSupplierIvtSupply(
        intSupplier: {
          name: "${escape(name)}",
          contactPerson: "${escape(contactPerson)}",
          email: "${escape(email)}",
          phone: "${escape(phone)}",
          address: "${escape(address)}"
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
      if (response.data && response.data.insertSupplierIvtSupply) {
        alert('Supplier inserted successfully!');
        $('#supplierModal').addClass('hidden');
        // Optionally clear inputs
        $('#name, #contact_person, #email, #phone, #address').val('');
        // Optionally refresh the supplier table,
				location.reload();
      } else {
        alert('Failed to insert supplier.');
      }
    },
    error: function (xhr, status, error) {
      alert('Error: ' + xhr.responseText);
    }
  });

}




//this is to triger the button

$('#insertBtn').on('click', function () {
	insertSupplier();
});


 function setSupplierAutocomplete() {
  $("#nameUpdate").autocomplete({
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
      $("#nameUpdate").val(ui.item.value);
      $("#idUpdate").val(ui.item.customer_id);
      $("#contact_person_update").val(ui.item.contactPerson);
      $("#phone_update").val(ui.item.phone);
      $("#email_update").val(ui.item.email);
      $("#address_update").val(ui.item.address);
      return false;
    }
  });
}



//this is for Updating Supplier in Inventory Supplies 

function updateSupplier() {
  const supplierData = {
    id: $("#idUpdate").val(),
    name: $("#nameUpdate").val(),
    phone: $("#phone_update").val(),
    email: $("#email_update").val(),
    contactPerson: $("#contact_person_update").val(),
    address: $("#address_update").val()
  };

  $.ajax({
    url: "/mygraphql",
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      query: `
        mutation UpdateSupplier($updatedData: SupplierUpdateInput!) {
          updateSupplierIvtSupply(updatedData: $updatedData)
        }
      `,
      variables: {
        updatedData: supplierData
      }
    }),
    success: function (res) {
      if (res.data && res.data.updateSupplierIvtSupply) {
        alert(res.data.updateSupplierIvtSupply);
        location.reload();
        // Optional: close modal or refresh list here
      } else {
        alert("Something went wrong. Please try again.");
      }
    },
    error: function (err) {
      console.error("GraphQL Update Error:", err);
      alert("Failed to update supplier.");
    }
  });
}

