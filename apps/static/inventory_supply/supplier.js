$(document).ready(function() {
    initializeSupplierPage();
});

let selectedSupplier = null;
let supplierData = [];

function initializeSupplierPage() {
    fetchAndDisplaySuppliers();
    setupEventListeners();
}

function fetchAndDisplaySuppliers() {
    const query = `
        query {
            getSupplierList {
                id
                name
                phone
                email
                contactPerson
                address
                user
            }
        }
    `;

    $.ajax({
        url: '/mygraphql',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ query }),
        success: function (response) {
            if (response.errors) {
                console.error('GraphQL Error:', response.errors);
                alert('Error fetching suppliers: ' + response.errors.map(e => e.message).join('\n'));
                return;
            }
            supplierData = response.data.getSupplierList;
            populateSupplierTable(supplierData);
        },
        error: function (xhr) {
            console.error("❌ Error fetching GraphQL data:", xhr);
            alert("Failed to load suppliers");
        }
    });
}

function populateSupplierTable(data) {
    let tableBody = $("#supplier_table tbody");
    tableBody.empty();

    data.forEach(function (supp) {
        let row = `
            <tr class="text-xs" data-supplier-id='${supp.id}'>
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

    initDataTable();
}

function initDataTable() {
    // Keep a single DataTable instance to avoid reinitialization warnings
    window.__supplierListDT = window.__supplierListDT || null;
    if (window.__supplierListDT && typeof window.__supplierListDT.destroy === 'function') {
        try { window.__supplierListDT.destroy(); } catch (e) {}
        window.__supplierListDT = null;
    }

    // Initialize DataTables v2 if available
    if (window.DataTable) {
        window.__supplierListDT = new DataTable('#supplier_table', {
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
        });
    }

    // Row click selection independent of DataTables API
    $('#supplier_table tbody').off('click', 'tr').on('click', 'tr', function () {
        const row = $(this);
        if (row.hasClass('selected')) {
            row.removeClass('selected');
            selectedSupplier = null;
        } else {
            $('#supplier_table tbody tr.selected').removeClass('selected');
            row.addClass('selected');
            const supplierId = row.data('supplier-id');
            selectedSupplier = supplierData.find(supplier => supplier.id === supplierId);
        }
    });
}

function setupEventListeners() {
    $("#addSupplierBtn").click(function() {
        clearAddModal()
        $("#supplierModal").removeClass("hidden");
    });

    $("#updateSupplierBtn").click(function() {
        if (selectedSupplier) {
            populateUpdateModal(selectedSupplier);
            $("#supplierModalUpdating").removeClass("hidden");
        } else {
            alert("Please select a supplier to update.");
        }
    });

    $("#insertBtn").click(insertSupplier);
    $("#updateBtn").click(updateSupplier);

    $(".close-modal").click(function() {
        $(this).closest(".z-10").addClass("hidden");
    });
}

function populateUpdateModal(data) {
    $('#idUpdate').val(data.id);
    $('#nameUpdate').val(data.name);
    $('#contact_person_update').val(data.contactPerson);
    $('#email_update').val(data.email);
    $('#phone_update').val(data.phone);
    $('#address_update').val(data.address);
}

function clearAddModal() {
    $('#name').val("");
    $('#contact_person').val("");
    $('#email').val("");
    $('#phone').val("");
    $('#address').val("");
}


function insertSupplier() {
    const supplierData = {
        name: $('#name').val(),
        contactPerson: $('#contact_person').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        address: $('#address').val(),
    };

    const query = `
        mutation InsertSupplier($intSupplier: SupplierInput!) {
            insertSupplierIvtSupply(intSupplier: $intSupplier)
        }
    `;

    $.ajax({
        url: '/mygraphql',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            query: query,
            variables: { intSupplier: supplierData }
        }),
        success: function (response) {
            if (response.data && response.data.insertSupplierIvtSupply) {
                alert('Supplier inserted successfully!');
                location.reload();
            } else {
                alert('Failed to insert supplier.');
            }
        },
        error: function (xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}

function updateSupplier() {
    const updatedData = {
        id: $("#idUpdate").val(),
        name: $("#nameUpdate").val(),
        contactPerson: $("#contact_person_update").val(),
        email: $("#email_update").val(),
        phone: $("#phone_update").val(),
        address: $("#address_update").val()
    };

    const query = `
        mutation UpdateSupplier($updatedData: SupplierUpdateInput!) {
            updateSupplierIvtSupply(updatedData: $updatedData)
        }
    `;

    $.ajax({
        url: "/mygraphql",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            query: query,
            variables: { updatedData: updatedData }
        }),
        success: function (res) {
            if (res.data && res.data.updateSupplierIvtSupply) {
                alert(res.data.updateSupplierIvtSupply);
                location.reload();
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
