// 

let isUpdating = false;
let checkList = [];
let selectedCheck = null;
let clickTimer = null; // Declare clickTimer here

// Function to fetch check details
async function getCheckDetails() {
  try {
    const response = await fetch(`/api-get-check-printing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      checkList = await response.json();
      $("#table_check_printer_list").empty(); // Clear the table before appending rows
      let i = 0;
      checkList.forEach((check) => {
        $("#table_check_printer_list").append(makeCheckRow(i++, check));
      });

      // Call the DataTable function here after populating the table
      initializeDataTable2(); // Initialize the DataTable

    } else {
      const error = await response.json();
      alert(`Error: ${error.detail}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred while fetching the check details.");
  }
}

// Function to create table row for each check
function makeCheckRow(index, check) {
  return `<tr id='${"check_row_" + index}' onClick="openToEdit(${index},'${
    "check_row_" + index
  }')">
    <td>${index + 1}</td>
    <td>${check.trans_date}</td>
    <td>${check.check_no}</td>
    <td>${check.payee}</td>
    <td>${formatNumberWithSeparator(check.amount)}</td>
    <td>${check.amount_in_words}</td>
  </tr>`;
 

};
// initializeDataTable2()

// Function to detect double-click
function isDoubleClick() {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null; // Reset the timer
    return true; // Double-click detected
  } else {
    clickTimer = setTimeout(() => {
      clickTimer = null; // Reset timer after a delay
    }, 250); // Delay to detect double-click
    return false; // Not a double-click
  }
}

// Function to open a row for editing
function openToEdit(index, checkRowId) {
  if (isDoubleClick()) {
    isUpdating = true;
    $("#btn_save_branch").text("Update");
    $("#table_check_printer_list tr").removeClass("table-primary");
    const check = checkList[index];

    $("#trans_date").val(check.trans_date);
    $("#check_no").val(check.check_no);
    $("#payee").val(check.payee);
    $("#amount").val(check.amount);
    $("#amount_in_words").val(check.amount_in_words);

    selectedCheck = check;
    $(`#${checkRowId}`).addClass("table-primary");
  }
}

// Function to save or update check details
async function saveOrUpdateCheck() {
  const checkData = {
    trans_date: $("#trans_date").val(),
    check_no: $("#check_no").val(),
    payee: $("#payee").val(),
    amount: $("#amount").val(),
    amount_in_words: $("#amount_in_words").val(),
  };

  if (!checkData.trans_date || !checkData.check_no || !checkData.payee || !checkData.amount) {
    alert("Please fill in all fields.");
    return;
  }

  if (!isUpdating) {
    $.ajax({
      url: "/api-insert-check-printing/",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify([checkData]), // Wrap in an array for bulk insert
      success: function (response) {
        alert(response.message);
        // getCheckDetails(); // Refresh check list
        window.location.href = "/check-printing/"; 
      },
    //   error: function (xhr) {
    //     alert(`Error: ${xhr.responseJSON?.detail || "An error occurred"}`);
    //   },
    });
  } else {
    $.ajax({
      url: `/api-check-printing-update/${selectedCheck.id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(checkData),
      success: function (response) {
        // alert(response.message);
        isUpdating = false;
        $("#btn_save_branch").text("Add");
        // getCheckDetails(); // Refresh check list
        window.location.href = "/check-printing/"; 

      },
    //   error: function (xhr) {
    //     alert(`Error: ${xhr.responseJSON?.detail || "An error occurred"}`);
    //   },
    });
  }
}

$(document).ready(function () {
  getCheckDetails(); // Initial fetch of check details
  $("#btn_save_check_printing").click(saveOrUpdateCheck); // Handle save button click
});


// Helper function to convert numbers to words
function numberToWords(num) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion"];

    if (num === 0) return "Zero";
    if (num < 0) return "Minus " + numberToWords(-num);

    let word = "";
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            word = convertHundred(num % 1000) + thousands[i] + " " + word;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return word.trim();

    function convertHundred(n) {
        let result = "";
        if (n > 99) {
            result += ones[Math.floor(n / 100)] + " Hundred ";
            n = n % 100;
        }
        if (n > 10 && n < 20) {
            result += teens[n - 11] + " ";
        } else {
            result += tens[Math.floor(n / 10)] + " ";
            result += ones[n % 10] + " ";
        }
        return result;
    }
}

// jQuery function to convert amount to words with Pesos and Centavos
$(document).ready(function () {
    $('#amount').on('input', function () {
        let amount = $(this).val();
        console.log("Amount entered:", amount); // Debugging log

        if (amount) {
            // Check if the amount has a valid number format
            if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
                console.error("Invalid amount format");
                $('#amount_in_words').val("Invalid format");
                return;
            }
            
            // Split the amount into pesos and centavos parts
            let [pesos, centavos] = amount.split('.');
            console.log("Pesos:", pesos, "Centavos:", centavos); // Debugging log
            
            // Convert pesos part to words
            let pesosWords = numberToWords(parseInt(pesos));
            console.log("Converted Pesos to words:", pesosWords); // Debugging log

            // Format centavos part with "Only" at the end
            let centavosPart = centavos ? ` and ${centavos.padEnd(2, '0')}/100` : '';
            
            // Set the converted text to amount_in_words field with "Only" at the end
            $('#amount_in_words').val(`${pesosWords} Pesos${centavosPart} Only`);
            console.log("Amount in words:", $('#amount_in_words').val()); // Debugging log
        } else {
            $('#amount_in_words').val('');
        }
    });
});


// Function to format number with thousand separator
function formatNumberWithSeparator(value) {
    return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const initializeDataTable2 = () => {
    new DataTable('#table_check_printer', {
        perPage: 10,
        searchable: true,
        sortable: true,
    });
}


$(document).ready(function () {
  // getCheckDetails(); // Initial fetch of check details
  // $("#btn_save_check_printing").click(saveOrUpdateCheck); // Handle save button click
  $("#btn_print_check").click(printCheckDetails); // Call print function on button click
});

function printCheckDetails() {
  if (!selectedCheck) {
      alert("Please select a check to print.");
      return;
  }

  // Check if amount is a valid number
  if (isNaN(selectedCheck.amount) || selectedCheck.amount === '') {
      return; // Optionally, you can show an alert here
  }

  // Create a new window for printing
  const printWindow = window.open('', '', 'height=200,width=600');

 // Write the content to the print window
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 4px;font-size: 13px; }'); // Set body styles
  printWindow.document.write('.date { position: absolute; \
                                top: 0px; right: 65px; \
                                display: flex; align-items: center; }');
  printWindow.document.write('.date-digit { margin: 2px; display: inline-block; }'); // Styles for date digits

  printWindow.document.write('</style>');

  console.log(formatDate(selectedCheck.trans_date)); // Log the formatted date

  // Print only the essential details
  printWindow.document.write(`<div class="date"><span>${formatDate(selectedCheck.trans_date)}</span></div>`); // Date on right
  
 
  // Close the document to apply styles and content
  printWindow.document.close();
  printWindow.focus();

  // Open the print dialog
  printWindow.print();
}



function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());

  
  // Wrap each digit in a span for custom styling
   const formattedMonth = month.split('').map(digit => `<span class="date-digit">${digit}</span>`).join(' ');
   const formattedDay = day.split('').map(digit => `<span class="date-digit">${digit}</span>`).join(' ');
   const formattedYear = year.split('').map(digit => `<span class="date-digit">${digit}</span>`).join(' ');

   // Return formatted date with spans for styling
  //  return `${formattedMonth}   ${formattedDay}   ${formattedYear}`;
  return `${formattedMonth} &nbsp;&nbsp;&nbsp;&nbsp; ${formattedDay} &nbsp;&nbsp;&nbsp;&nbsp; ${formattedYear}`;


}
