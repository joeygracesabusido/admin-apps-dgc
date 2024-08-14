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
            calculatetotalGross()
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
    calculatetotalGross()
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
    calculatetotalGross()
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
    calculatetotalGross()
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
    calculatetotalGross()
});


//====================================This is for computation of SPL ==================================== -->
                                    
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
                                calculatetotalGross()
                                
                                }

// ================================This is for computation for LGL2====================================
                        $(document).ready(function() {
                            $('#legl_holiday_no, #rate').on('input', function() {
                                calculatelgl2();
                            });
                            });

                            function calculatelgl2() {
                            let product
                            var spl = $('#legl_holiday_no').val();
                            var salaryRate = $('#rate').val();
                            
                            product = spl  * salaryRate * 1;
                            product = product.toFixed(2)
                            $('#legal_holiday_amount').val(product);
                            calculatetotalGross()
                            
                            }

// ================================This is for computation for Holiday OT====================================
$(document).ready(function() {
    // Event listener for input changes
    $('#holiday_ot_number, #rate').on('input', function() {
        // Check the state of the checkboxes and call the appropriate function
        if ($('#spl_ot_checkbox').is(':checked')) {
            calculateSpl();
        } else if ($('#lgl2_checkbox').is(':checked')) {
            calculateLgl2();
        }
    });
});

// Function for Special Holiday OT calculation
function calculateSpl() {
    let product;
    var ot_number = $('#holiday_ot_number').val();
    var salaryRate = $('#rate').val();
    
    product = ot_number * (salaryRate / 8) * 1.69;
    product = product.toFixed(2);
    $('#holiday_ot_amount').val(product);
    calculatetotalGross()
}

// Function for Legal Holiday OT calculation
function calculateLgl2() {
    let product;
    var ot_number = $('#holiday_ot_number').val();
    var salaryRate = $('#rate').val();
    
    product = ot_number * (salaryRate / 8) * 2 * 1.30;
    product = product.toFixed(2);
    $('#holiday_ot_amount').val(product);
    calculatetotalGross()
}


// =================================This is for computation for Gross Salary======================
$(document).ready(function() {
    $('#salary, #absent_amount, \
    #late_amount,#under_time_amount,#normal_working_day_ot_amount, \
    #spl_30_amount,#legal_holiday_amount,#holiday_ot_amount, \
    #basic_pay_adjustment').on('input', function() {
        calculatetotalGross();
    });
    });

    function calculatetotalGross() {
    
    let salary;
    let absent_amount;
    let late_amount;
    let under_time_amount;
    let normal_working_day_ot_amount;
    let spl_30_amount;
    let legal_holiday_amount;
    let holiday_ot_amount;
    let basic_pay_adjustment


    salary = $('#salary').val() || 0;
    absent_amount = $('#absent_amount').val() || 0;
    late_amount = $('#late_amount').val() || 0;
    under_time_amount = $('#under_time_amount').val() || 0;
    normal_working_day_ot_amount = $('#normal_working_day_ot_amount').val() || 0;
    spl_30_amount = $('#spl_30_amount').val() || 0;
    legal_holiday_amount = $('#legal_holiday_amount').val() || 0;
    holiday_ot_amount = $('#holiday_ot_amount').val() || 0;
    basic_pay_adjustment = $('#basic_pay_adjustment').val() || 0;
    
    let product;
    let product2
    product = (parseFloat(salary) + parseFloat(absent_amount)
                    + parseFloat(late_amount) + parseFloat(under_time_amount)
                    + parseFloat(normal_working_day_ot_amount) + parseFloat(spl_30_amount)
                    + parseFloat(legal_holiday_amount) + parseFloat(holiday_ot_amount)
                    + parseFloat(basic_pay_adjustment));

    product2 = product.toFixed(2);
    const stringNumber = product.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    $('#gross_pay').val(stringNumber);
    $('#gross_pay').val(product2);
    }
