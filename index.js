const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// connecting to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'wheresthechapstick',
        database: 'some_store_db'
    },
    console.log('Connected to some_store_db database.')
);
// starts off running the 'whatAreWeDoing' function
whatAreWeDoing();

// prompts the user for the next thing to do
function whatAreWeDoing() {
    // gives list of options
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
        // calls necessary functions based off answer
        switch (response.whatimdoing) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmpRole();
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
            default:
                
                console.log('Bye Bye!');
                // if 'Quit' is pressed it will instruct Node.js to terminate the process
                process.exit();
        }
    })
    .catch(error => console.log(error));
}

// working update employee role function
// unworking update employee function is at the bottom that for some reason wasn't working with 
// the format I was using for all the other functions
function updateEmpRole() {
    let employees = [];
    db.query(`SELECT concat(first_name, ' ', last_name) AS name FROM employee`, function (err, results) {
        // pushes names of employees to the 'employees' array
        for(let name of results){
            employees.push(name.name);
        }
        inquirer
            .prompt([
                // prompts for what employee to update using the values in 'employees' array
                {
                    type: 'list',
                    message: 'Which employee\'s role do you want to update?',
                    name: 'name',
                    choices: employees
                }
            ])
            .then(firstRes => { // firstRes holds the employee answer
                let roles = [];
                db.query(`SELECT title FROM role`, function (err, results) {
                    // pushes already made roles into 'roles' array
                    for(let role of results) {
                        roles.push(role.title);
                    }
                    inquirer
                    .prompt([
                        // prompts for what new role to assign to the chosen employee
                        {
                            type: 'list',
                            message: 'What role do you want to assign to the selected employee?',
                            name: 'role',
                            choices: roles
                        }
                    ])
                    .then(res => { // res contains the chosen role
                        db.promise().query(`UPDATE employee SET role_id = ${roles.indexOf(res.role)+1} WHERE id=${employees.indexOf(firstRes.name)+1}`)
                        .then(() => whatAreWeDoing())
                    })
                })
            })
    })

    

    
}

// ADDING FUNCTIONS

// adds employee to 'employee' table in database using the user's answers
function addEmployee() {
    // grabs the role title from the database and adds them to the 'roles' array
    let roles = [];
    db.query(`SELECT title FROM role`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            roles.push(results[i].title);
        }
    })

    // grabs the manager name from the database and adds them to the 'employee' array
    let employees = ['None'];
    db.query(`SELECT concat(first_name, ' ', last_name) AS manager FROM employee`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            employees.push(results[i].manager);
        }
    })

    // prompting user for employee info
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
            // adds employee to 'employee' table in the database using the user's prompt values
            db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${res.fName}', '${res.lName}', ${roles.indexOf(res.role)+1}, ${(res.manager == 'None') ? null : employees.indexOf(res.manager)})`)
                .then(() => {
                    // whatAreWeDoing is always called at the end of a function
                    whatAreWeDoing();
                })
        })
}

// adds role to 'role' table in database using the user's answers
function addRole() {
    // grabs role name from database and pushes it into 'names' array
    let names = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            names.push(results[i].name);
        }
    })

    // prompts user for role info
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
            let index = names.indexOf(res.department) + 1; // index number the department would be in, in the database table
            // adds role to 'role' table using the user's prompt values
            db.promise().query(`INSERT INTO role (title, salary, department_id)
            VALUES ('${res.role}', ${res.salary}, ${index})`)
                .then(() => {
                    whatAreWeDoing();
                })
        })
}

// adds department to 'department' table in database using the user's answers
function addDepartment() {
    // prompts user for the department's name
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'department'
            }
        ])
        .then(res => 
            // adds department to 'department' table using the user's prompt values
            db.promise().query(`INSERT INTO department (name)
            VALUES ('${res.department}')`)
                .then(() => {
                    whatAreWeDoing();
                })
        )
}

// VIEWING FUNCTIONS

// displays the Department table
function viewAllDepartments() {
    // grabs all the department's table info 
    db.query(`SELECT * FROM department`, function (err, results) {
        console.table(results);
        whatAreWeDoing();
    })
}

// displays the Role table
function viewAllRoles() {
    // grabs the roles table info, also joining the table with the department table
    db.query(`SELECT role.id, title, name AS department, salary FROM role 
    JOIN department ON role.department_id = department.id ORDER BY id`, function(err, results) {
        console.table(results);
        whatAreWeDoing();
    })
}

// displays the Employee table
function viewAllEmployees() {
    // grabs the employees table info, joining it with both the role and department tables
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


// unworking update employee role function
// same format as the other functions but for some reason doesn't work
function updateRole() {
    let emps = [];
    db.query(`SELECT concat(first_name, ' ', last_name) AS name FROM employee`, function (err, results) {
        for(let i = 0; i < results.length; i++){
            emps.push(results[i].name);
        };
    });
    let roles = [];
    db.query(`SELECT title FROM role`, async function (err, results) {
        for(let i = 0; i < results.length; i++) {
            roles.push(results[i].title);
        };
    });

    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee's role do you want to update?",
            name: 'emp',
            choices: emps
        },
        {
            type: 'list',
            message: "What role do you want to assign to the selected employee?",
            name: 'role',
            choices: roles
        }
    ])
    .then(res => {
        console.log(`UPDATE employee SET role_id = ${roles.indexOf(res.role)+1} WHERE id=${employees.indexOf(firstRes.name)+1}`)
        db.promise().query(`UPDATE employee SET role_id = ${roles.indexOf(res.role)+1} WHERE id=${emps.indexOf(res.emp)+1}`)
        .then(() => whatAreWeDoing())
    })
}