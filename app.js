//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

//setup
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

//mysql connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abc@123',
  database: 'employeedata',
});

//db connection
con.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL server');

   //db creation
   con.query('CREATE DATABASE IF NOT EXISTS employeedata', function (err, result) {
    if (err) {
      console.error('Error creating database employeedata:', err);
      throw err;
    }
    console.log('Database "employeedata" created or already exists');
   con.query('USE employeedata', function (err) {
      if (err) {
        console.error('Error selecting database:', err);
        throw err;
      }
      console.log('Using database "employeedata"');
      //function calling
      createTable();
    });
  });
});

//createtable function body
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      salary INT NOT NULL
    )
  `;
  con.query(sql, function (err, result) {
    if (err) {
      console.error('Error creating table:', err);
      throw err;
    }

    console.log('Table "employees" created or already exists');
  });
}

//post endpoint and url for inerting data
app.post('/submit', function (req, res) {
  const employee = req.body;    //after parsing data got values through this method

  const sql = 'INSERT INTO employees (name, salary) VALUES (?, ?)';  //got values in placeholer
  const values = [employee.name, employee.salary];  //we put the values in array called values

  con.query(sql, values, function (err, result) {
    if (err) {
      console.error('Error inserting employee:', err);
      res.status(500).send('Error saving employee data');
    } 
    else {
      console.log('Employee data saved successfully');
      res.send('Employee data saved successfully');
    }
  });
});

//put endpoint for updating data
app.put('/update/:id', function (req, res) {
  const employeeId = req.params.id;
  const employee = req.body;

  const sql = 'UPDATE employees SET name = ?, salary = ? WHERE id = ?';
  const values = [employee.name, employee.salary, employeeId];

  con.query(sql, values, function (err, result) {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).send('Error updating employee data');
    } else {
      console.log('Employee data updated successfully');
      res.send('Employee data updated successfully');
    }
  });
});

app.delete('/delete/:id', function (req, res) {
  const employeeId = req.params.id;

  const sql = 'DELETE FROM employees WHERE id = ?';
  const values = [employeeId];

  con.query(sql, values, function (err, result) {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Error deleting employee data');
    } else {
      console.log('Employee data deleted successfully');
      res.send('Employee data deleted successfully');
    }
  });
});

app.get('/fetchdata', function (req, res) {
  const sql = 'SELECT * FROM employees';

  con.query(sql, function (err, result) {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching employee data');
    } else {
      res.json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
