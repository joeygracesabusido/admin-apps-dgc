$(document).ready(function() {
    const table = $('#management_transactions_table').DataTable({
        columns: [
            { data: 'transactionDate' },
            { data: 'company' },
            { data: 'department' },
            { data: 'itemName' },
            { data: 'quantity' },
            { data: 'price' },
            {
                data: 'amount',
                render: function(data, type, row) {
                    return (row.quantity * row.price).toFixed(2);
                }
            }
        ],
        footerCallback: function (row, data, start, end, display) {
            let totalAmount = 0;
            for (let i = 0; i < data.length; i++) {
                totalAmount += data[i].quantity * data[i].price;
            }

            $('#total_amount').text(totalAmount.toFixed(2));
        }

    });

    function fetchData() {
        const company = $('#company_filter').val();
        const dateFrom = $('#date_from').val();
        const dateTo = $('#date_to').val();
        const transactionType = $('#transaction_type_filter').val();

        const query = `
            query GetManagementTransactions($company: String, $dateFrom: String, $dateTo: String, $transactionType: String) {
                getManagementTransactions(company: $company, dateFrom: $dateFrom, dateTo: $dateTo, transactionType: $transactionType) {
                    transactionDate
                    company
                    department
                    itemName
                    quantity
                    price
                }
            }
        `;

        fetch('/mygraphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { company, dateFrom, dateTo, transactionType }
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.errors) {
                console.error('GraphQL Error:', result.errors);
                alert('Error fetching data: ' + result.errors.map(e => e.message).join('\n'));
            } else {
                table.clear().rows.add(result.data.getManagementTransactions).draw();
            }
        })
        .catch(error => {
            console.error('Network or other error:', error);
            alert('An error occurred while fetching data.');
        });
    }

    $('#company_filter, #date_from, #date_to, #transaction_type_filter').on('change', fetchData);

    fetchData(); // Initial fetch
});
