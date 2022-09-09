const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'wheresthechapstick',
        database: 'some_store_db'
    },
    console.log('Connected to the some_store_db database.')
);

app.get('/api/view-employees', (req, res) => {
    db.query(`SELECT A.id, A.first_name, A.last_name, title, name AS department, salary, IF(A.manager_id IS NULL, 'null', concat(B.first_name, ' ', B.last_name)) AS manager from employee A 
    join employee B  
    on A.manager_id = B.id
    or A.manager_id IS NULL
    JOIN role ON A.role_id = role.id 
    JOIN department ON role.department_id = department.id
    group by id
    order by id`, function (err, results) {
        res.json(results);
    })
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);