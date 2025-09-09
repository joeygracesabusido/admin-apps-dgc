$(document).ready(function() {
    initializePage();
});

// Keep a single DataTable instance to avoid reinitialization warnings
window.__inventorySupplyDT = window.__inventorySupplyDT || null;

function initializePage() {
    fetchAndDisplayInventoryBalance();
    setupEventListeners();
}

function openModal(selector) {
    const $modal = $(selector);
    if ($modal.length === 0) {
        console.warn('Modal not found:', selector);
        return;
    }
    $modal.removeClass('hidden').css({ display: 'flex', visibility: 'visible', opacity: 1, 'z-index': 100000 });
}

function fetchAndDisplayInventoryBalance() {
    const query = `
        query {
            getInventoryBalance {
                itemCode
                itemName
                balance
                category
                description
                unit
                reorderLevel
                pricePerUnit
                supplierName
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
                alert('Error fetching inventory balance: ' + response.errors.map(e => e.message).join('\n'));
                return;
            }

            const data = response.data.getInventoryBalance;
            populateTable(data);
        },
        error: function (xhr) {
            console.error("❌ Error fetching GraphQL data:", xhr);
            alert("Failed to load inventory balance");
        }
    });
}

function populateTable(data) {
    let tableBody = $("#supplier_table tbody");
    tableBody.empty();

    data.forEach(function (item) {
        let row = `
            <tr class="text-sm clickable-row cursor-pointer hover:bg-gray-100"
                data-item-code="${item.itemCode}"
                data-name="${item.itemName}"
                data-category="${item.category || ''}"
                data-description="${item.description || ''}"
                data-quantity="${item.balance || ''}"
                data-unit="${item.unit || ''}"
                data-reorder-level="${item.reorderLevel || ''}"
                data-price="${item.pricePerUnit || ''}"
                data-supplier="${item.supplierName || ''}">
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.category || ''}</td>
                <td>${item.description || ''}</td>
                <td>${item.balance || ''}</td>
                <td>${item.unit || ''}</td>
                <td>${item.reorderLevel || ''}</td>
                <td>${item.pricePerUnit || ''}</td>
                <td>${item.supplierName || ''}</td>
            </tr>
        `;
        tableBody.append(row);
    });

    initDataTable();
}


function initDataTable() {
    // Destroy existing instance (DataTables v2) if present
    if (window.__inventorySupplyDT && typeof window.__inventorySupplyDT.destroy === 'function') {
        try { window.__inventorySupplyDT.destroy(); } catch (e) {}
        window.__inventorySupplyDT = null;
    }

    // Initialize a fresh instance
    window.__inventorySupplyDT = new DataTable('#supplier_table', {
        layout: { topStart: 'buttons' },
        buttons: ['copy', {
            extend: 'csv',
            filename: 'InventoryBalance',
            title: 'Inventory Balance'
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

    // Event delegation for double-click
    $('#supplier_table tbody').off('dblclick.row').on('dblclick.row', 'tr', function () {
        // Optional: access row data via DOM if needed
        const cells = $(this).find('td').map(function(){ return $(this).text(); }).get();
        console.log('Row double-clicked:', cells);
    });
}

function setupEventListeners() {
    // Use delegated handler to ensure it binds even if DOM changes
    $(document).off('click.addSupplier').on('click.addSupplier', '#addSupplierBtn', function (e) {
        e.preventDefault();
        openModal('#supplierModal');
        if (typeof setSupplierAutocomplete === 'function') {
            try { setSupplierAutocomplete(); } catch (_) {}
        }
    });

    $("#updateItemBtn").click(function() {
        if (populateUpdateForm()) {
            $("#itemDetailsModal").removeClass("hidden");
        }
    });

    $(document).off('click.closeModal').on('click.closeModal', '.close-modal', function() {
        const $dlg = $(this).closest('[role="dialog"]');
        $dlg.fadeOut(150, function(){
            $dlg.addClass('hidden').css('display','none');
        });
    });

    $(document).on('click', '#insertBtn', insertInventory);
}


function setSupplierAutocomplete() {
    $("#supplier_id").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/mygraphql",
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
        url: '/mygraphql',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ query: query }),
        success: function (response) {
            if (response.data && response.data.insertInventorySupplyItem) {
                alert('Inventory inserted successfully!');
                $('#supplierModal').addClass('hidden');
                location.reload();
            } else {
                alert('Failed to insert Inventory.');
            }
        },
        error: function (xhr) {
            alert('Error: ' + xhr.responseText);
        }
    });
}
