const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { toNamespacedPath } = require('path');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'wheresthechapstick',
        database: 'some_store_db'
    },
    console.log('Connected to the some_store_db database.')
);
whatAreWeDoing();


function whatAreWeDoing() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'whatimdoing',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role',
                      'View All Roles', 'Add Role', 'View All Departments', 'Add Department',
                      'Quit']
        }
    ])
    .then(response => {
        switch (response.whatimdoing) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
        }
    })
    .catch(error => console.log(error));
}

function addEmployee() {
    let roles = [];
    db.query(`SELECT title FROM role`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            roles.push(results[i].title);
        }
    })

    let employees = [];
    db.query(`SELECT concat(first_name, ' ', last_name) AS manager FROM employee`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            employees.push(results[i].manager);
        }
    })

    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the employee\'s first name?',
                name: 'fName'
            },
            {
                type: 'input',
                message: 'What is the employee\'s last name?',
                name: 'lName'
            },
            {
                type: 'list',
                message: 'What is the employee\'s role?',
                name: 'role',
                choices: roles
            },
            {
                type: 'list',
                message: 'Who is the employee\'s manager?',
                name: 'manager',
                choices: employees
            }
        ])
        .then(res => {
            db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${res.fName}', '${res.lName}', ${roles.indexOf(res.role)+1}, ${employees.indexOf(res.manager)+1});`)
                .then(() => {
                    whatAreWeDoing();
                })
        })
}

function addRole() {
    let names = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            names.push(results[i].name);
        }
    })
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'role'
            },
            {
                type: 'number',
                message: 'What is the salary of the role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'department',
                choices: names
            }
        ])
        .then(res => {
            let index = names.indexOf(res.department) + 1;
            db.promise().query(`INSERT INTO role (title, salary, department_id)
            VALUES ('${res.role}', ${res.salary}, ${index})`)
                .then(() => {
                    whatAreWeDoing();
                })
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'department'
            }
        ])
        .then(res => 
            db.promise().query(`INSERT INTO department (name)
            VALUES ('${res.department}')`)
                .then(() => {
                    whatAreWeDoing();
                })
        )
}

function viewAllDepartments() {
    db.query(`SELECT * FROM department`, function (err, results) {
        console.table(results);
        whatAreWeDoing();
    })
}

function viewAllRoles() {
    db.query(`SELECT role.id, title, name AS department, salary FROM role 
    JOIN department ON role.department_id = department.id ORDER BY id`, function(err, results) {
        console.table(results);
        whatAreWeDoing();
    })
}

function viewAllEmployees() {
    db.query(`SELECT A.id, A.first_name, A.last_name, title, name AS department, salary, IF(A.manager_id IS NULL, 'null', concat(B.first_name, ' ', B.last_name)) AS manager from employee A 
    join employee B  
    on A.manager_id = B.id
    or A.manager_id IS NULL
    JOIN role ON A.role_id = role.id 
    JOIN department ON role.department_id = department.id
    group by id
    order by id`, function (err, results) {
        console.table(results);
        whatAreWeDoing();
    })
}
