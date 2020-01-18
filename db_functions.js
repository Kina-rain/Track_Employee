module.exports.add_department = function (departmentName, connection) {

    let deptSQL = `INSERT INTO Department(department_name) VALUES ("${departmentName}")`;

    connection.query(deptSQL, function (err, res) {
        if (err) throw err;
        return res;
    })
}

module.exports.add_role = function(userResponse) {
    console.log(userResponse);
}
