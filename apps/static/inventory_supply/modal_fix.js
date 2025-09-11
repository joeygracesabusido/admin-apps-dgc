// Modal Fix for Enhanced Templates
// This script ensures compatibility between the enhanced templates and existing JavaScript

$(document).ready(function() {
    if (window.__modalFixInit) return; // guard against double init
    window.__modalFixInit = true;
    // Override the modal show/hide functionality to work with both hidden class and display style
    
    // Function to show modal
    function showModal(modalId) {
        const modal = $(modalId);
        if (!modal.length) {
            console.warn('showModal: element not found', modalId);
            return;
        }
        modal.removeClass('hidden').addClass('modal-show');
        modal.css({ display: 'flex', visibility: 'visible', opacity: 1, 'z-index': 100000 });
        // Avoid jQuery changing display to block; set immediate visibility
        modal.stop(true, true).show();
        try {
            const el = modal.get(0);
            const cs = window.getComputedStyle(el);
            console.log('showModal computed:', { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, zIndex: cs.zIndex });
        } catch (e) {}
        
        // Add backdrop click to close
        modal.find('.fixed.inset-0.bg-gray-900\\/50, .fixed.inset-0.bg-gray-500\\/75').on('click', function(e) {
            if (e.target === this) {
                hideModal(modalId);
            }
        });
    }
    
    // Function to hide modal
    function hideModal(modalId) {
        const modal = $(modalId);
        modal.stop(true, true).fadeOut(150, function() {
            modal.removeClass('modal-show').addClass('hidden');
            modal.css({ display: 'none', visibility: '', opacity: '' });
        });
    }
    
    // Override the existing button click handlers
    $("#addSupplierBtn").off('click').on('click', function() {
        console.log('Add Inventory button clicked'); // Debug log
        if (typeof window.showAddInventoryModal === 'function') {
            window.showAddInventoryModal();
        } else {
            showModal("#supplierModal");
        }
        
        // Call the existing setSupplierAutocomplete function if it exists
        if (typeof setSupplierAutocomplete === 'function') {
            setSupplierAutocomplete();
        }
    });
    
    $("#updateSupplierBtn").off('click').on('click', function() {
        console.log('Update Inventory button clicked'); // Debug log
        showModal("#supplierModalUpdating");
        
        // Call the existing setSupplierAutocomplete function if it exists
        if (typeof setSupplierAutocomplete === 'function') {
            setSupplierAutocomplete();
        }
    });
    
    // Handle close modal buttons
    $(".close-modal").on('click', function() {
        const modal = $(this).closest('[role="dialog"]');
        const modalId = '#' + modal.attr('id');
        hideModal(modalId);
    });
    
    // Handle escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.modal-modern:visible').each(function() {
                const modalId = '#' + $(this).attr('id');
                hideModal(modalId);
            });
        }
    });
    
    // Debug: Log when script loads
    console.log('Modal fix script loaded');
    console.log('Add button exists:', $("#addSupplierBtn").length > 0);
    console.log('Modal exists:', $("#supplierModal").length > 0);
    // Log initial computed style for debugging
    try {
        const m = document.querySelector('#supplierModal');
        if (m) {
            const cs = getComputedStyle(m);
            console.log('Initial modal computed:', { display: cs.display, visibility: cs.visibility, opacity: cs.opacity, zIndex: cs.zIndex });
        }
    } catch (e) {}
});

// Make functions globally available
window.showModal = function(modalId) {
    const modal = $(modalId);
    modal.removeClass('hidden').addClass('modal-show');
    modal.css({ display: 'flex', visibility: 'visible', opacity: 1, 'z-index': 100000 });
    modal.stop(true, true).show();
};

window.hideModal = function(modalId) {
    const modal = $(modalId);
    modal.stop(true, true).fadeOut(150, function() {
        modal.removeClass('modal-show').addClass('hidden');
        modal.css({ display: 'none', visibility: '', opacity: '' });
    });
};
