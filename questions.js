//This is the list of our static questions that we will use to gather data.
//Other question definitions will be created in the various functions because
//they are data driven by the data in the DB. 

const startQuestion = 
    {
        type: "list",
        name: "function_list",
        message: "Please Select the function you would like to perform?",
        choices: ["View Employees", "Add Employee", "View Department", "Add Department", "View Employee Roles", "Add Employee Role", "Update Employee Role", "Quit Program"]
    }

const addDepartQuestion = 
    {
        type: "input",
        name: "department_name",
        message: "Please input the new department name"
    }

const addRoleQuestion = [
    {
        type: "input",
        name: "role_title",
        message: "Please Enter the role name"
    },
    {
        type: "input",
        name: "role_salary",
        message: "Please Entuer the role salary (per year only, max 2 decimals)"
    }
]

const addEmployeeQuestion = [
    {
        type: "input",
        name: "first_name",
        message: "Please enter the first name of the new employee"
    },
    {
        type: "input",
        name: "last_name",
        message: "Please enter the last name of the new employee"
    }
]

//export all of the constants for the server file to use
module.exports = {
    startQuestion: startQuestion,
    addRoleQuestion: addRoleQuestion,
    addEmployeeQuestion: addEmployeeQuestion,
    addDepartQuestion: addDepartQuestion
}