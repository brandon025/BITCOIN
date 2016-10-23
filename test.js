const request = require('request');
const repl = require('repl');
var csv  =require('csv');
var dateFormat = require('dateformat');
var datetime = new Date();
var csv = require('fast-csv');
var fs = require('fs');

var totalRate;
// Start REPL input data
const r = repl.start({prompt: 'coinbase>', eval: myEval, writer: getOutput});

function myEval(cmd, context, filename, callback) {
  callback(null,cmd);
}

// STORE DATA INTO ORDERS FIRST
var orders = [];

// READ DATA
/*
csv
    .fromPath("my.csv")
    .on("data", function(data){
        console.log(data);
    })
    .on("end", function(){
    })
*/

// Write Data
function writeToFile(){
    var ws= fs.createWriteStream("lol.csv");
    csv 
        // .fromStream(ws, {headers : ["Timestamp", "BUY/SELL", "Amount", "Currency", "Conversion Rate"]})
        .write([
            ["Timestamp", "BUY/SELL", "Amount", "Currency", "Conversion Rate"],
            orders
        ], {headers: true})
        .pipe(ws);
}
// transform data


function Orders(time, buysell, amount, currency, status, rating){
    this.time = time;
    this.buysell = buysell.toUpperCase();
    this.amount = amount;
    this.currency = currency;
    this.stats = status;
    this.rating = rating;
}

function buysellCurrency(buysell, amount, currency, ratings){
    var currentDate = dateFormat(datetime, "GMT: ddd mmm dd yyyy hh:mm:ss Zo");
    orders.push(new Orders(currentDate, buysell, amount, currency, ratings));
    
}

function showOrders(){
    console.log (" === CURRENT ORDERS ===");
    console.log(" Current ratings BTC/" + orders[orders.length-1].currency + ": " + orders[orders.length-1].rating)
    for(var i = 0; i<orders.length; i++){
        console.log(orders[i].time + " : " + orders[i].buysell + " " + orders[i].amount + " : " + orders[i].stats);
    }
}


// **************** GET REPL MODE OUTPUT ********************
function getOutput(output) {
    var temp; 
    // Split and remove white spaces to determine command
    temp = output.split(" ");

    for(var i = 0; i < temp.length; i++){
        temp[i] = temp[i].replace(/\s/g, '');
        temp[i] = temp[i].toLowerCase();
    }
    
    // if no currency, add to data
    if (temp[2] == null){
        
    }

    
    // Determine Command
    switch(temp[0]) 
    {
        case "buy":
            // Check if number
            if (isNaN(temp[1]) == false){
                getRate(temp[2], temp);   
              
            }
            else{
                return "No amount specified. "
            }
            return "";
            break;
        case "sell":
            if (isNaN(temp[1]) == false){
                getRate(temp[2], temp);  
              
            }
            else{
                return "No amount specified."
            }
            return "";
            break;
        case "orders":
            showOrders();
            return "";
            break;
        default:
            return "Not a valid option!";
    }
    
}

// GET THE RATE OF CONVERSION TO BITCOINS
function getRate(countryCode, temp){
        // Request JSON bitcoin data and output
        var code = countryCode + "_to_btc";
                
        request({
            url: 'https://coinbase.com/api/v1/currencies/exchange_rates',
            json: true
        }, (error, response, myData) => {

            // Pull out data
                var rate = myData[code];
                var totalRate = rate;
                
                if (typeof rate == 'undefined'){
                    console.log("No known exchange rate for BTC/" + countryCode + ". Order failed.");
                }
                else{
                        var rate2 = (1/rate).toFixed(2);
                       console.log("\nOrder to BUY " + temp[1] + " " + temp[2] + " worth of BTC queued @ " + rate2 + " BTC/USD(" + rate +" BTC)");
                    buysellCurrency(temp[0], temp[1], temp[2], "UNFILLED", rate);
                    writeToFile();
                    }
                
            });
}
