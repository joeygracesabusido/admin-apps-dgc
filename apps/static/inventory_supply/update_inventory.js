// Reusable creator/show function for the Update Inventory modal
window.updateInventoryModal = function () {
  const EXISTING_ID = 'updateInventoryModal';

  let modalElement = document.getElementById(EXISTING_ID);

  if (!modalElement) {
    modalElement = document.createElement('div');
    modalElement.id = EXISTING_ID;
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.setAttribute('aria-labelledby', 'updateInvDialogTitle');
    // start hidden; we’ll toggle this
    modalElement.className = 'relative z-[2147483647] modal-modern hidden';

    modalElement.innerHTML = `
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" data-overlay></div>

      <!-- Container -->
      <div class="fixed inset-0 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl card-shadow">
            <!-- Header -->
            <div class="gradient-bg px-6 py-4">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4">
                  <i class="fas fa-edit text-white text-xl"></i>
                </div>
                <div>
                  <h3 id="updateInvDialogTitle" class="text-xl font-bold text-white">Update Inventory Items</h3>
                  <p class="text-blue-100 text-sm">Update inventory item</p>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="item_code" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-barcode text-blue-500 mr-2"></i>Item Code
                  </label>
                  <input type="text" id="item_code" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="Enter item code">
                </div>

                <div class="space-y-2">
                  <label for="name" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-tag text-green-500 mr-2"></i>Item Name
                  </label>
                  <input type="text" id="name" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="Enter item name">
                </div>

                <div class="space-y-2">
                  <label for="category" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-layer-group text-purple-500 mr-2"></i>Category
                  </label>
                  <input type="text" id="category" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="Enter category">
                </div>

                <div class="space-y-2">
                  <label for="quantity_in_stock" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-cubes text-orange-500 mr-2"></i>Quantity in Stock
                  </label>
                  <input type="number" id="quantity_in_stock" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="0">
                </div>

                <div class="space-y-2">
                  <label for="unit" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-ruler text-indigo-500 mr-2"></i>Unit
                  </label>
                  <input type="text" id="unit" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="e.g., pcs, kg, liter">
                </div>

                <div class="space-y-2">
                  <label for="reorder_level" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>Reorder Level
                  </label>
                  <input type="number" id="reorder_level" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="Minimum stock level">
                </div>

                <div class="space-y-2">
                  <label for="price_per_unit" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-dollar-sign text-green-600 mr-2"></i>Price per Unit
                  </label>
                  <input type="number" step="0.01" id="price_per_unit" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="0.00">
                </div>

                <div class="space-y-2">
                  <label for="supplier_id" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-truck text-blue-600 mr-2"></i>Supplier
                  </label>
                  <input type="text" id="supplier_id" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm" placeholder="Select or enter supplier">
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label for="description" class="block text-sm font-semibold text-gray-700">
                    <i class="fas fa-align-left text-gray-500 mr-2"></i>Description
                  </label>
                  <textarea id="description" rows="3" class="form-input-modern w-full rounded-lg px-4 py-3 text-sm resize-none" placeholder="Enter item description"></textarea>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button type="button" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300" data-close>
                <i class="fas fa-times mr-2"></i>Cancel
              </button>
              <button id="updateBtn" type="button" class="px-6 py-3 btn-success-custom text-white font-semibold rounded-lg">
                <i class="fas fa-save mr-2"></i>Update Item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalElement);

    // ---- close wiring (run ONCE) ----
    const closeModal = () => {
      // remove inline show styles, then hide
      modalElement.style.cssText = '';
      modalElement.classList.add('hidden');
      document.removeEventListener('keydown', modalElement._onEsc);
    };

    const overlay = modalElement.querySelector('[data-overlay]');
    const closeBtn = modalElement.querySelector('[data-close]');
    overlay?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    modalElement._onEsc = (e) => { if (e.key === 'Escape') closeModal(); };
  }

  // ---- show modal ----
  modalElement.classList.remove('hidden');
  // force on top (inline), but keep this minimal so close can clear it
  modalElement.style.cssText = `
    display: flex !important;
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483647 !important;
    align-items: center !important;
    justify-content: center !important;
    visibility: visible !important;
    opacity: 1 !important;
  `;
  document.addEventListener('keydown', modalElement._onEsc);
};



function setSupplierAutocomplete() {
    if (window.__supplierAutocompleteBound) return;
    window.__supplierAutocompleteBound = true;

    const $input = $("#supplier_id");
    if ($input.length === 0) { window.__supplierAutocompleteBound = false; return; }

    $input.autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/mygraphql",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    // Use camelCase field/arg names exposed by Strawberry
                    query: "" +
                        "query getSupplierAutocomplete($searchTerm: String!) {\n" +
                        "    getSupplierAutocomplete(searchTerm: $searchTerm) {\n" +
                        "        id\n" +
                        "        name\n" +
                        "    }\n" +
                        "}",
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
                    } else {
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
            try {
                const $widget = $(this).autocomplete('widget');
                $widget.css({ 'z-index': 100000, 'min-width': $(this).outerWidth() + 'px' });
            } catch (_) {}
        },
        select: function(event, ui) {
            $("#supplier_id").val(ui.item.value);
            return false;
        }
    }).focus(function() {
        try { $(this).autocomplete("search", ""); } catch (_) {}
    });
}



