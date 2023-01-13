USE company;
INSERT INTO departments (name)
VALUES
 ("Sales"),
 ("Engineering"),
 ("Finance"),
 ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Sales Lead", 110000, 1), 
("Salesperson", 60000, 1), 
("Lead Engineer", 110000, 2), 
("Software Engineer", 170000, 2), 
("Accountant", 105000, 3), 
("Legal Team Lead", 220000, 4), 
("Lawyer", 130000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES 
("Trong", "Le", 1), 
("Emily", "Nguyen", 2), 
("David", "Trinh", 3),
("Trinh", "Pham", 4), 
("Brittney", "Le", 5), 
("Bryan", "Le", 6), 
("Lana", "Nguyen", 7), 
("Julie", "Nguyen", 5), 
("Tina", "Truong", 4);