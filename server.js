const mysql = require("mysql");
const dbFunc = require("./db_functions");
const inquirer = require("inquirer");
const questions = require("./questions");
const table = require("console.table");

const db_connection = mysql.createConnection({ 
    host: "localhost",
    port: process.env.port || 3306,
    user: "root",
    password: "root",
    database: "employee_db"
});

db_connection.connect(function (err) {
    if (err) {
        console.log ("DB Not Conneted");
        throw err;
    }
    //print our welcome message
    print_welcome();

    //fire up the employee tracker
    start_program();
});

function start_program() {
    //questionaire

    inquirer.prompt(questions.startQuestion)
        .then((response) => {
            //go through the response and call the various functions to view or update data
            if (response.function_list == "Add Department") {
                add_department();
            }
            if (response.function_list == "View Department") {
                view_departments();
            }
            if (response.function_list == "View Employees") {
                view_employees();
            }
            if (response.function_list == "View Employee Roles") {
                view_employeeRoles();
            }
            if (response.function_list == "Add Employee Role") {
                add_role();
            }
            if (response.function_list == "Add Employee") {
                add_employee();
            }
            if (response.function_list == "Update Employee Role") {
                update_employee_role();
            }
            if (response.function_list == "Quit Program") {
                console.log("");
                console.log("******************************************************");
                console.log("Thank you for using Employee Tracker, have a nice day!");
                console.log("******************************************************");
                console.log("");
                return db_connection.end();
            }
        });
}

function update_employee_role() {

    //get the roles for the user to pick which one to modify
    dbFunc.view_employeeRoles(db_connection, false, function(err, roles) {
        if (err) throw err;

        let roleIDQuestion = {
            type: "list",
            name: "roleList",
            message: "Choose the role you want to change:",
            choices: roles
        }
        inquirer.prompt(roleIDQuestion)
            .then((response) => {

                let roleName = response.roleList;

                dbFunc.view_departments(db_connection, false, function(err, departments) {
                    if (err) throw err;

                    let deptQuestions = {
                        type: "list",
                        name: "departmentList",
                        message: "Choose the department you want to move the role to:",
                        choices: departments
                    }

                    inquirer.prompt(deptQuestions)
                    .then((response) => {

                        //store the new department name
                        let newDepartment = response.departmentList;

                        //this will get the role and department ids for the role they are changing
                        dbFunc.get_role_department_id(roleName, db_connection, function(err, roleData) {

                            if (err) throw err;

                            let existingRoleID = roleData[0];
                            let existingDepartID = roleData[1];

                            inquirer.prompt(questions.addRoleQuestion)
                             .then((response) => {

                                let role_title = response.role_title;
                                let role_salary = response.role_salary;

                                dbFunc.update_employee_role(role_title, role_salary, existingRoleID, existingDepartID, newDepartment, db_connection);

                                console.log("");
                                console.log("");
                                console.log("******************************************************");
                                console.log("Employee Role was updated");
                                console.log("******************************************************");
                                console.log("");

                                //go back to the start
                                start_program();
                             });
                        });
                    });
                });
            });
    });
}

function add_employee() {
    //prompt with employee questions
    inquirer.prompt(questions.addEmployeeQuestion)
        .then((response) => {
            
            let fName = response.first_name;
            let lName = response.last_name;

            //get the employee roles
            dbFunc.view_employeeRoles(db_connection, false, function(err, roles) {
                if (err) throw err;

                let roleIDQuestion = {
                    type: "list",
                    name: "roleList",
                    message: "Choose the role you want to assign the new employee to:",
                    choices: roles
                }
                inquirer.prompt(roleIDQuestion)
                    .then((response) => {

                        let roleName = response.roleList;

                        dbFunc.get_managers(db_connection, function(err, managers) {
                            if (err) throw err;

                            let managerIDQuestion = {
                                type: "list",
                                name: "managerList",
                                message: "Choose the role you want to assign the new employee to:",
                                choices: managers
                            }
                            inquirer.prompt(managerIDQuestion)
                                .then((response) => {

                                dbFunc.add_employee(fName, lName, roleName, response.managerList, db_connection);

                                //tell the user that the roll was added.
                                console.log("");
                                console.log("");
                                console.log("******************************************************");
                                console.log("Employe " + fName + " " + lName + " was added");
                                console.log("******************************************************");

                                //go back to the beginning
                                start_program();
                                });
                        });
                    });
            });
        });
}

function add_department() {
    //prompt with the department questions
    inquirer.prompt(questions.addDepartQuestion)
        .then((response) => {
            dbFunc.add_department(response.department_name, db_connection);
            
            //notify the user that the department was added
            console.log("********************************************");
            console.log("Department " + response.department_name + " was added");
            console.log("********************************************");

            //go back to the beginning
            start_program();
        })
    
}

function add_role() {
    //prompt with basic role questions
    inquirer.prompt(questions.addRoleQuestion)
    .then((response) => {

        let role_title = response.role_title;
        let role_salary = response.role_salary;

        //get departments
        dbFunc.view_departments(db_connection, false, function (err, departments) {
            if (err) throw err

            let deptQuestions = {
                type: "list",
                name: "departmentList",
                message: "Choose the department you want to add the role to:",
                choices: departments
            }

            inquirer.prompt(deptQuestions)
                .then((response) => {
                    dbFunc.add_role(role_title, role_salary, response.departmentList, db_connection);

                    //tell the user that the role was added
                    console.log("");
                    console.log("");
                    console.log("********************************************");
                    console.log("Employee Role was added");
                    console.log("********************************************");

                    //go back to the beginning
                    start_program();
                });
        });
    });
}

function view_employeeRoles() {
    dbFunc.view_employeeRoles(db_connection, true, function(err, roles) {
        if (err) throw err;

        console.log("");
        console.log("");
        console.log("********************************************");
        console.table(roles);
        console.log("********************************************");

         //go back to the beginning
         start_program();
    });
}

function view_employees() {
    dbFunc.view_employees(db_connection, function(err, employees) {
        if(err) throw err;

        console.log("");
        console.log("");
        console.log("********************************************");
        console.table(employees);
        console.log("********************************************");

         //go back to the beginning
         start_program();
    });
}

function view_departments() {

    dbFunc.view_departments(db_connection, true, function(err, departments) {
        if (err) throw err;

        console.log("");
        console.log("");
        console.log("********************************************");
        console.table(departments);
        console.log("********************************************");

        //go back to the beginning
        start_program();
    });
}

function print_welcome() {
    console.log(`
***********************************************
╔═╗┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ╔╦╗┬─┐┌─┐┌─┐┬┌─┌─┐┬─┐
║╣ │││├─┘│  │ │└┬┘├┤ ├┤    ║ ├┬┘├─┤│  ├┴┐├┤ ├┬┘
╚═╝┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘   ╩ ┴└─┴ ┴└─┘┴ ┴└─┘┴└─
***********************************************
    `);
}