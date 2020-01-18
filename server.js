const mysql = require("mysql");
const dbFunc = require("./db_functions");
const inquirer = require("inquirer");
const questions = require("./questions")

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
                add_department()
            }
            if (response.function_list == "Quit Program") {
                console.log("Thank you for using Employee Tracker, have a nice day!");
                return db_connection.end();
            }
        });
}

function add_department() {
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

function print_welcome() {
    console.log(`
***********************************************
╔═╗┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ╔╦╗┬─┐┌─┐┌─┐┬┌─┌─┐┬─┐
║╣ │││├─┘│  │ │└┬┘├┤ ├┤    ║ ├┬┘├─┤│  ├┴┐├┤ ├┬┘
╚═╝┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘   ╩ ┴└─┴ ┴└─┘┴ ┴└─┘┴└─
***********************************************
    `);
}