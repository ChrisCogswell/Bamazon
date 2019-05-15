var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'classSQL',
    database : 'bamazonDB'
  });

// Establishing connection with mySQL server

  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log("\n--".yellow + " Connected as user: " + connection.threadId + " --\n".yellow);
    welcome();
  });


// Function welcoming the customer and prompting them to the storeFront function.

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

// Storefront function that dislays all products and prompts user for a purchase.  

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

// Main function that allows user to choose an item and quantity.
// The user is then shown their order total or if stock is insufficient, prompted to adjust their order.
// SQL database is updated upon successful order.

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
              message: "Which Item would you like to buy?\n"
            },
            {
              name: "amount",
              type: "input",
              message: "How many would you like to purchase?"
            }
          ])
          .then(answer =>{
            var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        if (chosenItem.stock_quantity > parseInt(answer.amount)) {
            var newQuantity = chosenItem.stock_quantity - answer.amount;
            var orderSubTotal = answer.amount * chosenItem.price;
            var orderTax = (6 / 100) * orderSubTotal
            var orderTotal = (orderTax + orderSubTotal).toFixed(2);
    
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newQuantity
                },
                {
                  item_id: chosenItem.item_id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("\nOrder placed successfully!\n".underline.green + "Subtotal: $"
                 + orderSubTotal + "\nTotal: $" + orderTotal);
                console.log("\nThank you for shopping with us today!\n".cyan);
                connection.end();
              }
            );
          }
          else {
           
            console.log("\nInsufficient Stock. We currently only have: ".red + chosenItem.stock_quantity);
            console.log("\n");
            inquirer.prompt(
                {
                    name: "reOrder",
                    type: "list",
                    message: "Would you like to change your order?\n".green,
                    choices: ["Yes", "No, thanks"]
                }
            ).then(answer => {
                if (answer.reOrder === "Yes"){
                    buyItem();
                } else {
                    console.log("\nSorry for the inconvenience. Have a nice day!\n")
                    connection.end();
                }
            });
          }
          });
    })
}
