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
            autoWidth: false,
            destroy: true
        });

        }
    }


$(document).ready(function() {
    $("#addSupplierBtn").click(function() {
      $("#supplierModal").removeClass("hidden");
    });

    // Optional: Close modal when clicking "Cancel"
    $(".close-modal").click(function() {
      $("#supplierModal").addClass("hidden");
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

