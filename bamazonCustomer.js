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
            console.log("   Price: ".red + " $" + element.price + "\n");
        })
    })
    inquirer.prompt({
        name: "BuyorNot",
        type: "list",
        message: "Would you like to buy an item?",
        choices: ["Yes", "No"]
    }).then(answer => {
        if (answer.BuyorNot === "Yes"){
            buyItem();
        } else {
            console.log("No Worries, see you next time.")
            connection.end();
        }
    });
  }

function buyItem() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].product_name);
                }
                return choiceArray;
              },
              message: "Which Item would you like to buy?"
            },
            {
              name: "amount",
              type: "input",
              message: "How many would you like to purchase?"
            }
          ])
          .then(answer =>{

          });
    })
}
