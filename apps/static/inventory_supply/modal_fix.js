// Modal Fix for Enhanced Templates
// This script ensures compatibility between the enhanced templates and existing JavaScript

$(document).ready(function() {
    // Override the modal show/hide functionality to work with both hidden class and display style
    
    // Function to show modal
    function showModal(modalId) {
        const modal = $(modalId);
        modal.removeClass('hidden');
        modal.css('display', 'flex');
        modal.fadeIn(300);
        
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
        modal.fadeOut(300, function() {
            modal.addClass('hidden');
            modal.css('display', 'none');
        });
    }
    
    // Override the existing button click handlers
    $("#addSupplierBtn").off('click').on('click', function() {
        console.log('Add Inventory button clicked'); // Debug log
        showModal("#supplierModal");
        
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
});

// Make functions globally available
window.showModal = function(modalId) {
    const modal = $(modalId);
    modal.removeClass('hidden');
    modal.css('display', 'flex');
    modal.fadeIn(300);
};

window.hideModal = function(modalId) {
    const modal = $(modalId);
    modal.fadeOut(300, function() {
        modal.addClass('hidden');
        modal.css('display', 'none');
    });
};
