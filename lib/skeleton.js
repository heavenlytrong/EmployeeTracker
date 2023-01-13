const db = require("../db/connection");
const cTable = require('console.table');
const inquirer = require("inquirer");

// inquirer prompts
const startInquirer = () => {
    inquirer.prompt([
      {
        type: "list",
        name: "toDo",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update an employee's manager",
          "View employees by manager",
          "View employees by department",
          "Remove a department",
          "Remove a role",
          "Remove an employee",
          "Exit"
        ]
      }
    ])
    .then(answers => {
        const nextPrompt = answers.toDo;
        if (nextPrompt === "View all departments") {
          viewDepartments();
        };
    
        if (nextPrompt === "View all roles") {
          viewRoles();
        };
    
        if (nextPrompt === "View all employees") {
          viewEmployees();
        };
    
        if (nextPrompt === "Add a department") {
          addDepartment();
        };
    
        if (nextPrompt === "Add a role") {
          addRole();
        };
    
        if (nextPrompt === "Add an employee") {
          addEmployee();
        };
    
        if (nextPrompt === "Update an employee role") {
          updateEmployeeRole();
        };
    
        if (nextPrompt === "Update an employee's manager") {
          updateEmployeeManager();
        };
    
        if (nextPrompt === "View employees by manager") {
          viewByManager();
        };
    
        if (nextPrompt === "View employees by department") {
          viewByDepartment();
        };
    
        if (nextPrompt === "Remove a department") {
          removeDepartment();
        };
    
        if (nextPrompt === "Remove a role") {
          removeRole();
        };
    
        if (nextPrompt === "Remove an employee") {
          removeEmployee();
        };
    
        if (nextPrompt === "Exit") {
          process.exit();
        };
      })
    };