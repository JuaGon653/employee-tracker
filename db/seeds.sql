INSERT INTO department (name)
VALUES ('Online Shopping'),
       ('Sales Floor'),
       ('Stocking');

INSERT INTO role (title, salary, department_id)
VALUES ('OSD Team Lead', 100000, 1),
       ('Dispenser', 80000, 1),
       ('Sales Lead', 150000, 2),
       ('Cashier', 120000, 2),
       ('Stock Manager', 160000, 3),
       ('Team Member', 125000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Brittany', 'Ortega', 1, null),
       ('Andru', 'Grad', 2, 1),
       ('Lexxi', 'Mendez', 3, null),
       ('Clyde', 'Rodriguez', 4, 3),
       ('Jesus', 'Villarreal', 5, null),
       ('Diego', 'Ochoa', 6, 5);