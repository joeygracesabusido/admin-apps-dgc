// Enhanced Features for Inventory Supply Templates

// Initialize enhanced features when document is ready
$(document).ready(function() {
    initializeEnhancedFeatures();
});

function initializeEnhancedFeatures() {
    // Add loading states to buttons
    addLoadingStates();
    
    // Initialize search functionality
    initializeSearch();
    
    // Add form validation
    addFormValidation();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Initialize animations
    initializeAnimations();
    
    // Add notification system
    initializeNotifications();
}

// Loading States for Buttons
function addLoadingStates() {
    $('.btn-primary-custom, .btn-success-custom').on('click', function() {
        const $btn = $(this);
        const originalText = $btn.html();
        
        // Add loading state
        $btn.prop('disabled', true)
            .html('<i class="fas fa-spinner fa-spin mr-2"></i>Processing...');
        
        // Simulate processing time (remove this in production)
        setTimeout(() => {
            $btn.prop('disabled', false).html(originalText);
        }, 2000);
    });
}

// Enhanced Search Functionality
function initializeSearch() {
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const table = $('#supplier_table');
        
        table.find('tbody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            if (rowText.includes(searchTerm)) {
                $(this).show().addClass('animate-fadeInUp');
            } else {
                $(this).hide();
            }
        });
        
        // Show "no results" message if needed
        const visibleRows = table.find('tbody tr:visible').length;
        if (visibleRows === 0 && searchTerm !== '') {
            if (!table.find('.no-results').length) {
                table.find('tbody').append(`
                    <tr class="no-results">
                        <td colspan="100%" class="text-center py-8 text-gray-500">
                            <i class="fas fa-search text-4xl mb-4 block"></i>
                            No results found for "${searchTerm}"
                        </td>
                    </tr>
                `);
            }
        } else {
            table.find('.no-results').remove();
        }
    });
}

// Form Validation
function addFormValidation() {
    // Real-time validation for required fields
    $('.form-input-modern[required]').on('blur', function() {
        validateField($(this));
    });
    
    // Validate on form submission
    $('form').on('submit', function(e) {
        let isValid = true;
        $(this).find('.form-input-modern[required]').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showNotification('Please fill in all required fields', 'error');
        }
    });
}

function validateField($field) {
    const value = $field.val().trim();
    const fieldName = $field.attr('id') || $field.attr('name');
    
    // Remove existing validation messages
    $field.next('.validation-message').remove();
    $field.removeClass('border-red-500 border-green-500');
    
    if (value === '') {
        $field.addClass('border-red-500');
        $field.after('<div class="validation-message text-red-500 text-xs mt-1">This field is required</div>');
        return false;
    }
    
    // Email validation
    if ($field.attr('type') === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            $field.addClass('border-red-500');
            $field.after('<div class="validation-message text-red-500 text-xs mt-1">Please enter a valid email address</div>');
            return false;
        }
    }
    
    // Phone validation
    if ($field.attr('type') === 'tel' && value !== '') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            $field.addClass('border-red-500');
            $field.after('<div class="validation-message text-red-500 text-xs mt-1">Please enter a valid phone number</div>');
            return false;
        }
    }
    
    $field.addClass('border-green-500');
    return true;
}

// Initialize Tooltips
function initializeTooltips() {
    // Add tooltips to buttons and icons
    $('[data-tooltip]').each(function() {
        const $element = $(this);
        const tooltipText = $element.data('tooltip');
        
        $element.on('mouseenter', function() {
            const tooltip = $(`<div class="tooltip-modern">${tooltipText}</div>`);
            $('body').append(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.css({
                position: 'absolute',
                top: rect.top - tooltip.outerHeight() - 5,
                left: rect.left + (rect.width / 2) - (tooltip.outerWidth() / 2),
                zIndex: 9999
            });
        });
        
        $element.on('mouseleave', function() {
            $('.tooltip-modern').remove();
        });
    });
}

// Keyboard Shortcuts
function addKeyboardShortcuts() {
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + N: Add new item
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            $('#addSupplierBtn').click();
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            $('#searchInput').focus();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            $('.close-modal').click();
        }
    });
}

// Initialize Animations
function initializeAnimations() {
    // Animate elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    });
    
    // Observe table rows
    $('#supplier_table tbody tr').each(function() {
        observer.observe(this);
    });
    
    // Add hover effects to cards
    $('.card-modern').on('mouseenter', function() {
        $(this).addClass('shadow-modern-lg');
    }).on('mouseleave', function() {
        $(this).removeClass('shadow-modern-lg');
    });
}

// Notification System
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!$('#notification-container').length) {
        $('body').append('<div id="notification-container" class="fixed top-4 right-4 z-50 space-y-2"></div>');
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = $(`
        <div class="notification-modern ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300">
            <div class="flex items-center">
                <i class="${icons[type]} mr-3"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="$(this).parent().parent().remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `);
    
    $('#notification-container').append(notification);
    
    // Animate in
    setTimeout(() => {
        notification.removeClass('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.addClass('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Enhanced DataTable Configuration
function initializeEnhancedDataTable() {
    if ($.fn.DataTable) {
        $('#supplier_table').DataTable({
            responsive: true,
            pageLength: 25,
            order: [[0, 'asc']],
            language: {
                search: "Search:",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                paginate: {
                    first: "First",
                    last: "Last",
                    next: "Next",
                    previous: "Previous"
                }
            },
            dom: '<"flex justify-between items-center mb-4"lf>rt<"flex justify-between items-center mt-4"ip>',
            drawCallback: function() {
                // Re-initialize animations for new rows
                initializeAnimations();
            }
        });
    }
}

// Export Functions
function exportToCSV() {
    const table = $('#supplier_table');
    const headers = [];
    const rows = [];
    
    // Get headers
    table.find('thead th').each(function() {
        headers.push($(this).text().trim());
    });
    
    // Get data rows
    table.find('tbody tr:visible').each(function() {
        const row = [];
        $(this).find('td').each(function() {
            row.push($(this).text().trim());
        });
        rows.push(row);
    });
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Print Function
function printTable() {
    const printWindow = window.open('', '_blank');
    const tableHTML = $('#supplier_table')[0].outerHTML;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Inventory Report</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                </style>
            </head>
            <body>
                <h1>Inventory Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
                ${tableHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Global functions for external use
window.showNotification = showNotification;
window.exportToCSV = exportToCSV;
window.printTable = printTable;
