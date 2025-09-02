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
                        <select id="transaction_type_${itemIndex}" name="transaction_type[]" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm h-12">
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
    });

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

    document.getElementById('save-transaction-btn').addEventListener('click', () => {
        console.log("Save transaction button clicked.");
        // Add logic to save the transaction
        alert('Transaction saved!');
        document.getElementById('manageTransactionModal')?.remove();
    });

    addItemBtn.click();
}