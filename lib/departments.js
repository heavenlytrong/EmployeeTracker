const db = require("../db/connection");
const cTable = require('console.table');
const inquirer = require("inquirer");

// inquirer prompts
const employeeTracker = () => {
    inquirer.prompt([
      {
        type: "list",
        name: "toDo",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all positions",
          "View all workers",
          "Add a department",
          "Add a position",
          "Add a worker",
          "Update an worker role",
          "Update an workers manager",
          "View workers by manager",
          "View workers by department",
          "Remove a department",
          "Remove a position",
          "remove an worker",
          "Quit"
        ]
      }
    ])
    .then(answers => {
        const nextChoice = answers.toDo;
        if (nextChoice === "View all departments") {
          viewDepartments();
        };
    
        if (nextChoice === "View all positions") {
          viewPositions();
        };
    
        if (nextChoice  === "View all workers") {
          viewWorker();
        };
    
        if (nextChoice  === "Add a department") {
          addDepartment();
        };
    
        if (nextChoice  === "Add a position") {
          addPosition();
        };
    
        if (nextChoice  === "Add an worker") {
          addWorker();
        };
    
        if (nextChoice  === "Update an workers role") {
          updateWorkerRole();
        };
    
        if (nextChoice  === "Update an workers manager") {
          updateWorkerManager();
        };
    
        if (nextChoice  === "View workers by manager") {
          viewByManager();
        };
    
        if (nextChoice  === "View workers by department") {
          viewByDepartment();
        };
    
        if (nextChoice  === "Remove a department") {
          removeDepartment();
        };
    
        if (nextChoice  === "Remove a position") {
          removePosition();
        };
    
        if (nextChoice  === "Remove a worker") {
          removeWorker();
        };
    
        if (nextChoice  === "Quit") {
          process.exit();
        };
      })
    };

    const viewDepartments = () => {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          console.log("\n");
          console.table(rows);
          return employeeTracker();
        });
      };
  
      const viewPositions = () => {
          const sql = `SELECT positions.id, 
                            positions.title, 
                            positions.salary, 
                              departments.name AS department
                        FROM positions
                        LEFT JOIN departments ON positions.department_id = departments.id`;
          db.query(sql, (err, rows) => {
            if (err) {
              throw err;
            }
            console.log("\n");
            console.table(rows);
            return  employeeTracker();
          });
        };
  
        const viewWorker = () => {
    const sql = `SELECT workers.id, 
                  workers.first_name, 
                  workers.last_name,
                        positions.title AS title,
                        positions.salary AS salary,
                        departments.name AS department,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                  FROM workers
                  LEFT JOIN positions ON workers.position_id = positions.id
                  LEFT JOIN departments ON roles.department_id = departments.id
                  LEFT JOIN workers manager ON workers.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.log("\n");
      console.table(rows);
      return employeeTracker();
    });
  };
  
  const addDepartment = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of this department?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a department name");
            return false;
          };
        }
      }
    ])
    .then(answer => {
      const sql = `INSERT INTO departments (name)
        VALUES (?)`;
      const params = answer.name;
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Department added!");
        return viewDepartments();
      });
    });
  };
  
  const addPosition = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of this position?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a position name");
            return false;
          };
        }
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this position?",
        validate: salaryInput => {
          if (isNaN(salaryInput)) {
            console.log("Please enter a salary");
            return false;
          } else {
            return true;
          };
        }
      }
    ])
    .then (answer => {
      const params = [answer.title, answer.salary];
      const sql = `SELECT * FROM departments`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "department",
            message: "What department does this position belong to?",
            choices: departments
          }
        ])
        .then(departmentAnswer => {
          const department = departmentAnswer.department;
          params.push(department);
          const sql = `INSERT INTO positions (title, salary, department_id)
            VALUES (?, ?, ?)`;
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Position added!");
            return viewRoles();
          });
        });
      });
    });
  };
  
  const addWorker = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the worker's first name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          };
        }
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the worker's last name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          };
        }
      }
    ])
    .then (answer => {
      const params = [answer.firstName, answer.lastName];
      const sql = `SELECT * FROM positions`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "position",
            message: "What is the position of this employee?",
            choices: roles
          }
        ])
        .then(roleAnswer => {
          const role = roleAnswer.role;
          params.push(role);
          const sql = `SELECT * FROM workers`;
          db.query(sql, (err, rows) => {
            if (err) {
              throw err;
            }
            const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
            managers.push({name: "No manager", value: null});
            inquirer.prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is this worker's manager?",
                choices: managers
              }
            ])
            .then(managerAnswer => {
              const manager = managerAnswer.manager;
              params.push(manager);
              const sql = `INSERT INTO workers (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
              db.query(sql, params, (err) => {
                if (err) {
                  throw err;
                }
                console.log("Worker added!");
                return viewWorker();
              });
            });
          });
        });
      });
    });
  };
  
  const updateWorkerRole = () => {
    const sql = `SELECT first_name, last_name, id FROM workers`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const workers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "worker",
          message: "Which worker's role would you like to update?",
          choices: workers
        }
      ])
      .then(workerAnswer => {
        const worker = workerAnswer.worker;
        const params = [worker];
        const sql = `SELECT title, id FROM positions`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const positions = rows.map(({title, id}) => ({name: title, value: id}));
          inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "What is the new position of this worker?",
              choices: positions
            }
          ])
          .then(positionsAnswer => {
            const role = positionsAnswer.role;
            params.unshift(role);
            const sql = `UPDATE workers
                          SET role_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Worker updated!");
              return viewWorker();
            });
          });
        });
      });
    });
  };
  
  const updateWorkerManager = () => {
    const sql = `SELECT first_name, last_name, id FROM worker`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const workers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "worker",
          message: "Which employee would you like to update?",
          choices: workers
        }
      ])
      .then(workerAnswer => {
        const worker = workerAnswer.worker;
        const params = [worker];
        const sql = `SELECT first_name, last_name, id FROM workers`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
          managers.push({name: "No manager", value: null});
          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is this worker's new manager?",
              choices: managers
            }
          ])
          .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.unshift(manager);
            const sql = `UPDATE workers
                          SET manager_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Worker updated!");
              return viewWorker();
            });
          });
        });
      });
    });
  };
  
  const viewByManager = () => {
    const sql = `SELECT first_name, last_name, id FROM workers`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const workers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "worker",
          message: "Which manager's workers would you like to view?",
          choices: workers
        }
      ])
      .then(workerAnswer => {
        const manager = workerAnswer.worker;
        const params = [manager];
        const sql = `SELECT id, first_name, last_name FROM workers
                      WHERE manager_id = ?`
        db.query(sql, params, (err, rows) => {
          if (err) {
            throw err;
          }
          if (rows.length === 0) {
            console.log("This worker does not manage anyone.");
            return employeeTracker();
          }
          console.log("\n");
          console.table(rows);
          return employeeTracker();
        });
      });
    });
  };
  
  const viewByDepartment = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const departments = rows.map(({name, id}) => ({name: name, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "worker",
          message: "Which department's workers would you like to view?",
          choices: departments
        }
      ])
      .then(workerAnswer => {
        const department = workerAnswer.worker;
        const params = [department];
        const sql = `SELECT workers.id, first_name, last_name, departments.name AS department
                      FROM workers
                      LEFT JOIN roles ON workers.position_id = positions.id
                      LEFT JOIN departments ON positions.department_id = departments.id
                      WHERE departments.id = ?`;
        db.query(sql, params, (err, rows) => {
          if (err) {
            throw err;
          }
          console.log("\n");
          console.table(rows);
          return employeeTracker();
        });
      });
    });
  };
  
  const removeDepartment = () => {
    const sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const departments = rows.map(({name, id}) => ({name: name, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to remove?",
          choices: departments
        }
      ])
      .then(departmentAnswer => {
        const department = departmentAnswer.department
        const params = department;
        const sql = `DELETE FROM departments
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Department deleted!");
          return viewDepartments();
        });
      });
    });
  };
  
  const removePosition = () => {
    const sql = `SELECT id, title FROM workers`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const positions = rows.map(({title, id}) => ({name: title, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "position",
          message: "Which worker would you like to remove?",
          choices: positions
        }
      ])
      .then(positionAnswer => {
        const position = positionAnswer.role
        const params = position;
        const sql = `DELETE FROM positions
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Position deleted!");
          return viewRoles();
        });
      });
    });
  };
  
  const removeWorker = () => {
    const sql = `SELECT first_name, last_name, id FROM workers`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const workers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "worker",
          message: "Which worker would you like to remove?",
          choices: workers
        }
      ])
      .then(workerAnswer => {
        const worker = workerAnswer.worker
        const params = worker;
        const sql = `DELETE FROM workers
                      WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Worker removed!");
          return viewWorker();
        });
      });
    });
  };
  
  module.exports = employeeTracker;