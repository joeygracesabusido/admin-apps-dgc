$(document).ready(function () {
    var maxField = 10; // Input fields increment limitation
    var addButton = $('#add_button'); // Add button selector
    var wrapper = $('#addrow'); // Input field wrapper
    var x = 0; // Initial field counter

    // Function to format number with thousand separator
    function formatNumberWithSeparator(value) {
        return parseFloat(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Function to remove thousand separators and convert back to a number
    function parseFormattedNumber(value) {
        return value.replace(/,/g, '');
    }

    // Once add button is clicked
    $(addButton).click(function () {
        // Check maximum number of input fields
        x++; // Increment field counter
        var fieldHTML = `
            <tr>

                

                <td style="padding: 0; margin: 0;">
                    <input type="text" 
                    name="account_code${x}" 
                    id="account_code${x}"
                    class="account_code"
                    step="0.01"
                     />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="accountTitle${x}"
                        id="accountTitle${x}"
                        onchange="myFunction2()"
                    />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="amount${x}"
                        id="amount${x}"
                        class="amount"
                        step="0.01"
                    />
                </td>
                <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="credit_amount${x}"
                        id="credit_amount${x}"
                        class="credit_amount"
                        step="0.01"
                    />
                </td>

                 <td style="padding: 0; margin: 0;">
                    <input
                        type="text"
                        name="chart_of_account_id${x}"
                        id="chart_of_account_id${x}"
                        class="chart_of_account_id"
                        step="0.01"

                        hidden
                    />
                </td>
                
                
                <td style="padding: 0; margin: 0;">
                    <button type="button" id="remove_button" class="btn btn-danger">
                        <i class="fas fa-database"></i> Remove
                    </button>
                </td>

               

                

                
            </tr>`; // New input field HTML

        $(wrapper).append(fieldHTML); // Add field HTML
    });

    // Event delegation for input blur to handle formatting
    $(document).on('blur', 'input[name^="amount"], input[name^="credit_amount"]', function () {
        let input = $(this);
        let inputValue = input.val().trim();
        if (inputValue !== '' && !isNaN(inputValue)) {
            input.val(formatNumberWithSeparator(parseFormattedNumber(inputValue)));
        }
        //myFunction2();
    });

    // Event delegation for input focus to handle formatting
    $(document).on('focus', 'input[name^="amount"], input[name^="credit_amount"]', function () {
        let input = $(this);
        let inputValue = input.val().trim();
        input.val(parseFormattedNumber(inputValue)); // Remove formatting for editing
        //myFunction2();
    });

    // Once remove button is clicked
    $(wrapper).on('click', '#remove_button', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove(); // Remove field HTML 
       // myFunction2();
        x--; // Decrement field counter
    });

    // Autocomplete for accountTitle

    
});


