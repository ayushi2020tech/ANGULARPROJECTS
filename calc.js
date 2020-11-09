const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const addition = require('./add');
const subtraction = require('./sub');
const multiplication = require('./mul');
const division = require('./div');


const PORT= process.env.PORT||3000;

let server = http.createServer(function (req, res) {

    if (req.method === "GET") {
        if(req.url==="/"){
            const html_filePath = __dirname + "/calc.html";
            fs.readFile(html_filePath,"UTF-8",function(err,content){
                if(err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(content);
            })
        }
    } else if (req.method === "POST") {
        let body='';
        req.on('data',function(data){
            body+=data;
        })
        req.on("end", function(){
            let x=qs.parse(body);
            let num1=Number(x.num1);
            let num2=Number(x.num2);
            let result;
            switch(x.operation){
                case '+':
                    result=addition.add(num1,num2);
                    break;
                case '-':
                    result=subtraction.sub(num1,num2);
                    break;
                case '*':
                    result=multiplication.mul(num1,num2);
                    break;
                case '/':
                    result=division.div(num1,num2);
                    break;
                default:
                    result=null;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("The result of the calculation is "+result);
        });
    }

})
server.listen(PORT);