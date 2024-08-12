// $(document).ready(function() {
//     $("#name").autocomplete({
//         source: function(request, response) {
//             $.ajax({
//                 url: "/api-autocomplete-employee/",
//                 data: { term: request.term },
//                 dataType: "json",
//                 success: function(data) {
//                     response(data);
//                 },
//                 error: function(err) {
//                     console.error("Error fetching autocomplete data:", err);
//                     // Optionally, provide user feedback about the error
//                 }
//             });
//         },
//         minLength: 0,  // Minimum length of the input before triggering autocomplete
//         select: function(event, ui) {
//             $("#name").val(ui.item.value); 
//             $("#employee_no").val(ui.item.employee_no);
//             $("#company").val(ui.item.company);
//             // $("#rate").val(ui.item.rate);
//             $("#rate").val(Number(ui.item.rate).toFixed(2));
//             $("#total_rate").val((Number(ui.item.rate) * 6).toFixed(2));
//             // $("#hdmf_loan").val(Number(ui.item.total_hdmf_loan_deduction).toFixed(2));
//             // $("#general_loan").val(Number(ui.item.total_cash_advance).toFixed(2));

//             calculatetotalGross()
//             return false;
//         }
//     });

  
// });






//=======================================This is for Next Nad Back Function for Page=============================


let currentPage = 1;
const totalPages = 3;
const nextPage = () => {
    if (currentPage < totalPages) {
      // Proceed to the next page
      currentPage++;
      const currentPageElem = document.getElementById('page' + currentPage);
      currentPageElem.style.display = 'block';
  
      const previousPageElem = document.getElementById('page' + (currentPage - 1));
      previousPageElem.style.display = 'none';
  
      if (currentPage === totalPages) {
        nextPageButton.style.display = 'none';
      }
    } else if (currentPage === totalPages) {
      alert('You are already on the last page.');
    }
  };
  
  const previousPage = () => {
    if (currentPage > 1) {
      currentPage--;
      const currentPageElem = document.getElementById('page' + currentPage);
      currentPageElem.style.display = 'block';
  
      const nextPageElem = document.getElementById('page' + (currentPage + 1));
      nextPageElem.style.display = 'none';
  
      nextPageButton.style.display = 'block';
    }
  };
  
  // Attach the event listener to the button for Next Page on page 1
  const nextPageButton = document.querySelector('#nextPage');
  nextPageButton.addEventListener('click', nextPage);
  
  // Attach the event listener to the button for Next Page on page 2
  const nextPageButton2 = document.querySelector('#nextPage2');
  nextPageButton2.addEventListener('click', nextPage);
  
  // Attach the event listener to the button for Previous Page
  const previousPageButton = document.querySelector('#previousPage');
  previousPageButton.addEventListener('click', previousPage);
  
  // Attach the event listener to the button for Previous Page
  const previousPageButton2 = document.querySelector('#previousPage2');
  previousPageButton2.addEventListener('click', previousPage);
  

// =====================================This is for selection of Employee  ID ==============================
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
                $("#employee_id").val(ui.item.employee_no);
                $("#company").val(ui.item.company);
                $("#salary_details").val(ui.item.salary_status);
                $("#rate").val(Number(ui.item.rate).toFixed(2));
                // $("#total_rate").val((Number(ui.item.rate) * 6).toFixed(2));
               
    
                // calculatetotalGross()
                return false;
            }
        });
    
      
    });
    
// =================================================This is for calculation of Regday=======================================
// // Get the elements we need
//                 const regdayInput = document.getElementById('regday');
//                 const salaryDetails = document.getElementById('salary_details');
//                 const salaryRateInput = document.getElementById('rate');
//                 const salaryRateInputAdan = document.getElementById('salary_rate_Adan');
//                 const regdayCalInput = document.getElementById('regday_cal');

//                 // Add an event listener to the regday input to calculate the regular day calculation
//                 // when the value of the input changes
//                 regdayInput.addEventListener('input', function(e) {
//                     // Get the values from the inputs
//                     const regday = Number(e.target.value);
//                     const salaryDetailsValue = salaryDetails.value;
//                     //.1675213
//                     let salaryRate = Number(salaryRateInput.value);

//                     // Calculate the salary rate and regular day calculation
//                     const regularDayCalculation = calculateRegularDay(
//                     salaryDetailsValue,
//                     salaryRate,
//                     regday
//                     );

//                     // Update the regular day calculation input with the result
//                     regdayCalInput.value = regularDayCalculation.toFixed(2);
//                     // calculatetotalGross()
//                 });

//                 // Function to calculate the regular day calculation
//                 function calculateRegularDay(salaryDetails, salaryRate, regday) {
//                     // If the salary is monthly, divide the salary rate by 26 to get the daily rate
//                     if (salaryDetails === 'Monthly') {
//                     salaryRate = salaryRate / 26;
//                     }

//                     // Return the regular day calculation
//                     return salaryRate * regday;
                    
//                 }

$(document).ready(function() {
    // Get the elements we need
    const $regdayInput = $('#regday');
    const $salaryDetails = $('#salary_details');
    const $salaryRateInput = $('#rate');
    const $salaryRateInputAdan = $('#salary_rate_Adan'); // Not used in the provided code, but included for completeness
    const $regdayCalInput = $('#regday_cal');

    // Add an event listener to the regday input to calculate the regular day calculation
    // when the value of the input changes
    $regdayInput.on('input', function(e) {
        // Get the values from the inputs
        const regday = Number($(this).val());
        const salaryDetailsValue = $salaryDetails.val();
        let salaryRate = Number($salaryRateInput.val());

        // Calculate the salary rate and regular day calculation
        const regularDayCalculation = calculateRegularDay(
            salaryDetailsValue,
            salaryRate,
            regday
        );
 
        // Update the regular day calculation input with the result
        $regdayCalInput.val(regularDayCalculation.toFixed(2));
        // calculatetotalGross(); // Uncomment if needed
    });

    // Function to calculate the regular day calculation
    function calculateRegularDay(salaryDetails, salaryRate, regday) {
        // If the salary is monthly, divide the salary rate by 26 to get the daily rate
        if (salaryDetails === 'Monthly') {
            salaryRate = salaryRate / 26;
        }

        // Return the regular day calculation
        return salaryRate * regday;
    }
});


// ==================================This is for Reg Day OY ==========================================

            document.getElementById('regday_ot').addEventListener('input',
            function(e){
                let regday_ot = e.target.value;

                var salDetails = document.getElementById('salary_details').value;
                var salaryRate;
                var regday_otCal;

                if (salDetails == 'Monthly'){
                    salaryRate =  document.getElementById('rate').value / 26;
                    regday_otCal = parseFloat(salaryRate) / 8 * 1.25 * parseFloat(regday_ot)
                    document.getElementById('regday_ot_cal').value=regday_otCal.toFixed(2);
                    calculatetotalGross()
                }else{
                    salaryRate =  document.getElementById('rate').value ;
                    regday_otCal = parseFloat(salaryRate) / 8 * 1.25 * parseFloat(regday_ot)
                    document.getElementById('regday_ot_cal').value=regday_otCal.toFixed(2);
                    calculatetotalGross()

                }
   
            }
            );

// ======================================This is for Sunday ==========================================
            document.getElementById('sunday').addEventListener('input',
            function(e){
                let sundayReg = e.target.value;
                var salDetails = document.getElementById('salary_details').value;
                
                var salaryRate;
                
                var sundayReg_cal;

                if (salDetails == 'Monthly'){
                    salaryRate =  document.getElementById('rate').value / 26;
                    sundayReg_cal = parseFloat(salaryRate) * parseFloat(sundayReg) * 1.30
                    document.getElementById('sunday_cal').value=sundayReg_cal.toFixed(2);
                    calculatetotalGross()
                }else{
                    salaryRate =  document.getElementById('rate').value;
                    sundayReg_cal = parseFloat(salaryRate) * parseFloat(sundayReg) * 1.30
                    document.getElementById('sunday_cal').value=sundayReg_cal.toFixed(2);
                    calculatetotalGross()
                }
                
                
                
            }
            );

// =================================This is for Sunday OT Calculation============================ 
            
                document.getElementById('sunday_ot').addEventListener('input',
                function(e){
                    let sunday_ot = e.target.value;
    
                    var salDetails = document.getElementById('salary_details').value;
                    var salaryRate;
                    var sunday_otCal;
    
                    if (salDetails == 'Monthly'){
                        salaryRate =  document.getElementById('rate').value / 26;
                        sunday_otCal = parseFloat(salaryRate) / 8 * 1.69 * parseFloat(sunday_ot)
                        document.getElementById('sunday_ot_cal').value=sunday_otCal.toFixed(2);
                        calculatetotalGross()
                    }else{
                        salaryRate =  document.getElementById('rate').value ;
                        sunday_otCal = parseFloat(salaryRate) / 8 * 1.69 * parseFloat(sunday_ot)
                        document.getElementById('sunday_ot_cal').value=sunday_otCal.toFixed(2);
                        calculatetotalGross()
                    }
    
                }
                );
    
// -- =================================This is for SPL Calculation============================ -->
              
                    document.getElementById('spl').addEventListener('input',
                    function(e){
                        let spl = e.target.value;
        
                        var salDetails = document.getElementById('salary_details').value;
                        var salaryRate;
                        var spl_cal;
        
                        if (salDetails == 'Monthly'){
                            salaryRate =  document.getElementById('rate').value / 26;
                            spl_cal = parseFloat(salaryRate) * parseFloat(spl) * 1.30
                            document.getElementById('spl_cal').value=spl_cal.toFixed(2);
                            calculatetotalGross()
                        }else{
                            salaryRate =  document.getElementById('rate').value ;
                            spl_cal = parseFloat(salaryRate) * parseFloat(spl) * 1.30
                            document.getElementById('spl_cal').value=spl_cal.toFixed(2);
                            calculatetotalGross()
                        }
        
                    }
                    );
        
// - =================================This is for SPL OT  Calculation============================ -->
                    
                        document.getElementById('spl_ot').addEventListener('input',
                        function(e){
                            let spl_ot = e.target.value;
            
                            var salDetails = document.getElementById('salary_details').value;
                            var salaryRate;
                            var spl_ot_cal;
            
                            if (salDetails == 'Monthly'){
                                salaryRate =  document.getElementById('rate').value / 26;
                                spl_ot_cal = parseFloat(salaryRate) / 8 * 1.69 * parseFloat(spl_ot)
                                document.getElementById('spl_ot_cal').value=spl_ot_cal.toFixed(2);
                                calculatetotalGross()
                            }else{
                                salaryRate =  document.getElementById('rate').value ;
                                spl_ot_cal = parseFloat(salaryRate)/ 8 * 1.69 * parseFloat(spl_ot) 
                                document.getElementById('spl_ot_cal').value=spl_ot_cal.toFixed(2);
                                calculatetotalGross()
                            }
            
                        }
                        );
            
// -- =================================This is for LGL2 Calculation============================ -->
                       
                            document.getElementById('lgl2').addEventListener('input',
                            function(e){
                                let spl = e.target.value;
                
                                var salDetails = document.getElementById('salary_details').value;
                                var salaryRate;
                                var lgl2_cal;
                
                                if (salDetails == 'Monthly'){
                                    salaryRate =  document.getElementById('rate').value / 26;
                                    lgl2_cal = parseFloat(salaryRate) * parseFloat(spl) * 2
                                    document.getElementById('lgl2_cal').value=lgl2_cal.toFixed(2);
                                    calculatetotalGross()
                                }else{
                                    salaryRate =  document.getElementById('rate').value ;
                                    lgl2_cal = parseFloat(salaryRate) * parseFloat(spl) * 2
                                    document.getElementById('lgl2_cal').value=lgl2_cal.toFixed(2);
                                    calculatetotalGross()
                
                                }
                
                            }
                            );
                
// -- =================================This is for LGL2 OT  Calculation============================ -->
                           
                               
                                 // Get the elements we need
                                    const lgl2OvertimeInput = document.getElementById('lgl2_ot');
                                    const salaryDetails2 = document.getElementById('salary_details');
                                    const salaryRateInput2= document.getElementById('rate');
                                    const lgl2OvertimeCalculationInput = document.getElementById('lgl2_ot_cal');
                    
                                    // Add an event listener to the lgl2 overtime input to calculate the overtime calculation
                                    // when the value of the input changes
                                    lgl2OvertimeInput.addEventListener('input', function(e) {
                                        // Get the values from the inputs
                                        const lgl2Overtime = Number(e.target.value);
                                        const salaryDetailsValue = salaryDetails2.value;
                                        const salaryRate = Number(salaryRateInput2.value);
                    
                                        // Calculate the overtime calculation
                                        const lgl2OvertimeCalculation = calculateOvertime(
                                        salaryDetailsValue,
                                        salaryRate,
                                        lgl2Overtime
                                        );
                    
                                        // Update the overtime calculation input with the result
                                        lgl2OvertimeCalculationInput.value = lgl2OvertimeCalculation.toFixed(2);
                                        calculatetotalGross()
                                    });
                    
                                    // Function to calculate the overtime calculation
                                    function calculateOvertime(salaryDetails2, salaryRate, lgl2Overtime) {
                                        // If the salary is monthly, divide the salary rate by 26 to get the daily rate
                                        if (salaryDetails2 === 'Monthly') {
                                        salaryRate = salaryRate / 26;
                                        }
                    
                                        // Return the overtime calculation
                                        return salaryRate / 8 * 2 * 1.30 * lgl2Overtime;
                                    }
                    
                           
                    
                    

// <!-- ====================================This is for computation of Legal 1 ==================================== -->
                                    
                            $(document).ready(function() {
                                $('#lgl1, #rate').on('input', function() {
                                    calculatelgl1();
                                });
                                });

                                function calculatelgl1() {
                                let product
                                var lgl1 = $('#lgl1').val();
                                var salaryRate = $('#rate').val();
                                
                                product = lgl1  * salaryRate;
                                product = product.toFixed(2)
                                $('#lgl1_cal').val(product);
                                calculatetotalGross()
                                }
                                                
                                    
                    
// <!-- ====================================This is for computation of Regday  Night diff ==================================== -->
                                    
                                        $(document).ready(function() {
                                        $('#nightDiff, #rate').on('input', function() {
                                            calculateNightDiff();
                                        });
                                        });
                    
                                        function calculateNightDiff() {
                                        let product
                                        var nightDiff = $('#nightDiff').val();
                                        var salaryRate = $('#rate').val();
                                        
                                        product = nightDiff  * ((salaryRate)/8 * 0.10);
                                        product = product.toFixed(2)
                                        $('#nightDiff_cal').val(product);
                                        calculatetotalGross()
                                        }

// <!-- ====================================This is for computation of Regday OT  Night diff ==================================== -->
                                    
                                        $(document).ready(function() {
                                        $('#nightDiff_regday_ot, #rate').on('input', function() {
                                            calculateNightDiff_ot();
                                        });
                                        });
                    
                                        function calculateNightDiff_ot() {
                                        let product
                                        var nightDiff = $('#nightDiff_regday_ot').val();
                                        var salaryRate = $('#rate').val();
                                        
                                        product = nightDiff  * ((salaryRate)/8 * 1.25 * 0.10);
                                        product = product.toFixed(2)
                                        $('#nightDiff_regdayOT_cal').val(product);
                                        calculatetotalGross()
                                        }
// <!-- ====================================This is for computation of SPL/RestDay  Night diff ==================================== -->
                                    
                                        $(document).ready(function() {
                                        $('#nightDiff_spl, #rate').on('input', function() {
                                            calculateNightDiff_spl();
                                        });
                                        });
                    
                                        function calculateNightDiff_spl() {
                                        let product
                                        var nightDiff = $('#nightDiff_spl').val();
                                        var salaryRate = $('#rate').val();
                                        
                                        product = nightDiff  * ((salaryRate)/8 * 1.30 * 0.10);
                                        product = product.toFixed(2)
                                        $('#nightDiff_spl_cal').val(product);
                                        calculatetotalGross()
                                        }


// <!-- ====================================This is for computation of SPL/RestDay OT  Night diff ==================================== -->
                                    
                                $(document).ready(function() {
                                    $('#nightDiff_spl_ot, #rate').on('input', function() {
                                        calculateNightDiff_spl_ot();
                                    });
                                    });

                                    function calculateNightDiff_spl_ot() {
                                    let product
                                    var nightDiff = $('#nightDiff_spl_ot').val();
                                    var salaryRate = $('#salary_rate').val();
                                    
                                    product = nightDiff  * ((salaryRate)/8 * 1.69 * 0.10);
                                    product = product.toFixed(2)
                                    $('#nightDiff_splOT_cal').val(product);
                                    calculatetotalGross()
                                    }


// <!-- ==============================This is for computation of Legal Holiday  Night diff ==================================== -->
                                    
                                $(document).ready(function() {
                                    $('#nightDiff_lgl2, #rate').on('input', function() {
                                        calculateNightDiff_lgl2();
                                    });
                                    });

                                    function calculateNightDiff_lgl2() {
                                    let product
                                    var nightDiff = $('#nightDiff_lgl2').val();
                                    var salaryRate = $('#salary_rate').val();
                                    
                                    product = nightDiff  * ((salaryRate)/8 * 2 * 0.10);
                                    product = product.toFixed(2)
                                    $('#nightDiff_lgl2_cal').val(product);
                                    calculatetotalGross()
                                    }

// <!-- ==============================This is for computation of Legal Holiday OT  Night diff ==================================== -->
                                    
                                $(document).ready(function() {
                                    $('#nightDiff_lgl2_ot, #salary_rate').on('input', function() {
                                        calculateNightDiff_lgl2_ot();
                                    });
                                    });

                                    function calculateNightDiff_lgl2_ot() {
                                    let product
                                    var nightDiff = $('#nightDiff_lgl2_ot').val();
                                    var salaryRate = $('#rate').val();
                                    
                                    product = nightDiff  * parseFloat(salaryRate)/8 * (2) *  (1.30) * (0.10);
                                    product = product.toFixed(2)
                                    $('#nightDiff_lgl2OT_cal').val(product);
                                    calculatetotalGross()
                                    }
                                // //     //This is for error 6.26.2023 5:37 PM"
                                // //     //another try
                                   
                    
// <!-- ====================================This is for computation of Total Gross==================================== -->
                                   
                                        $(document).ready(function() {
                                            $('#regday_cal, #regday_ot_cal, \
                                            #sunday_cal,#sunday_ot_cal,#spl_cal, \
                                            #spl_ot_cal,#lgl2_cal,#lgl2_ot_cal, \
                                            #nightDiff_cal,#nightDiff_regdayOT_cal, \
                                            #nightDiff_spl_cal,#nightDiff_splOT_cal,\
                                            #nightDiff_lgl2_cal,#nightDiff_lgl2OT_cal,\
                                            #adjustment,#lgl1_cal').on('input', function() {
                                                calculatetotalGross();
                                            });
                                            });
                    
                                            function calculatetotalGross() {
                                            
                                            let regdayCal;
                                            let regdayOTCal;
                                            let sunday_cal;
                                            let sunday_ot_cal;
                                            let spl_cal;
                                            let spl_ot_cal;
                                            let lgl2_cal;
                                            let lgl2_ot_cal;
                                            let nightDiff_cal;
                                            let nightDiff_regdayOT_cal;
                                            let nightDiff_spl_cal;
                                            let nightDiff_splOT_cal;
                                            let nightDiff_lgl2_cal;
                                            let nightDiff_lgl2OT_cal;
                                            let adjustment;
                                            let lgl1_cal;
                    
                    
                                            regdayCal = $('#regday_cal').val() || 0;
                                            regdayOTCal = $('#regday_ot_cal').val() || 0;
                                            sunday_cal = $('#sunday_cal').val() || 0;
                                            sunday_ot_cal = $('#sunday_ot_cal').val() || 0;
                                            spl_cal = $('#spl_cal').val() || 0;
                                            spl_ot_cal = $('#spl_ot_cal').val() || 0;
                                            lgl2_cal = $('#lgl2_cal').val() || 0;
                                            lgl2_ot_cal = $('#lgl2_ot_cal').val() || 0;
                                            nightDiff_cal = $('#nightDiff_cal').val() || 0;
                                            nightDiff_regdayOT_cal = $('#nightDiff_regdayOT_cal').val() || 0;
                                            nightDiff_spl_cal = $('#nightDiff_spl_cal').val() || 0;
                                            nightDiff_splOT_cal = $('#nightDiff_splOT_cal').val() || 0;
                                            nightDiff_lgl2_cal = $('#nightDiff_lgl2_cal').val() || 0;
                                            nightDiff_lgl2OT_cal = $('#nightDiff_lgl2OT_cal').val() || 0;
                                            adjustment = $('#adjustment').val() || 0;
                                            lgl1_cal = $('#lgl1_cal').val() || 0;
                                            
                                            let product;
                                            let product2
                                            product = (parseFloat(regdayCal) + parseFloat(regdayOTCal)
                                                            + parseFloat(sunday_cal) + parseFloat(sunday_ot_cal)
                                                            + parseFloat(spl_cal) + parseFloat(spl_ot_cal)
                                                            + parseFloat(lgl2_cal) + parseFloat(lgl2_ot_cal)
                                                            + parseFloat(nightDiff_cal) + parseFloat(nightDiff_regdayOT_cal)
                                                            + parseFloat(nightDiff_spl_cal) + parseFloat(nightDiff_splOT_cal)
                                                            + parseFloat(nightDiff_lgl2_cal) + parseFloat(nightDiff_lgl2OT_cal)
                                                            + parseFloat(adjustment) + parseFloat(lgl1_cal));
                    
                                            product2 = product.toFixed(2);
                                            const stringNumber = product.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                            $('#totalGross').val(stringNumber);
                                            $('#totalGross2').val(product2);
                                            }
                    
                        
                                          
                                          
//===========================================This function is for inserting Payroll TVI====================================
const insertPayrollGRC = async() => {
    // Get the values of the input fields
    const salaryRateInput = document.getElementById('salary_rate');
    // let salaryRate = Number(salaryRateInput.value) + (Number(salaryRateInput.value) * .1675213);
    // let salaryRate = document.getElementById('salary_rate_Adan')
    // salaryRate = salaryRate.toFixed(2)
    const nightDiff_cal = document.getElementById("nightDiff_cal").value || 0
    const nightDiff_regdayOT_cal = document.getElementById("nightDiff_regdayOT_cal").value || 0
    const nightDiff_spl_cal = document.getElementById("nightDiff_spl_cal").value || 0
    const nightDiff_splOT_cal = document.getElementById("nightDiff_splOT_cal").value || 0

    const nightDiff_lgl2_cal = document.getElementById("nightDiff_lgl2_cal").value || 0
    const nightDiff_lgl2OT_cal = document.getElementById("nightDiff_lgl2OT_cal").value || 0

    let totalNightdiff = ( parseFloat(nightDiff_cal) + parseFloat(nightDiff_regdayOT_cal) 
                           + parseFloat(nightDiff_spl_cal) + parseFloat(nightDiff_splOT_cal) 
                           + parseFloat(nightDiff_lgl2_cal) + parseFloat(nightDiff_lgl2OT_cal)
                            )

    totalNightdiff = totalNightdiff.toFixed(2)

    const data = {
        transDate: document.getElementById("datefrom").value,
        employee_id: document.getElementById("employee_id").value,
        first_name: document.getElementById("fname").value,
        last_name: document.getElementById("lname").value,
        salaryRate: document.getElementById("salary_rate").value || 0,
        addOnRate: document.getElementById("salary_rate_Adan").value || 0,
        salaryDetails: document.getElementById("salary_details").value || 0,
        regDay: document.getElementById("regday").value || 0,
        regDayOt: document.getElementById("regday_ot").value || 0,
        sunday: document.getElementById("sunday").value || 0,
        sundayOT: document.getElementById("sunday_ot").value || 0,
        spl: document.getElementById("spl").value || 0,
        splOT: document.getElementById("spl_ot").value || 0,
        lgl2: document.getElementById("lgl2").value || 0,
        lgl2OT: document.getElementById("lgl2_ot").value || 0,
        nightDiff: totalNightdiff,
        adjustment: document.getElementById("adjustment").value || 0,
        lgl1: document.getElementById("lgl1").value || 0,

    };
    console.log(data);

    const inputs = document.querySelectorAll('#page2 input');
    let isFilled = true;
    inputs.forEach((input) => {
      if (input.value === '') {
        isFilled = false;
        return;
      }
    });

    const inputs1 = document.querySelectorAll('#page3 input');
    let isFilled1 = true;
    inputs1.forEach((input) => {
      if (input.value === '') {
        isFilled1 = false;
        return;
      }
    });

    if (isFilled) {
        try {
            const response = await fetch(`/api-insert-grc-payroll/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // Check if the response was successful
            if (response.status === 200) {
                window.alert("Your data has been saved");
                window.location.assign("/employee-transaction-grc/");
            } else if (response.status === 401) {
                window.alert("Unauthorized credential. Please login");
            }
        } catch (error) {
            // Catch any errors and log them to the console
            window.alert(error);
            console.log(error);
        }
    } else {
      alert('Please fill in all the fields before proceeding.');
    }
    
       
    }

                                    
const BTN_saveGRC_Payroll = document.querySelector('#Btn_Save_payroll');
BTN_saveGRC_Payroll.addEventListener("click", insertPayrollGRC);                  
                    
                    
                                                                             
    






