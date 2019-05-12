var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'classSQL',
    database : 'bamazonDB'
  });

  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('Welcome: ' + "User " + connection.threadId + " to Bamazon!");
    // start();
    // update();
  });