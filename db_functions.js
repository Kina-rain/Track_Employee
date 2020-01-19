module.exports.add_department = function (departmentName, connection) {

    let deptSQL = `INSERT INTO Department(department_name) VALUES ("${departmentName}")`;

    connection.query(deptSQL, function (err, res) {
        if (err) throw err;
        return res;
    });
}

module.exports.get_role_department_id = function (roleTitle, connection, callback) {

    let roleAndDepartSQL = `
    SELECT r.id as roleID, r.department_id as departmentID
    FROM employee_role r
    WHERE r.title = "${roleTitle}"
    `
    //create an array to hold the results from the above query
    let dataResults = [];

    //excute query and return results
    connection.query(roleAndDepartSQL, function(err, res) {
        if (err) callback(err, null);

        dataResults.push(res[0].roleID, res[0].departmentID);

        callback(null, dataResults);
    });
}

module.exports.update_employee_role = function(roleTitle, roleSalary, roleID, currentDepartmentID, newDepartment, connection) {
    
    // This function will update an employee role based on the parameters above.

    let newDepartSQL = `
    SELECT id from department where department_name = "${newDepartment}";
    `
    connection.query(newDepartSQL, function(err, departmentID) {

        if (err) throw err;
        
        let newDepartmentID = departmentID[0].id;

        let updateRoleSQL = `
        UPDATE employee_role
        SET title = "${roleTitle}",
            salary = ${roleSalary},
            department_id = ${newDepartmentID}
        WHERE employee_role.id = ${roleID} and employee_role.department_id = ${currentDepartmentID}
        `

        connection.query(updateRoleSQL, function(err, res) {
            if (err) throw err;

            return res;
        });
    });
}


module.exports.get_managers = function(connection, callback) {

    // get a list of managers, also used in add employee.

    let managerSQL = `
    SELECT DISTINCT CONCAT(mgr.first_name, " ", mgr.last_name) as manager
    FROM employee e
    JOIN employee mgr ON mgr.id = e.manager_id
    `
    connection.query(managerSQL, function(err, res) {
        
        if (err) callback(err, null);

        let managers = [];

        for (i in res) {
            managers.push(res[i].manager);
        }

        //this will let the user add a new manager
        managers.push("Add as manager");

        callback(null, managers);
    });
}


module.exports.add_employee = function(fName, lName, role, manager, connection) {

    // function to add an employee

    let roleReqSQL = `SELECT id FROM employee_role WHERE title = "${role}"`;

    connection.query(roleReqSQL, function(err, roles) {
        if (err) throw err;

        let roleID = roles[0].id;

        // this part of the function determines if the employee is being added as a manager.
        if (manager === "Add as manager") {
            let employeeAddSQL = `
            INSERT INTO employee (first_name, last_name, role_id)
            VALUES ("${fName}", "${lName}", ${roleID})
            `
            connection.query(employeeAddSQL, function(err, res) {
                if (err) throw err;

                return res;
            });
        } else {
            // gets the manager ID and links it to the manager/ employee.
            let managerGetSQL = `Select id from employee where CONCAT(first_name, " ", last_name) = "${manager}"`;

            connection.query(managerGetSQL, function(err, manager) {
                if (err) throw err;

                let managerID = manager[0].id;

                let employeeAddSQL = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${fName}", "${lName}", ${roleID}, ${managerID})
                `
                connection.query(employeeAddSQL, function(err, res) {
                    if (err) throw err;

                    return res;
                });
            });
        }
    });
}

module.exports.add_role = function(title, salary, department, connection) {
   
    connection.query("SELECT id, department_name FROM department", function(err, departments) {

        if (err) throw err;

        //go through the departments to find the right ID
        for (let i in departments) {
            if (departments[i].department_name === department) {
                let roleInsert = `
                INSERT INTO employee_role (title, salary, department_id)
                VALUES ("${title}", ${salary}, ${departments[i].id})
                `

                connection.query(roleInsert, function(err, res) {
                    if (err) throw err;

                    //return the response so the function will end
                    return res;
                });
            }
        }
    });
}

module.exports.view_departments = function(connection, display, callback) {

    //set our SQL to get the departments data
    let deptSQL = `SELECT id, department_name FROM department;`;

    //create our array for the results
    let dataResults = [];

    //execute the sql to return the departments
    connection.query(deptSQL, function(err, res) {
        if (err) callback(err, null);

        if(display) {
            //go through the rows and push them into the array for console.table to render
            for (let i in res) {
                dataResults.push({departmentID: res[i].id.toString(), department_name: res[i].department_name});
            }
        } else {
            for (let i in res) {
                dataResults.push(res[i].department_name);
            }
        }

            //send the data back
            callback(null, dataResults);
    });
}

module.exports.view_employees = function(connection, callback) {

    // This is creating an object for console.table to display.

    let employeeSQL = `
    SELECT e.first_name, e.last_name, er.title, er.salary, ifnull(concat(mgr.first_name," ", mgr.last_name), "") as manager, department_name
    FROM employee e
    JOIN employee_role er on e.role_id = er.id
    JOIN department d on er.department_id = d.id
    LEFT JOIN employee mgr on mgr.id = e.manager_id
    `

    let employees = [];

    connection.query(employeeSQL, function(err, res) {
        if (err) callback(err, null);

        for (let i in res) {
          employees.push({Name: res[i].first_name + " " + res[i].last_name, Title: res[i].title, Salary: res[i].salary, Manager: res[i].manager, Department: res[i].department_name});
        }

            callback(null, employees);
        });
        }
    
module.exports.view_employeeRoles = function(connection, display, callback) {

    // creates a table of employee roles and formats a display through console.table

    let roleSQL = `
        SELECT title, salary, department_name
        FROM employee_role er
        JOIN department d on er.department_id = d.id
    `

    let employeeRoles = [];

    connection.query(roleSQL, function(err, res) {
        if (err) callback(err, null);

        if (display) {
            for (let i in res) {
                employeeRoles.push({Role_Title: res[i].title, Salary: res[i].salary, Department: res[i].department_name});
            }
        } else {
            for (let i in res) {
                employeeRoles.push(res[i].title);
            }
        }

        callback(null, employeeRoles);
    });

}
