-- VIEW ALL EMPLOYEES --

-- SELECT A.id, A.first_name, A.last_name, title, name AS department, salary, IF(A.manager_id IS NULL, 'null', concat(B.first_name, ' ', B.last_name)) AS manager from employee A 
-- join employee B  
-- on A.manager_id = B.id
-- or A.manager_id IS NULL
-- JOIN role ON A.role_id = role.id 
-- JOIN department ON role.department_id = department.id
-- group by id
-- order by id;


-- VIEW ALL ROLES --

-- SELECT role.id, title, name AS department, salary FROM role 
-- JOIN department ON role.department_id = department.id ;


-- VIEW ALL DEPARTMENTS --

-- SELECT * FROM department;


-- ADD DEPARTMENT --

-- INSERT INTO department (name)
-- VALUES ('Counselour');


-- ADD ROLE --

-- INSERT INTO role (title, salary, department_id)
-- VALUES ('Customer Service', 80000, 3);


-- ADD EMPLOYEE --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Juan', 'Gonzales', 2, 1);
