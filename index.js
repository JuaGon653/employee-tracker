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
            let index = names.indexOf(res.department);
            db.promise().query(``)
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
    JOIN department ON role.department_id = department.id`, function(err, results) {
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
