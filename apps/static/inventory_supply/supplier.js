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

