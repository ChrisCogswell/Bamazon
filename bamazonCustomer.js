var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

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
   
    console.log("\n--".yellow + " Connected as user: " + connection.threadId + " --\n".yellow);
    welcome();
    // update();
  });

  function welcome() {
      inquirer.prompt(
          {
              name: "welcome",
              type: "list",
              message: "Welcome to Bamazon! Would you like to shop with us today?\n".green,
              choices: ["Of course!", "No, thanks"]
          }
      ).then(answer => {
          if (answer.welcome === "Of course!"){
              storeFront();
          } else {
              console.log("\nThats too bad. Have a nice day!\n")
              connection.end();
          }
      });
  }

  function storeFront() {
            console.log("\nItems for sale\n".underline.blue)
    connection.query("SELECT * FROM products", (err,res) =>{
        if (err) throw err;
        // console.log(res);
        res.forEach(element => {
            console.log("   Item ".yellow + element.item_id + ": " + element.product_name)
            console.log("   Price: ".red + element.price + "\n");
        })
    })
  }