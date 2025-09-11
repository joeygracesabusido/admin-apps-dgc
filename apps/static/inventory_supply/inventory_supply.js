// $(document).ready(function() {
//     initializePage();
//     $('#addSupplierBtn').on('click', function(e) {
//         e.preventDefault();
//         if (typeof window.showAddInventoryModal === 'function') {
//             window.showAddInventoryModal();
//         } else {
//             openModal('#supplierModal');
//         }
//     });
// });

// // Keep a single DataTable instance to avoid reinitialization warnings
// window.__inventorySupplyDT = window.__inventorySupplyDT || null;

function initializePage() {
    fetchAndDisplayInventoryBalance();
    setupEventListeners();
    // Ensure modals are mounted at <body> level to avoid clipping/stacking issues
    try {
        // Remove the static supplierModal to avoid duplicate IDs when using dynamic modal
        var staticSupplierModal = document.querySelector('#supplierModal');
        if (staticSupplierModal) {
            staticSupplierModal.remove();
        }
    } catch (_) {}
}

function openModal(selector) {
    try {
        // Prefer jQuery when available
        if (typeof window.$ === 'function') {
            const $modal = $(selector);
            if ($modal.length === 0) {
                console.warn('Modal not found:', selector);
                // Fallback to DOM
            } else {
                $modal.removeClass('hidden').css({ display: 'flex', visibility: 'visible', opacity: 1, 'z-index': 100000 });
                return;
            }
        }

        // DOM fallback (no jQuery or jQuery failed to find element)
        const modal = document.querySelector(selector);
        if (!modal) {
            console.warn('Modal not found (DOM fallback):', selector);
            return;
        }
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = '100000';
    } catch (err) {
        console.error('Error opening modal', selector, err);
    }
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
        if (typeof window.showAddInventoryModal === 'function') {
            window.showAddInventoryModal();
        } else {
            openModal('#supplierModal');
            if (typeof setSupplierAutocomplete === 'function') {
                try { setSupplierAutocomplete(); } catch (_) {}
            }
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

function insertInventory(e) {
    // Prefer getting values relative to the clicked button's modal, fallback to document
    let $ctx = null;
    try {
        if (e && e.currentTarget) {
            $ctx = $(e.currentTarget).closest('[role="dialog"]');
        }
    } catch (_) {}

    const q = (sel) => $ctx && $ctx.length ? $ctx.find(sel) : $(sel);

    const itemCode = q('#item_code').val();
    const name = q('#name').val();
    const description = q('#description').val();
    const category = q('#category').val();
    const quantityInStock = parseFloat(q('#quantity_in_stock').val()) || 0;
    const unit = q('#unit').val();
    const reorderLevel = parseFloat(q('#reorder_level').val()) || 0;
    const pricePerUnit = parseFloat(q('#price_per_unit').val()) || 0;
    const supplierId = q('#supplier_id').val();

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
                try { document.getElementById('supplierModal')?.remove(); } catch (_) {}
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

