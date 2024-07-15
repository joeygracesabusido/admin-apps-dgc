
// this function is for inserting employee
$(document).ready(function() {
    $('#btn_save_employee').on('click', function(event) {
        event.preventDefault();

        // Gather form data
        const employeeData = {
            employee_id: $('#employee_id').val(),
            employee_name: $('#employee_name').val(),
            division: $('#division').val(),
            position: $('#position').val(),
            nationality: $('#nationality').val(),
            sponsor: $('#sponsor').val(),
            contract_start_date: $('#contract_start_date').val(),
            birth_date: $('#birth_date').val(),
            contract_expire_date: $('#contract_expire_date').val(),
            employee_grade: $('#employee_grade').val(),
            job_family: $('#job_family').val(),
            cost_center: $('#cost_center').val(),
            description: $('#description').val(),
            join_date: $('#join_date').val(),
            status: $('#is_active').val() === 'true'
        };

        // GraphQL mutation
        const query = `
        mutation {
            insertEmployee(employeeDetails: {
               
                employeeId: "${employeeData.employee_id}", 
                employeeName: "${employeeData.employee_name}", 
                division: "${employeeData.division}", 
                position: "${employeeData.position}",
                nationality: "${employeeData.nationality}",
                sponsor: "${employeeData.sponsor}",
                contractStartDate: "${employeeData.contract_start_date}", 
                birthDate: "${employeeData.birth_date}",
                contractExpireDate: "${employeeData.contract_expire_date}",
                employeeGrade: "${employeeData.employee_grade}",
                jobFamily: "${employeeData.job_family}",
                costCenter: "${employeeData.cost_center}", 
                description: "${employeeData.description}", 
                joinDate: "${employeeData.join_date}",
                status: ${employeeData.status}
                
        
            })
        }`;

        // AJAX request
        $.ajax({
            url: '/graphql',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query: query }),
            success: function(response) {
                if (response.data && response.data.insertEmployee) {
                    if (typeof response.data.insertEmployee === 'string') {
                        window.alert(response.data.insertEmployee);
                        window.location.assign("/employee-list/");
                    } else {
                        window.alert("Employee inserted successfully!");
                        window.location.assign("/employee-list/");
                    }
                } else if (response.errors) {
                    const errorMessage = response.errors[0].message;
                    if (errorMessage.includes("already exists")) {
                        window.alert("Employee with this ID or name already exists");
                    } else {
                        window.alert(`Error: ${errorMessage}`);
                    }
                }
            },
            error: function(xhr, status, error) {
                window.alert("Error: " + error);
            }
        });
    });
});


// this function is to display data into the table

$(document).ready(function() {
    // Function to fetch and display employee data
    function displayEmployeeData() {
        // GraphQL query to fetch all employees
        const query = `
        query {
            getAllEmployees {
                Id
                employeeId
                employeeName
                division
                position
                status
            }
        }`;

        // AJAX request
        $.ajax({
            url: '/graphql',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query: query }),
            success: function(response) {

                
                if (response.data && response.data.getAllEmployees) {
                    const employees = response.data.getAllEmployees;

                    // Clear existing table rows
                    $('#table_employee_list tbody').empty();

                    // Populate table with employee data
                    employees.forEach(function(employee) {
                        const row = `
                        <tr>
                            <td>${employee.employeeId}</td>
                            <td>${employee.employeeName}</td>
                            <td>${employee.division}</td>
                            <td>${employee.position}</td>
                            <td>${employee.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <a href="/api-update-employee-list/{${employee.Id}}"
                                <button type="button" class="btn btn-primary">
                                <i class="fas fa-database"></i>Edit</button></a>
                            </td>
                        </tr>`;
                        $('#table_employee_list tbody').append(row);
                        
                    });
                    initializeDataTable();
                    
                } else if (response.errors) {
                    const errorMessage = response.errors[0].message;
                    window.alert(`Error: ${errorMessage}`);
                }
            },
            error: function(xhr, status, error) {
                window.alert("Error: " + error);
            }
        });
    }

    const initializeDataTable = () => {
        // $('#table_employee_list').DataTable();
        $('#table_employee_list').DataTable();
    };

    // Call the function to initially display employee data
    displayEmployeeData();
    
});






