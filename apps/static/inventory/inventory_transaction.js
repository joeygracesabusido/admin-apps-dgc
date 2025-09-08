
$(document).ready(function () {
    var table_inventory_transaction = $('#table_inventory_transaction').DataTable({

        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/get_inventory_transaction",
            "type": "POST",
            "dataType": "json",
            "contentType": "application/json",
            "data": function (d) {
                return JSON.stringify(d);
            }
        },
        "columns": [

            { "data": "company" },
            { "data": "item" },
            { "data": "purchase_date" },
            { "data": "si_no" },
            { "data": "qty" },
            { "data": "brand" },
            { "data": "serial_no" },
            { "data": "date_release" },
            { "data": "user" },
            { "data": "department" },
            { "data": "amount" },
            { "data": "status" }

        ]
    });
});
