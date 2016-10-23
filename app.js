const request = require('request');
const repl = require('repl');
var csv  =require('csv');
var dateFormat = require('dateformat');
var datetime = new Date();

// Start REPL input data
const r = repl.start({prompt: 'coinbase>', eval: myEval, writer: getOutput});

function myEval(cmd, context, filename, callback) {
  callback(null,cmd);
}

var orders;

function buyCurrency{
    
}

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
                getRate(temp[2]);   
            }
            else{
                return "No amount specified. Try again!"
            }
            return "";
            break;
        case "sell":
            return "sellssss";
            break;
        case "orders":
            return "ordersss";
            break;
        default:
            return output.toUpperCase();
    }
    
}

function getRate(countryCode){
        // Request JSON bitcoin data and output
        var code = countryCode + "_to_btc";
                
        request({
            url: 'https://coinbase.com/api/v1/currencies/exchange_rates',
            json: true
        }, (error, response, myData) => {

            // Pull out data
                var rate = myData[code];
            console.log("rate: " + rate);
                
                if (typeof rate == 'undefined'){
                    console.log("No known exchange rate for BTC/" + countryCode + ". Order failed.");
                }
                else{
                        var rate2 = (1/rate).toFixed(2);
                       console.log("\nOrder to BUY " + temp[1] + " " + temp[2] + " worth of BTC queued @ " + rate2 + " BTC/USD(" + rate +" BTC)");
                    }
            });
        
}
