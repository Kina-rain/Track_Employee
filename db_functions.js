module.exports.add_department = function (departmentName, connection) {

    let deptSQL = `INSERT INTO Department(department_name) VALUES ("${departmentName}")`;

    connection.query(deptSQL, function (err, res) {
        if (err) throw err;
        return res;
    })
}

module.exports.get_managers = function(connection, callback) {
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

    let roleReqSQL = `SELECT id FROM employee_role WHERE title = "${role}"`;

    connection.query(roleReqSQL, function(err, roles) {
        if (err) throw err;

        let roleID = roles[0].id;

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

    let employeeSQL = `
    SELECT e.first_name, e.last_name, er.title, er.salary, ifnull(concat(mgr.first_name,"", mgr.last_name), "") as manager, department_name
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
