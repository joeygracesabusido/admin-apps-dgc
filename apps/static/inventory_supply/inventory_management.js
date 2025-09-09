function showManageTransactionModal() {
    console.log("showManageTransactionModal function called.");

    const modalElement = document.createElement('div');
    modalElement.id = 'manageTransactionModal';
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.setAttribute('aria-labelledby', 'dialog-title');
    modalElement.className = 'relative z-50 modal-modern';

    modalElement.innerHTML = `
        <div aria-hidden="true" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
                <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl card-shadow">
                    <!-- Modal Header -->
                    <div class="gradient-bg px-6 py-4">
                        <div class="flex items-center">
                            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4">
                                <i class="fas fa-exchange-alt text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white">Manage Inventory Transactions</h3>
                                <p class="text-blue-100 text-sm">Insert or remove items from inventory</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-6 py-6">
                        <div class="space-y-2 mb-4">
                            <label for="transaction_date" class="block text-sm font-semibold text-gray-700">Transaction Date</label>
                            <input type="date" id="transaction_date" name="transaction_date" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>

                        <div class="space-y-2 mb-4"> 
                                <label for="company" class="block text-sm font-semibold text-gray-700">Company</label>
                                <select id="company" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                                    <option value="">Select Company</option>
                                    <option value="DRDC">DRDC</option>
                                    <option value="HFC">HFC</option>
                                    <option value="AFCMI">AFCMI</option>
                                    <option value="LCSDC">LCSDC</option>
                                    <option value="DCLSI">DCLSI</option>
                                    <option value="NTH">NTH</option>
                                </select>
                        </div>

                        <div class="space-y-2 mb-4">
                            <label for="departmen_management_transaction" class="block text-sm font-semibold text-gray-700">Department</label>
                            <input type="text" id="departmen_management_transaction" name="transaction_date" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>

                         <div class="space-y-2 mb-4">
                            <label for="remarks_management_transaction" class="block text-sm font-semibold text-gray-700">Remarks</label>
                            <input type="text" id="remarks_management_transaction" name="transaction_date" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm">
                        </div>

                        <div id="inventory-items-container">
                            <!-- Dynamic content will be injected here -->
                        </div>
                        <button id="add-item-btn" class="mt-4 px-6 py-3 btn-success-custom text-white font-semibold rounded-lg">
                            <i class="fas fa-plus mr-2"></i>Add Item
                        </button>
                    </div>

                    <!-- Modal Footer -->
                    <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button type="button" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 close-modal">
                            <i class="fas fa-times mr-2"></i>Cancel
                        </button>
                        <button id="save-transaction-btn" type="button" class="px-6 py-3 btn-primary-custom text-white font-semibold rounded-lg">
                            <i class="fas fa-save mr-2"></i>Save Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalElement);

    console.log("Modal element appended to body.");

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
        background: rgba(0, 0, 0, 0.5) !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    modalElement.classList.remove('hidden');

    console.log("Modal display properties set aggressively.");

    const addItemBtn = document.getElementById('add-item-btn');
    const inventoryItemsContainer = document.getElementById('inventory-items-container');

    addItemBtn.addEventListener('click', () => {
        const itemIndex = inventoryItemsContainer.children.length;
        const newItemRow = `
            <div class="inventory-item-row grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div class="space-y-2">
                    <label for="inventory_name_${itemIndex}" class="block text-sm font-semibold text-gray-700">Item Name</label>
                    <input type="text" id="inventory_name_${itemIndex}" name="inventory_name[]" placeholder="Inventory Name" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm h-12">
                </div>
                <div class="space-y-2">
                    <label for="int_item_code_${itemIndex}" class="block text-sm font-semibold text-gray-700">Item Code</label>
                    <input type="text" id="int_item_code_${itemIndex}" name="int_item_code[]" placeholder="Inventory Code" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm h-12">
                </div>
                <div class="space-y-2">
                    <label for="quantity_${itemIndex}" class="block text-sm font-semibold text-gray-700">Quantity</label>
                    <input type="number" id="quantity_${itemIndex}" name="quantity[]" placeholder="Quantity" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm h-12">
                </div>
                <div class="space-y-2">
                    <label for="transaction_type_${itemIndex}" class="block text-sm font-semibold text-gray-700">Type</label>
                    <div class="flex items-center">
                        <select id="transaction_type_${itemIndex}" name="transaction_type[]" class="form-input-modern w-full rounded-lg px-4 py-3 text-xs h-14">
                            <option value="in">IN</option>
                            <option value="out">OUT</option>
                        </select>
                        <button class="remove-item-btn ml-3 px-4 py-3 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        inventoryItemsContainer.insertAdjacentHTML('beforeend', newItemRow);
        setInventoryAutocomplete(`#inventory_name_${itemIndex}`);
    });

    function setInventoryAutocomplete(selector) {
        try {
            $(selector).autocomplete({
                source: function(request, response) {
                    console.log("Autocomplete search triggered for:", request.term);
                    $.ajax({
                        url: "/mygraphql",
                        method: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({
                            query: `
                                query getInventoryAutocomplete($searchTerm: String!) {
                                    getInventoryAutocomplete(searchTerm: $searchTerm) {
                                        id
                                        name
                                        itemCode
                                    }
                                }
                            `,
                            variables: {
                                searchTerm: request.term
                            }
                        }),
                        success: function(res) {
                            if (res.data && res.data.getInventoryAutocomplete) {
                                let suggestions = res.data.getInventoryAutocomplete.map(item => ({
                                    label: item.name,
                                    value: item.name,
                                    itemCode: item.itemCode
                                }));
                                console.log("Suggestions:", suggestions);
                                response(suggestions);
                            } else {
                                console.log("No suggestions found.");
                                response([]);
                            }
                        },
                        error: function(err) {
                            console.error("GraphQL Autocomplete error:", err);
                            response([]);
                        }
                    });
                },
                minLength: 0,
                delay: 0,
                appendTo: 'body',
                position: { my: 'left top+2', at: 'left bottom', collision: 'fit' },
                open: function() {
                    const $widget = $(this).autocomplete('widget');
                    $widget.css({
                        'z-index': 100000,
                        'min-width': $(this).outerWidth() + 'px'
                    });
                },
                select: function(event, ui) {
                    const itemIndex = $(this).attr('id').split('_').pop();
                    $(`#inventory_name_${itemIndex}`).val(ui.item.value);
                    $(`#int_item_code_${itemIndex}`).val(ui.item.itemCode);
                    return false;
                }
            }).focus(function() {
                console.log("Input focused, triggering search.");
                $(this).autocomplete("search", "");
            });
        } catch (e) {
            console.error("Error initializing autocomplete:", e);
        }
    }

    inventoryItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn') || e.target.closest('.remove-item-btn')) {
            e.target.closest('.inventory-item-row').remove();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.close-modal')) {
            console.log("Close modal button clicked.");
            document.getElementById('manageTransactionModal')?.remove();
        }
    });

    document.getElementById('save-transaction-btn').addEventListener('click', saveInventoryTransaction);

    addItemBtn.click();
}

async function saveInventoryTransaction() {
    console.log("Attempting to save inventory transaction.");

    const transactionDate = document.getElementById('transaction_date').value;
    const department = document.getElementById('departmen_management_transaction').value;
    const remarks = document.getElementById('remarks_management_transaction').value;
    const company = document.getElementById('company').value;

    if (!transactionDate || !department) {
        alert('Please fill in all required fields: Transaction Date and Department.');
        return;
    }

    const transactionItems = [];
    const itemRows = document.querySelectorAll('.inventory-item-row');

    itemRows.forEach((row, index) => {
        const itemName = row.querySelector(`#inventory_name_${index}`).value;
        const itemCode = row.querySelector(`#int_item_code_${index}`).value;
        const quantity = parseFloat(row.querySelector(`#quantity_${index}`).value);
        const transactionType = row.querySelector(`#transaction_type_${index}`).value;

        if (itemCode && !isNaN(quantity)) {
            transactionItems.push({
                itemCode: itemCode,
                itemName: itemName,
                quantity: quantity,
                transactionType: transactionType,
                transactionDate: transactionDate,
                department: department,
                company: company,
                remarks: remarks
            });
        }
    });

    if (transactionItems.length === 0) {
        alert('No valid items to save.');
        return;
    }

    const mutation = `
        mutation ManageInventoryTransaction($transactionItems: [TransactionItemInput!]!) {
            manageInventoryTransaction(transactionItems: $transactionItems)
        }
    `;

    try {
        const response = await fetch('/mygraphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: mutation,
                variables: { transactionItems }
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Error:', result.errors);
            alert('Error saving transaction: ' + result.errors.map(e => e.message).join('\n'));
        } else {
            console.log('GraphQL Success:', result);
            alert('Transaction saved successfully!');
            document.getElementById('manageTransactionModal')?.remove();

            window.location.reload();

            // Instead of reloading, re-fetch table data
            // loadInventoryTransactions(); // <- your function to refresh the DataTable

            
        }
    } catch (error) {
        console.error('Network or other error:', error);
        alert('An error occurred while saving the transaction.');
    }
}

function initializeTransactionTable() {
    const query = `
        query {
            getInventoryTransactions {
                transactionDate
                company
                id
                itemCode
                itemName
                quantity
                transactionType
                department
                remarks
            }
        }
    `;

    fetch('/mygraphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(result => {
        if (result.errors) {
            console.error('GraphQL Error:', result.errors);
            alert('Error fetching transactions: ' + result.errors.map(e => e.message).join('\n'));
        } else {
            const transactions = result.data.getInventoryTransactions;
            const table = $('#supplier_table').DataTable({
                data: transactions,
                columns: [
                    { data: 'transactionDate' },
                    { data: 'company' },
                    { data: 'itemCode' },
                    { data: 'itemName' },
                    { data: 'quantity' },
                    { data: 'transactionType' },
                    { data: 'department' },
                    { data: 'remarks' }
                ]
            });

            $('#supplier_table tbody').on('dblclick', 'tr', function () {
                console.log("Row double-clicked");
                const data = table.row(this).data();
                console.log("Data:", data);
                showUpdateTransactionModal(data);
            });
        }
    })
    .catch(error => {
        console.error('Network or other error:', error);
        alert('An error occurred while fetching transactions.');
        
    });
}

function showUpdateTransactionModal(data) {
    console.log("showUpdateTransactionModal called with data:", data);
    const modalId = 'updateTransactionModal';
    // Remove existing modal if it exists
    document.getElementById(modalId)?.remove();

    const modalElement = document.createElement('div');
    modalElement.id = modalId;
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.className = 'relative z-50 modal-modern';

    modalElement.innerHTML = `
        <div aria-hidden="true" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
                <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-lg card-shadow">
                    <div class="gradient-bg px-6 py-4">
                        <h3 class="text-xl font-bold text-white">Update Transaction</h3>
                    </div>
                    <div class="px-6 py-6">
                        <div class="space-y-4">
                            <input type="hidden" id="update_transaction_id" value="${data.id}">
                            <div>
                                <label for="update_item_name" class="block text-sm font-semibold text-gray-700">Item Name</label>
                                <input type="text" id="update_item_name" class="form-input-modern w-full rounded-lg" value="${data.itemName}">
                            </div>
                            <div>
                                <label for="update_item_code" class="block text-sm font-semibold text-gray-700">Item Code</label>
                                <input type="text" id="update_item_code" class="form-input-modern w-full rounded-lg" value="${data.itemCode}">
                            </div>
                            <div>
                                <label for="update_quantity" class="block text-sm font-semibold text-gray-700">Quantity</label>
                                <input type="number" id="update_quantity" class="form-input-modern w-full rounded-lg" value="${data.quantity}">
                            </div>
                            <div>
                                <label for="update_transaction_type" class="block text-sm font-semibold text-gray-700">Transaction Type</label>
                                <select id="update_transaction_type" class="form-input-modern w-full rounded-lg">
                                    <option value="in" ${data.transactionType === 'in' ? 'selected' : ''}>IN</option>
                                    <option value="out" ${data.transactionType === 'out' ? 'selected' : ''}>OUT</option>
                                </select>
                            </div>
                            <div>
                                <label for="update_department" class="block text-sm font-semibold text-gray-700">Department</label>
                                <input type="text" id="update_department" class="form-input-modern w-full rounded-lg" value="${data.department}">
                            </div>
                            <div>
                                <label for="update_company" class="block text-sm font-semibold text-gray-700">Company</label>
                                <select id="update_company" class="form-input-modern w-full rounded-lg">
                                    <option value="">Select Company</option>
                                    <option value="DRDC">DRDC</option>
                                    <option value="HFC">HFC</option>
                                    <option value="AFCMI">AFCMI</option>
                                    <option value="LCSDC">LCSDC</option>
                                    <option value="DCLSI">DCLSI</option>
                                    <option value="NTH">NTH</option>
                                </select>
                            </div>
                            <div>
                                <label for="update_remarks" class="block text-sm font-semibold text-gray-700">Remarks</label>
                                <input type="text" id="update_remarks" class="form-input-modern w-full rounded-lg" value="${data.remarks}">
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button type="button" class="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg close-modal">Cancel</button>
                        <button id="update-transaction-btn" type="button" class="px-6 py-3 btn-primary-custom text-white font-semibold rounded-lg">Update</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalElement);
    modalElement.style.display = 'flex';
    modalElement.style.visibility = 'visible';
    modalElement.style.opacity = '1';
    modalElement.style.position = 'fixed';
    modalElement.style.top = '0';
    modalElement.style.left = '0';
    modalElement.style.width = '100vw';
    modalElement.style.height = '100vh';
    modalElement.style.zIndex = '9999';
    modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalElement.style.alignItems = 'center';
    modalElement.style.justifyContent = 'center';


    document.getElementById('update-transaction-btn').addEventListener('click', () => {
        const transactionId = document.getElementById('update_transaction_id').value;
        updateInventoryTransaction(transactionId);
    });

    modalElement.querySelector('.close-modal').addEventListener('click', () => {
        modalElement.remove();
    });
}

async function updateInventoryTransaction(transactionId) {
    const updateData = {
        itemName: document.getElementById('update_item_name').value,
        itemCode: document.getElementById('update_item_code').value,
        quantity: parseFloat(document.getElementById('update_quantity').value),
        transactionType: document.getElementById('update_transaction_type').value,
        department: document.getElementById('update_department').value,
        company: document.getElementById('update_company').value,
        remarks: document.getElementById('update_remarks').value
    };

    const mutation = `
        mutation UpdateInventoryTransaction($transactionId: String!, $updateData: UpdateTransactionInput!) {
            updateInventoryTransaction(transactionId: $transactionId, updateData: $updateData)
        }
    `;

    try {
        const response = await fetch('/mygraphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: mutation,
                variables: { transactionId, updateData }
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Error:', result.errors);
            alert('Error updating transaction: ' + result.errors.map(e => e.message).join('\n'));
        } else {
            alert('Transaction updated successfully!');
            document.getElementById('updateTransactionModal')?.remove();
            // Refresh the table
            $('#supplier_table').DataTable().destroy();
            initializeTransactionTable();
        }
    } catch (error) {
        console.error('Network or other error:', error);
        alert('An error occurred while updating the transaction.');
    }
}

$(document).ready(function() {
    // Only initialize the transactions table on the inventory-management page
    if (location.pathname.indexOf('inventory-management') !== -1) {
        initializeTransactionTable();
    }
    // Bind add inventory items button if present on current page
    $(document).off('click.addInvItem').on('click.addInvItem', '#addSupplierBtn', function(e) {
        e.preventDefault();
        if (typeof showAddInventoryItemModal === 'function') {
            showAddInventoryItemModal();
        }
    });
});

// Show modal to add Inventory Item (re-usable across pages)
function showAddInventoryItemModal() {
    const modalId = 'addInventoryItemModal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.className = 'relative z-50 modal-modern';

    modal.innerHTML = `
        <div aria-hidden="true" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
                <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl card-shadow">
                    <div class="gradient-bg px-6 py-4">
                        <h3 class="text-xl font-bold text-white">Add Inventory Item</h3>
                    </div>
                    <div class="px-6 py-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_item_code">Item Code</label>
                                <input id="add_item_code" type="text" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_name">Name</label>
                                <input id="add_name" type="text" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_category">Category</label>
                                <input id="add_category" type="text" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_quantity_in_stock">Quantity In Stock</label>
                                <input id="add_quantity_in_stock" type="number" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_unit">Unit</label>
                                <input id="add_unit" type="text" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_reorder_level">Reorder Level</label>
                                <input id="add_reorder_level" type="number" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_price_per_unit">Price Per Unit</label>
                                <input id="add_price_per_unit" type="number" step="0.01" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700" for="add_supplier_id">Supplier ID</label>
                                <input id="add_supplier_id" type="text" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700" for="add_description">Description</label>
                                <textarea id="add_description" rows="3" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button type="button" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 close-modal">Cancel</button>
                        <button id="save-new-item-btn" type="button" class="px-6 py-3 btn-success-custom text-white font-semibold rounded-lg">Save Item</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.zIndex = '100000';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });

    document.getElementById('save-new-item-btn').addEventListener('click', saveNewInventoryItem);
    // Attach supplier autocomplete for the Supplier ID input
    try { setAddSupplierAutocomplete(); } catch (e) { console.error('Autocomplete init error:', e); }
}

async function saveNewInventoryItem() {
    const itemCode = document.getElementById('add_item_code').value.trim();
    const name = document.getElementById('add_name').value.trim();
    const category = document.getElementById('add_category').value.trim();
    const description = document.getElementById('add_description').value.trim();
    const quantityInStock = parseFloat(document.getElementById('add_quantity_in_stock').value) || 0;
    const unit = document.getElementById('add_unit').value.trim();
    const reorderLevel = parseInt(document.getElementById('add_reorder_level').value) || 0;
    const pricePerUnit = parseFloat(document.getElementById('add_price_per_unit').value) || 0;
    const supplierId = document.getElementById('add_supplier_id').value.trim();

    if (!itemCode || !name) {
        alert('Item Code and Name are required.');
        return;
    }

    const mutation = `
        mutation InsertItem($inventoryItems: InventoryItems!) {
            insertInventorySupplyItem(inventoryItems: $inventoryItems)
        }
    `;

    const variables = {
        inventoryItems: {
            itemCode,
            name,
            category,
            description,
            quantityInStock,
            unit,
            reorderLevel,
            pricePerUnit,
            supplierId
        }
    };

    try {
        const resp = await fetch('/mygraphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
            body: JSON.stringify({ query: mutation, variables })
        });
        const result = await resp.json();
        if (result.errors) {
            console.error('GraphQL Error:', result.errors);
            alert('Error saving item: ' + result.errors.map(e => e.message).join('\n'));
            return;
        }
        alert('Inventory item saved.');
        document.getElementById('addInventoryItemModal')?.remove();
        // Refresh the list if the table exists on this page
        if (typeof fetchAndDisplayInventoryBalance === 'function') {
            try { fetchAndDisplayInventoryBalance(); } catch (_) {}
        } else {
            window.location.reload();
        }
    } catch (e) {
        console.error('Network error:', e);
        alert('Network error saving item.');
    }
}

// Autocomplete for supplier input in the Add Inventory Item modal
function setAddSupplierAutocomplete() {
    const selector = '#add_supplier_id';
    if (!$(selector).length) return;

    $(selector).autocomplete({
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
                    variables: { searchTerm: request.term }
                }),
                success: function(res) {
                    if (res.data && res.data.getSupplierAutocomplete) {
                        const suggestions = res.data.getSupplierAutocomplete.map(item => ({
                            label: item.name,
                            value: item.id
                        }));
                        response(suggestions);
                    } else {
                        response([]);
                    }
                },
                error: function(err) {
                    console.error("Supplier Autocomplete error:", err);
                    response([]);
                }
            });
        },
        minLength: 0,
        delay: 0,
        appendTo: 'body',
        position: { my: 'left top+2', at: 'left bottom', collision: 'fit' },
        open: function() {
            const $widget = $(this).autocomplete('widget');
            $widget.css({ 'z-index': 100000, 'min-width': $(this).outerWidth() + 'px' });
        }
    }).focus(function() {
        $(this).autocomplete("search", $(this).val() || "");
    });
}


// expose for inline hooks if needed
window.showAddInventoryItemModal = showAddInventoryItemModal;
