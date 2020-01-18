DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

create table department(
id INT not null auto_increment,
department_name VARCHAR(30) not null,
primary key (id)
);

create table employee_role(
id INT not null auto_increment,
title VARCHAR(30) not null,
salary decimal(8,2) not null,
department_id int not null,
primary key (id),
foreign key (department_id) references department(id)
);

create table employee(
id INT not null auto_increment,
first_name VARCHAR(30) not null,
last_name  VARCHAR(30) not null,
role_id INT not null,
manager_id INT,
primary key (id),
foreign key (role_id) references employee_role(id),
foreign key (manager_id) references employee(id)
);

insert into department (department_name) values("Marketing");
insert into department (department_name) values("Sales");

insert into employee_role (title, salary, department_id) values("Manager", 80000, 1);
insert into employee_role (title, salary, department_id) values("Specialist", 50000, 1);
insert into employee_role (title, salary, department_id) values("Sales Manager", 80000, 2);
insert into employee_role (title, salary, department_id) values("Sales Rep", 30000, 2);

insert into employee (first_name, last_name, role_id, manager_id) values("Jane", "Doe", 1, null);
insert into employee (first_name, last_name, role_id, manager_id) values("John", "Smith", 2, 1);
insert into employee (first_name, last_name, role_id, manager_id) values("Maggie", "Jones", 2, 1);
insert into employee (first_name, last_name, role_id, manager_id) values("Sam", "Stone", 3, null);
insert into employee (first_name, last_name, role_id, manager_id) values("Jill", "Rogers", 4, 4);