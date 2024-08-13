$(document).ready(function() {
    $("#name").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/api-autocomplete-employee/",
                data: { term: request.term },
                dataType: "json",
                success: function(data) {
                    response(data);
                },
                error: function(err) {
                    console.error("Error fetching autocomplete data:", err);
                    // Optionally, provide user feedback about the error
                }
            });
        },
        minLength: 0,  // Minimum length of the input before triggering autocomplete
        select: function(event, ui) {
            $("#name").val(ui.item.value); 
            $("#employee_no").val(ui.item.employee_no);
            $("#company").val(ui.item.company);
            $("#salary_status").val(ui.item.salary_status);
            $("#rate").val(Number(ui.item.rate).toFixed(2));
            $("#salary").val((Number(ui.item.rate) * 6).toFixed(2));
            // $("#hdmf_loan").val(Number(ui.item.total_hdmf_loan_deduction).toFixed(2));
            // $("#general_loan").val(Number(ui.item.total_cash_advance).toFixed(2));

            // calculatetotalGross()
            // calculateAbsentAmount()
            return false;
        }
    });

  
});



// ===================================this is for computation of absences=====================
document.getElementById('absent_no').addEventListener('input', (e) => {
    let absent_no = e.target.value.trim(); // Use trim() to remove any extra whitespace

    let salDetails = document.getElementById('salary_status').value;
    let salaryRate;
    let absent_amount = 0; // Default value

    // Check if the absent_no field is empty
    if (absent_no === '') {
        document.getElementById('absent_amount').value = '0.00';
        return; // Exit the function early
    }

    // Convert absent_no to a number
    absent_no = parseFloat(absent_no);

    if (salDetails === 'Monthly') {
        salaryRate = document.getElementById('rate').value / 26;
    } else {
        salaryRate = document.getElementById('rate').value;
    }

    absent_amount = salaryRate * absent_no;

    // Update the absent_amount field with the calculated value
    document.getElementById('absent_amount').value = absent_amount.toFixed(2);
});



// ===================================this is for computation of Late =====================
document.getElementById('no_late').addEventListener('input', (e) => {
    let no_late = e.target.value.trim(); // Use trim() to remove any extra whitespace

    let salDetails = document.getElementById('salary_status').value;
    let salaryRate;
    let late_amount = 0; // Default value

    // Check if the absent_no field is empty
    if (no_late === '') {
        document.getElementById('late_amount').value = '0.00';
        return; // Exit the function early
    }

    // Convert absent_no to a number
    no_late = parseFloat(no_late);

    if (salDetails === 'Monthly') {
        salaryRate = document.getElementById('rate').value / 26;
    } else {
        salaryRate = document.getElementById('rate').value / 8;
    }

    late_amount = salaryRate * no_late;

    // Update the absent_amount field with the calculated value
    document.getElementById('late_amount').value = late_amount.toFixed(2);
});

// ===================================this is for computation of Undertime =====================
document.getElementById('under_time_no').addEventListener('input', (e) => {
    let under_time_no = e.target.value.trim(); // Use trim() to remove any extra whitespace

    let salDetails = document.getElementById('salary_status').value;
    let salaryRate;
    let under_time_amount = 0; // Default value

    // Check if the absent_no field is empty
    if (under_time_no === '') {
        document.getElementById('under_time_amount').value = '0.00';
        return; // Exit the function early
    }

    // Convert absent_no to a number
    under_time_no = parseFloat(under_time_no);

    if (salDetails === 'Monthly') {
        salaryRate = document.getElementById('rate').value / 26;
    } else {
        salaryRate = document.getElementById('rate').value / 8;
    }

    late_amount = salaryRate * under_time_no;

    // Update the absent_amount field with the calculated value
    document.getElementById('under_time_amount').value = late_amount.toFixed(2);
});


// ===================================this is for computation of Overtime =====================
document.getElementById('normal_working_day_ot_no').addEventListener('input', (e) => {
    let normal_working_day_ot_no = e.target.value.trim(); // Use trim() to remove any extra whitespace

    let salDetails = document.getElementById('salary_status').value;
    let salaryRate;
    let normal_working_day_ot_amount = 0; // Default value

    // Check if the absent_no field is empty
    if (normal_working_day_ot_no === '') {
        document.getElementById('normal_working_day_ot_amount').value = '0.00';
        return; // Exit the function early
    }

    // Convert absent_no to a number
    normal_working_day_ot_no = parseFloat(normal_working_day_ot_no);

    if (salDetails === 'Monthly') {
        salaryRate = document.getElementById('rate').value / 26;
    } else {
        salaryRate = document.getElementById('rate').value / 8 ;
    }

    normal_working_day_ot_amount = (salaryRate *1.25) * normal_working_day_ot_no;

    // Update the absent_amount field with the calculated value
    document.getElementById('normal_working_day_ot_amount').value = normal_working_day_ot_amount.toFixed(2);
});


// <!-- ====================================This is for computation of SPL ==================================== -->
                                    
                            $(document).ready(function() {
                                $('#spl_30_no, #rate').on('input', function() {
                                    calculatelgl1();
                                });
                                });

                                function calculatelgl1() {
                                let product
                                var spl = $('#spl_30_no').val();
                                var salaryRate = $('#rate').val();
                                
                                product = spl  * salaryRate * .30;
                                product = product.toFixed(2)
                                $('#spl_30_amount').val(product);
                                
                                }

