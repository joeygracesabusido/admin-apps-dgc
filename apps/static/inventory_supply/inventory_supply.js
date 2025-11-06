$(document).ready(function() {
    initializePage();
    $('#addSupplierBtn').on('click', function(e) {
        e.preventDefault();
        if (typeof window.showAddInventoryModal === 'function') {
            window.showAddInventoryModal();
        } else {
            openModal('#supplierModal');
        }
    });
});

// // Keep a single DataTable instance to avoid reinitialization warnings
// window.__inventorySupplyDT = window.__inventorySupplyDT || null;

function initializePage() {
    // Preload master index so we can resolve IDs on dblclick without extra roundtrips
    preloadMasterIndex().then(() => {
        fetchAndDisplayInventoryBalance();
    }).catch(() => {
        // Even if preload fails, still render the table; dblclick will fallback
        fetchAndDisplayInventoryBalance();
    });
    setupEventListeners();
    hookAddItemModalOpen();
    // Ensure modals are mounted at <body> level to avoid clipping/stacking issues
    // try {
    //     // Remove the static supplierModal to avoid duplicate IDs when using dynamic modal
    //     var staticSupplierModal = document.querySelector('#supplierModal');
    //     if (staticSupplierModal) {
    //         staticSupplierModal.remove();
    //     }
    // } catch (_) {}
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
    // Strawberry uses auto-camel-case, so query in camelCase
    const query = "" +
        "query {\n" +
        "    getInventoryBalance {\n" +
        "        itemCode\n" +
        "        itemName\n" +
        "        balance\n" +
        "        category\n" +
        "        description\n" +
        "        unit\n" +
        "        reorderLevel\n" +
        "        pricePerUnit\n" +
        "        supplierName\n" +
        "    }\n" +
        "}";

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
            console.log(data)
            populateTable(data);
        },
        error: function (xhr) {
            console.error("❌ Error fetching GraphQL data:", xhr);
            alert("Failed to load inventory balance");
        }
    });
}

// Global in-memory index of master items by normalized itemCode
window.__invMasterIndex = window.__invMasterIndex || {};

function normalizeKey(v) { return (v == null ? '' : String(v)).trim().toLowerCase(); }

function applySupplierSelection($input, label, id) {
    if (!$input || !$input.length) return;
    const text = label == null ? '' : String(label);
    $input.val(text);
    if (id) {
        $input.data('selected-id', id);
        $input.attr('data-selected-id', id);
    } else {
        $input.removeData('selected-id');
        $input.removeAttr('data-selected-id');
    }

    const targetSelector = $input.attr('data-id-target');
    if (targetSelector) {
        try { $(targetSelector).val(id || ''); } catch (_) {}
    }
}

function readSupplierId($input) {
    if (!$input || !$input.length) return '';
    const stored = $input.data('selected-id') || $input.attr('data-selected-id');
    if (stored) return String(stored);
    const targetSelector = $input.attr('data-id-target');
    if (targetSelector) {
        try {
            const val = $(targetSelector).val();
            if (val) return String(val);
        } catch (_) {}
    }
    return '';
}

window.__supplierOptions = window.__supplierOptions || null;
window.__inventoryOptions = window.__inventoryOptions || null;

function ensureSupplierOptions() {
    return new Promise(function(resolve, reject) {
        if (Array.isArray(window.__supplierOptions)) {
            resolve(window.__supplierOptions);
            return;
        }

        const query = "" +
            "query {\n" +
            "  getSupplierList {\n" +
            "    id\n" +
            "    name\n" +
            "  }\n" +
            "}";

        $.ajax({
            url: '/mygraphql',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ query }),
            success: function(res) {
                try {
                    const raw = (res && res.data && res.data.getSupplierList) ? res.data.getSupplierList : [];
                    const options = raw.map(item => ({
                        label: item.name || '',
                        value: item.id ? String(item.id) : '',
                    })).filter(opt => opt.label && opt.value);
                    window.__supplierOptions = options;
                    resolve(options);
                } catch (err) {
                    reject(err);
                }
            },
            error: function(xhr) {
                reject(xhr);
            }
        });
    });
}

function ensureInventoryOptions() {
    return new Promise(function(resolve, reject) {
        if (Array.isArray(window.__inventoryOptions)) {
            resolve(window.__inventoryOptions);
            return;
        }

        const query = "" +
            "query {\n" +
            "  getInventorySupplyItem {\n" +
            "    id\n" +
            "    name\n" +
            "    itemCode\n" +
            "    category\n" +
            "    unit\n" +
            "    pricePerUnit\n" +
            "    supplierId\n" +
            "  }\n" +
            "}";

        $.ajax({
            url: '/mygraphql',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ query }),
            success: function(res) {
                try {
                    const raw = (res && res.data && res.data.getInventorySupplyItem) ? res.data.getInventorySupplyItem : [];
                    const options = raw.map(item => ({
                        id: item.id ? String(item.id) : '',
                        label: item.name || '',
                        name: item.name || '',
                        itemCode: item.itemCode || '',
                        category: item.category || '',
                        description: item.description || '',
                        unit: item.unit || '',
                        reorderLevel: item.reorderLevel || 0,
                        pricePerUnit: item.pricePerUnit || 0,
                        supplierId: item.supplierId || ''
                    })).filter(opt => opt.label);
                    window.__inventoryOptions = options;
                    resolve(options);
                } catch (err) {
                    reject(err);
                }
            },
            error: function(xhr) {
                reject(xhr);
            }
        });
    });
}

async function preloadMasterIndex() {
    try {
        const query = "" +
            "query {\n" +
            "  getInventorySupplyItem {\n" +
            "    id\n" +
            "    itemCode\n" +
            "    supplierId\n" +
            "  }\n" +
            "}";
        const result = await $.ajax({
            url: '/mygraphql',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query })
        });
        if (result && result.data && result.data.getInventorySupplyItem) {
            const idx = {};
            result.data.getInventorySupplyItem.forEach(x => {
                idx[normalizeKey(x.itemCode)] = { id: x.id, supplierId: x.supplierId };
            });
            window.__invMasterIndex = idx;
        }
    } catch (e) {
        console.warn('Preload master index failed', e);
    }
}

function populateTable(data) {
    let tableBody = $("#supplier_table tbody");
    tableBody.empty();

    if (!data || data.length === 0) {
        let row = `
            <tr>
                <td colspan="9" class="text-center text-gray-500 py-4">No inventory items found.</td>
            </tr>
        `;
        tableBody.append(row);
        return;
    }

    data.forEach(function (item) {
        const idx = window.__invMasterIndex || {};
        const key = normalizeKey(item.itemCode);
        const master = idx[key] || {};
        let row = `
            <tr class="text-sm clickable-row cursor-pointer hover:bg-gray-100"
                data-item-code="${item.itemCode}"
                data-id="${master.id || ''}"
                data-name="${item.itemName}"
                data-category="${item.category || ''}"
                data-description="${item.description || ''}"
                data-quantity="${item.balance || ''}"
                data-unit="${item.unit || ''}"
                data-reorder-level="${item.reorderLevel || ''}"
                data-price="${item.pricePerUnit || ''}"
                data-supplier="${item.supplierName || ''}"
                data-supplier-id="${master.supplierId || ''}">
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

    // Initialize a fresh instance (guard if DataTables not loaded)
    if (window.DataTable) {
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
    }

    // Event delegation for double-click: open update modal
    // Bind at document level to survive DataTables DOM changes
    $(document).off('dblclick.inventoryRow').on('dblclick.inventoryRow', '#supplier_table tbody tr', async function () {
        console.log('Row double-click detected');
        try {
            const $row = $(this);
            const itemCode = $row.data('item-code');
            const preId = $row.data('id');
            const rowData = {
                itemCode,
                itemName: $row.data('name'),
                category: $row.data('category') || '',
                description: $row.data('description') || '',
                quantityInStock: parseFloat($row.data('quantity')) || 0,
                unit: $row.data('unit') || '',
                reorderLevel: parseFloat($row.data('reorder-level')) || 0,
                pricePerUnit: parseFloat($row.data('price')) || 0,
                supplierName: $row.data('supplier') || '',
                supplierId: $row.data('supplier-id') || ''
            };

            // If we already have the master id from preload, use it directly
            if (preId) {
                showUpdateModal({ ...rowData, id: preId });
                return;
            }

            // Fallback: Fetch the full inventory items to locate the underlying record ID
            const query = "" +
                "query {\n" +
                "  getInventorySupplyItem {\n" +
                "    id\n" +
                "    itemCode\n" +
                "    name\n" +
                "    category\n" +
                "    description\n" +
                "    quantityInStock\n" +
                "    unit\n" +
                "    reorderLevel\n" +
                "    pricePerUnit\n" +
                "    supplierId\n" +
                "  }\n" +
                "}";

            const result = await $.ajax({
                url: '/mygraphql',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ query })
            });

            console.log('Master lookup result:', result);
            if (result.errors) {
                console.error('GraphQL Error:', result.errors);
                alert('Failed to fetch item details: ' + result.errors.map(e => e.message).join('\n'));
                return;
            }

            const items = (result.data && result.data.getInventorySupplyItem) ? result.data.getInventorySupplyItem : [];

            // Normalize for robust matching (handle numeric vs string, spaces, case)
            const norm = v => (v == null ? '' : String(v)).trim().toLowerCase();
            const rowCode = norm(itemCode);
            const rowName = norm(rowData.itemName);

            let match = items.find(x => norm(x.itemCode) === rowCode);
            if (!match && rowName) {
                match = items.find(x => norm(x.name) === rowName);
            }

            if (!match) {
                alert('No matching inventory master record found for item code: ' + itemCode + '. It may be a formatting mismatch or missing master record.');
                return;
            }

            showUpdateModal({ ...rowData, id: match.id, supplierId: match.supplierId });
        } catch (err) {
            console.error('Error handling row double-click:', err);
            alert('Unable to open update dialog.');
        }
    });

    // Context menu on right-click
    $(document).off('contextmenu.inventoryRow').on('contextmenu.inventoryRow', '#supplier_table tbody tr', function (e) {
        try {
            e.preventDefault();
            const $row = $(this);
            const menuData = extractRowData($row);
            showRowContextMenu(e.pageX, e.pageY, menuData);
        } catch (err) {
            console.error('Context menu error:', err);
        }
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
    $(document).on('click', '#updateBtn', updateInventory);
}

function extractRowData($row){
    return {
        id: $row.data('id') || null,
        itemCode: $row.data('item-code') || '',
        itemName: $row.data('name') || '',
        category: $row.data('category') || '',
        description: $row.data('description') || '',
        quantityInStock: parseFloat($row.data('quantity')) || 0,
        unit: $row.data('unit') || '',
        reorderLevel: parseFloat($row.data('reorder-level')) || 0,
        pricePerUnit: parseFloat($row.data('price')) || 0,
        supplierName: $row.data('supplier') || '',
        supplierId: $row.data('supplier-id') || ''
    };
}

// Simple context menu implementation
function ensureContextMenu(){
    let menu = document.getElementById('inventory-row-context');
    if (menu) return menu;
    menu = document.createElement('div');
    menu.id = 'inventory-row-context';
    menu.style.cssText = [
        'position:absolute',
        'z-index:100001',
        'min-width:220px',
        'background:#fff',
        'border:1px solid #e5e7eb',
        'box-shadow:0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'border-radius:8px',
        'padding:6px 0',
        'display:none'
    ].join(';');
    menu.innerHTML = [
        '<div class="ctx-item" data-action="view"><i class="fas fa-eye" style="width:18px;text-align:center;margin:0 10px;color:#374151"></i> View Details</div>',
        '<div class="ctx-sep"></div>',
        '<div class="ctx-item" data-action="edit"><i class="fas fa-edit" style="width:18px;text-align:center;margin:0 10px;color:#1d4ed8"></i> Edit Item</div>',
        '<div class="ctx-item" data-action="manage"><i class="fas fa-exchange-alt" style="width:18px;text-align:center;margin:0 10px;color:#059669"></i> Manage Transaction</div>',
        '<div class="ctx-item" data-action="print"><i class="fas fa-print" style="width:18px;text-align:center;margin:0 10px;color:#6b7280"></i> Print</div>',
        '<div class="ctx-sep"></div>',
        '<div class="ctx-item danger" data-action="delete"><i class="fas fa-trash" style="width:18px;text-align:center;margin:0 10px;color:#dc2626"></i> Delete Item</div>'
    ].join('');

    // Basic styles for items
    const style = document.createElement('style');
    style.textContent = [
        '#inventory-row-context .ctx-item{padding:8px 12px; cursor:pointer; font-size:14px; color:#111827; display:flex; align-items:center;}',
        '#inventory-row-context .ctx-item:hover{background:#f3f4f6;}',
        '#inventory-row-context .ctx-item.danger{color:#b91c1c;}',
        '#inventory-row-context .ctx-sep{height:1px; background:#e5e7eb; margin:6px 0;}'
    ].join('\n');
    document.head.appendChild(style);

    document.body.appendChild(menu);

    // Dismiss handlers
    document.addEventListener('click', hideRowContextMenu);
    document.addEventListener('scroll', hideRowContextMenu, true);
    document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') hideRowContextMenu(); });

    // Item click handling
    menu.addEventListener('click', function(ev){
        const action = ev.target.closest('.ctx-item')?.getAttribute('data-action');
        if (!action) return;
        const data = menu.__ctxData;
        hideRowContextMenu();
        handleContextAction(action, data);
    });

    return menu;
}

function showRowContextMenu(x, y, data){
    const menu = ensureContextMenu();
    menu.__ctxData = data;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'block';
}

function hideRowContextMenu(){
    const menu = document.getElementById('inventory-row-context');
    if (menu) menu.style.display = 'none';
}

// showUpdateModal
function handleContextAction(action, data){
    switch(action){
        case 'view':
        case 'edit':
            // Prefer existing ID or preloaded index; fallback to resolver.
            const openAndFill = (payload) => {
                try {
                    if (typeof window.updateInventoryModal === 'function') {
                        window.updateInventoryModal();
                    } 
                    // Fill form fields after modal is shown
                    setTimeout(function(){ fillUpdateInventoryForm(payload); }, 50);
                } catch (e) {
                    console.error('Open modal error:', e);
                }
            };

            try {
                let id = data.id || null;
                if (!id && window.__invMasterIndex) {
                    const key = normalizeKey(data.itemCode);
                    const cached = window.__invMasterIndex[key];
                    if (cached && cached.id) id = cached.id;
                }
                if (id) {
                    openAndFill({ ...data, id });
                    break;
                }

                resolveMasterByRowData(data).then(function(resolved){
                    const resolvedId = resolved && resolved.id ? resolved.id : null;
                    const supplierId = (resolved && resolved.supplierId) || data.supplierId || '';
                    openAndFill({ ...data, id: resolvedId, supplierId });
                }).catch(function(err){
                    console.error('Resolve item error:', err);
                    // Still open the modal with available data
                    openAndFill(data);
                });
            } catch (e) {
                console.error('Edit action error:', e);
                openAndFill(data);
            }
            break;

            

            
        case 'manage':
            try {
                if (typeof showManageTransactionModal === 'function') {
                    showManageTransactionModal();
                    // Prefill first row if available
                    setTimeout(function(){
                        try {
                            const codeInput = document.getElementById('int_item_code_0');
                            const nameInput = document.getElementById('inventory_name_0');
                            if (codeInput) codeInput.value = data.itemCode || '';
                            if (nameInput) nameInput.value = data.itemName || '';
                        } catch (_) {}
                    }, 120);
                }
            } catch (e) { console.error('Manage Transaction open failed', e); }
            break;
        case 'print':
            window.print();
            break;
        case 'delete':
            if (!data.id) { alert('Cannot delete. Missing item ID.'); return; }
            if (!confirm('Delete item '+ (data.itemName || data.itemCode) +'?')) return;
            const mutation = "" +
                "mutation($itemId: String!) {\n" +
                "  deleteInventorySupplyItem(itemId: $itemId)\n" +
                "}";
            $.ajax({
                url: '/mygraphql',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ query: mutation, variables: { itemId: data.id } }),
                success: function(res){
                    if (res.errors) {
                        alert('Delete failed: ' + res.errors.map(e => e.message).join('\n'));
                        return;
                    }
                    alert(res.data.deleteInventorySupplyItem || 'Deleted');
                    location.reload();
                },
                error: function(xhr){
                    console.error('Delete error', xhr);
                    alert('Network error deleting item');
                }
            });
            break;
    }
}

// Map row data into whichever update modal is active
function fillUpdateInventoryForm(data){
    try {
        // Prefer the new modal container
        const modalNew = document.getElementById('updateInventoryModal');
        const modalOld = document.getElementById('supplierModalUpdating');

        // Ensure hidden id field inside whichever modal exists
        const host = modalNew || modalOld || document.body;
        let idInput = host.querySelector('#idUpdate');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.id = 'idUpdate';
            host.appendChild(idInput);
        }
        idInput.value = data.id || '';
        if (modalNew) modalNew.setAttribute('data-item-id', data.id || '');

        // Scoped setter utility
        const setValIn = (root, selector, val) => {
            if (!root) return;
            const el = root.querySelector(selector);
            if (el) el.value = val ?? '';
        };

        // Fill the new modal fields (scoped to avoid clashing with Add modal ids)
        if (modalNew) {
            setValIn(modalNew, '#item_code', data.itemCode);
            setValIn(modalNew, '#name', data.itemName);
            setValIn(modalNew, '#category', data.category);
            setValIn(modalNew, '#description', data.description);
            setValIn(modalNew, '#quantity_in_stock', data.quantityInStock);
            setValIn(modalNew, '#unit', data.unit);
            setValIn(modalNew, '#reorder_level', data.reorderLevel);
            setValIn(modalNew, '#price_per_unit', data.pricePerUnit);
            try {
                const $supplierNew = $(modalNew).find('#supplier_id');
                applySupplierSelection($supplierNew, data.supplierName || data.supplierId || '', data.supplierId || '');
            } catch (_) {}
        }

        // Fill the legacy update modal fields if present
        if (modalOld) {
            setValIn(modalOld, '#item_code_update', data.itemCode);
            setValIn(modalOld, '#nameUpdate', data.itemName);
            setValIn(modalOld, '#category_update', data.category);
            setValIn(modalOld, '#description_update', data.description);
            setValIn(modalOld, '#quantity_update', data.quantityInStock);
            setValIn(modalOld, '#unit_update', data.unit);
            setValIn(modalOld, '#reorder_level_update', data.reorderLevel);
            setValIn(modalOld, '#price_update', data.pricePerUnit);
            setValIn(modalOld, '#supplierID_update', data.supplierId || '');
        }

        // Focus for UX
        const focusEl = (modalNew && modalNew.querySelector('#name')) || (modalOld && modalOld.querySelector('#nameUpdate'));
        if (focusEl) setTimeout(() => focusEl.focus(), 30);
    } catch (e) {
        console.error('fillUpdateInventoryForm error:', e);
    }
}

// Try to resolve master record using preloaded index; fallback to GraphQL fetch
async function resolveMasterByRowData(rowData){
    try {
        const idx = window.__invMasterIndex || {};
        const key = normalizeKey(rowData.itemCode);
        if (key && idx[key] && idx[key].id) {
            return idx[key];
        }

        // Fallback: fetch and match
        const query = "" +
            "query {\n" +
            "  getInventorySupplyItem {\n" +
            "    id\n" +
            "    itemCode\n" +
            "    supplierId\n" +
            "  }\n" +
            "}";
        const result = await $.ajax({
            url: '/mygraphql',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query })
        });

        const items = (result && result.data && result.data.getInventorySupplyItem) ? result.data.getInventorySupplyItem : [];
        const norm = v => (v == null ? '' : String(v)).trim().toLowerCase();
        const code = norm(rowData.itemCode);
        let match = items.find(x => norm(x.itemCode) === code);
        if (match) {
            // cache for next time
            window.__invMasterIndex[code] = { id: match.id, supplierId: match.supplierId };
            return { id: match.id, supplierId: match.supplierId };
        }
        return null;
    } catch (e) {
        console.error('resolveMasterByRowData error', e);
        return null;
    }
}


function setSupplierAutocomplete(target) {
    const $input = target ? $(target) : $("#supplier_id");
    if ($input.length === 0) { return; }
    // Prevent duplicate wiring per element
    if ($input.data('autocomplete-bound')) return;
    $input.data('autocomplete-bound', true);

    $input.autocomplete({
        source: function(request, response) {
            ensureSupplierOptions().then(function(options) {
                const term = (request.term || '').toLowerCase();
                const filtered = options.filter(opt => !term || opt.label.toLowerCase().includes(term)).slice(0, 15);
                response(filtered);
            }).catch(function(err){
                console.error('Supplier lookup failed', err);
                response([]);
            });
        },
        minLength: 0,
        delay: 0,
        appendTo: 'body',
        position: { my: 'left top+2', at: 'left bottom', collision: 'fit' },
        open: function() {
            try {
                const $widget = $(this).autocomplete('widget');
                $widget.css({ 'z-index': 100000, 'min-width': $(this).outerWidth() + 'px' });
            } catch (_) {}
        },
        select: function(event, ui) {
            try {
                const $self = $(this);
                $self.data('suppress-supplier-clear', true);
                applySupplierSelection($self, ui.item.label || ui.item.value || '', ui.item.value);
                setTimeout(() => { $self.removeData('suppress-supplier-clear'); }, 0);
            } catch (_) {}
            return false;
        }
    }).focus(function() {
        try { $(this).autocomplete("search", ""); } catch (_) {}
    }).on('input', function() {
        const $self = $(this);
        if ($self.data('suppress-supplier-clear')) return;
        $self.removeData('selected-id');
        $self.removeAttr('data-selected-id');
    });
}

function setInventoryMasterAutocomplete(target) {
    const $input = $(target);
    if ($input.length === 0) { return; }
    if ($input.data('autocomplete-bound')) return;
    $input.data('autocomplete-bound', true);

    $input.autocomplete({
        source: function(request, response) {
            ensureInventoryOptions().then(function(options){
                const term = (request.term || '').toLowerCase();
                const filtered = options.filter(opt => !term || opt.label.toLowerCase().includes(term)).slice(0, 15);
                response(filtered.map(opt => ({
                    label: opt.label,
                    value: opt.label,
                    payload: opt
                })));
            }).catch(function(err){
                console.error('Inventory lookup failed', err);
                response([]);
            });
        },
        minLength: 0,
        delay: 0,
        appendTo: 'body',
        position: { my: 'left top+2', at: 'left bottom', collision: 'fit' },
        open: function() {
            try {
                const $widget = $(this).autocomplete('widget');
                $widget.css({ 'z-index': 100000, 'min-width': $(this).outerWidth() + 'px' });
            } catch (_) {}
        },
        select: function(event, ui) {
            try {
                const data = ui.item.payload || {};
                const $ctx = $(this).closest('[role="dialog"], dialog');
                const q = (sel) => $ctx && $ctx.length ? $ctx.find(sel) : $(sel);
                q('#name').val(data.name || ui.item.value || '');
                if (data.itemCode) q('#item_code').val(data.itemCode);
                if (data.category) q('#category').val(data.category);
                if (data.description) q('#description').val(data.description);
                if (data.unit) q('#unit').val(data.unit);
                if (data.reorderLevel != null) q('#reorder_level').val(data.reorderLevel);
                if (data.pricePerUnit != null) q('#price_per_unit').val(data.pricePerUnit);
                if (data.supplierId) {
                    applySupplierSelection(q('#supplier_id'), '', data.supplierId);
                }
            } catch (err) {
                console.error('Inventory select apply failed', err);
            }
            return false;
        }
    }).focus(function() {
        try { $(this).autocomplete("search", ""); } catch (_) {}
    });
}

function hookAddItemModalOpen() {
    // Initialize when the field is focused (works irrespective of modal lib)
    $(document).on('focus', '#supplier_id, #supplier_id_update, #supplierID_update', function() {
        ensureSupplierOptions().catch(function(err){ console.error('Supplier preload failed', err); });
        try { setSupplierAutocomplete(this); } catch (_) {}
    });

    $(document).on('focus', '#name, #item_code, #category, #description, #unit', function() {
        ensureInventoryOptions().catch(function(err){ console.error('Inventory preload failed', err); });
        try { setInventoryMasterAutocomplete($('#name')); } catch (_) {}
    });

    // Initialize after clicking the Tailwind Elements modal open trigger
    $(document).on('click', 'button[command="show-modal"][commandfor="dialog"]', function() {
        setTimeout(function(){
            try {
                $("#supplier_id, #supplier_id_update, #supplierID_update").each(function(){
                    setSupplierAutocomplete(this);
                    if (this.id === 'supplier_id') {
                        applySupplierSelection($(this), '', '');
                    }
                });
                ensureInventoryOptions().catch(function(err){ console.error('Inventory preload failed', err); });
                setInventoryMasterAutocomplete($('#name'));
            } catch (_) {}
        }, 120);
    });
}

function insertInventory(e) {
    // Prefer getting values relative to the clicked button's modal, fallback to document
    let $ctx = null;
    try {
        if (e && e.currentTarget) {
            $ctx = $(e.currentTarget).closest('[role="dialog"]');
            if (!$ctx || !$ctx.length) {
                $ctx = $(e.currentTarget).closest('dialog');
            }
        }
    } catch (_) {}

    if (!$ctx || !$ctx.length) {
        $ctx = $('#dialog');
    }

    const q = (sel) => $ctx && $ctx.length ? $ctx.find(sel) : $(sel);

    const itemCode = q('#item_code').val();
    const name = q('#name').val();
    const description = q('#description').val();
    const category = q('#category').val();
    const quantityInStock = parseFloat(q('#quantity_in_stock').val()) || 0;
    const unit = q('#unit').val();
    const reorderLevel = parseFloat(q('#reorder_level').val()) || 0;
    const pricePerUnit = parseFloat(q('#price_per_unit').val()) || 0;
    const $supplierInput = q('#supplier_id');
    const supplierId = readSupplierId($supplierInput);

    if (!itemCode || !name) {
        alert('Item Code and Item Name are required.');
        return;
    }

    if (!supplierId) {
        alert('Please select a supplier from the dropdown.');
        return;
    }

    const escape = (str) => (str || '').toString().replace(/"/g, '"');

    const query = "" +
        "mutation {\n" +
        "    insertInventorySupplyItem(\n" +
        "        inventoryItems: {\n" +
        "            itemCode: \"" + escape(itemCode) + "\"\n" +
        "            name: \"" + escape(name) + "\"\n" +
        "            description: \"" + escape(description) + "\"\n" +
        "            category: \"" + escape(category) + "\"\n" +
        "            quantityInStock: " + quantityInStock + "\n" +
        "            unit: \"" + escape(unit) + "\"\n" +
        "            reorderLevel: " + reorderLevel + "\n" +
        "            pricePerUnit: " + pricePerUnit + "\n" +
        "            supplierId: \"" + escape(supplierId) + "\"\n" +
        "        }\n" +
        "    )\n" +
        "}";

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

function showUpdateModal(data) {
    try {
        // Ensure update modal exists; if not, build a lightweight one dynamically
        if ($('#supplierModalUpdating').length === 0) {
            try { $('#dynamicUpdateModal').remove(); } catch (_) {}
            const html = `
            <div id="supplierModalUpdating" role="dialog" aria-modal="true" aria-labelledby="dialog-title" class="relative z-50 hidden modal-modern">
              <div aria-hidden="true" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                  <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl card-shadow" id="dynamicUpdateModal">
                    <div class="gradient-bg px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4">
                          <i class="fas fa-edit text-white text-xl"></i>
                        </div>
                        <div>
                          <h3 class="text-xl font-bold text-white">Update Inventory Item</h3>
                          <p class="text-blue-100 text-sm">Modify inventory item details</p>
                        </div>
                      </div>
                    </div>
                    <div class="px-6 py-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input hidden type="text" id="idUpdate" class="form-input-modern">
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Item Code</label>
                          <input type="text" id="item_code_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Item Name</label>
                          <input type="text" id="nameUpdate" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Category</label>
                          <input type="text" id="category_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Quantity</label>
                          <input type="number" id="quantity_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Unit</label>
                          <input type="text" id="unit_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Reorder Level</label>
                          <input type="number" id="reorder_level_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Price per Unit</label>
                          <input type="number" step="0.01" id="price_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Supplier</label>
                          <input type="text" id="supplier_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Supplier ID</label>
                          <input type="text" id="supplierID_update" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>
                        <div class="md:col-span-2 space-y-2">
                          <label class="block text-sm font-semibold text-gray-700">Description</label>
                          <textarea id="description_update" rows="3" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                      <button type="button" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 close-modal">Cancel</button>
                      <button id="updateBtn" type="button" class="px-6 py-3 btn-primary-custom text-white font-semibold rounded-lg">Update Item</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            // Attach close handler for dynamically created modal
            $(document).off('click.dynamicClose').on('click.dynamicClose', '#supplierModalUpdating .close-modal', function(){
                const $dlg = $(this).closest('[role="dialog"]');
                $dlg.addClass('hidden').css('display','none');
            });
        }

        // Populate fields
        $('#idUpdate').val(data.id || '');
        $('#item_code_update').val(data.itemCode || '');
        $('#nameUpdate').val(data.itemName || '');
        $('#category_update').val(data.category || '');
        $('#description_update').val(data.description || '');
        $('#quantity_update').val(data.quantityInStock || 0);
        $('#unit_update').val(data.unit || '');
        $('#reorder_level_update').val(data.reorderLevel || 0);
        $('#price_update').val(data.pricePerUnit || 0);
        $('#supplier_update').val(data.supplierName || '');
        $('#supplierID_update').val(data.supplierId || '');

        // Show modal
        const $modal = $('#supplierModalUpdating');
        $modal.attr('aria-hidden','false');
        $modal.removeClass('hidden').css({ display: 'flex', visibility: 'visible', opacity: 1, 'z-index': 100000 });
        try {
            $modal.find('.fixed.inset-0').css('z-index', 100001);
        } catch (_) {}
    } catch (e) {
        console.error('Error showing update modal:', e);
    }
}
// expose globally
try { window.showUpdateModal = showUpdateModal; } catch (_) {}

function updateInventory() {
    // Prefer reading from the visible modal container to avoid ID clashes
    const $modalNew = $('#updateInventoryModal');
    const $modalOld = $('#supplierModalUpdating');

    // Read id from hidden input within the active modal or dataset
    let id = ($modalNew.length ? $modalNew.find('#idUpdate').val() : $modalOld.find('#idUpdate').val());
    if (!id) {
        id = document.getElementById('updateInventoryModal')?.getAttribute('data-item-id') || '';
    }
    if (!id) {
        alert('Missing item ID. Cannot update.');
        return;
    }

    // Helper to read value scoped to container
    const valIn = ($root, sel) => $root && $root.length ? $root.find(sel).val() : undefined;
    let supplierIdNew;
    if ($modalNew && $modalNew.length) {
        const $supInput = $modalNew.find('#supplier_id');
        supplierIdNew = readSupplierId($supInput) || ($supInput.length ? $supInput.val() : undefined);
    }

    const supplierIdOld = valIn($modalOld, '#supplierID_update');
    const supplierIdFinal = supplierIdOld || supplierIdNew || undefined;

    const updatedData = {
        id: id,
        itemCode: valIn($modalOld, '#item_code_update') || valIn($modalNew, '#item_code') || '',
        name: valIn($modalOld, '#nameUpdate') || valIn($modalNew, '#name') || '',
        category: valIn($modalOld, '#category_update') || valIn($modalNew, '#category') || '',
        description: valIn($modalOld, '#description_update') || valIn($modalNew, '#description') || '',
        quantityInStock: parseFloat(valIn($modalOld, '#quantity_update') || valIn($modalNew, '#quantity_in_stock')) || 0,
        unit: valIn($modalOld, '#unit_update') || valIn($modalNew, '#unit') || '',
        reorderLevel: parseFloat(valIn($modalOld, '#reorder_level_update') || valIn($modalNew, '#reorder_level')) || 0,
        pricePerUnit: parseFloat(valIn($modalOld, '#price_update') || valIn($modalNew, '#price_per_unit')) || 0,
        supplierId: supplierIdFinal
    };

    const mutation = "" +
        "mutation UpdateInventory($updatedData: InventoryUpdateInput!) {\n" +
        "  updateInventorySupplyItem(updatedData: $updatedData)\n" +
        "}";

    $.ajax({
        url: '/mygraphql',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            query: mutation,
            variables: { updatedData }
        }),
        success: function (res) {
            if (res.errors) {
                console.error('GraphQL Error:', res.errors);
                alert('Failed to update inventory: ' + res.errors.map(e => e.message).join('\n'));
                return;
            }
            if (res.data && res.data.updateInventorySupplyItem) {
                alert(res.data.updateInventorySupplyItem);
                $('#supplierModalUpdating').addClass('hidden').css('display','none');
                location.reload();
            } else {
                alert('Update did not complete.');
            }
        },
        error: function (xhr) {
            console.error('Update error:', xhr);
            alert('Error updating inventory.');
        }
    });
}
