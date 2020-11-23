const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(bodyparser.json());
app.use(express.static("public"));

app.use(bodyparser.urlencoded({ extended: true }));
app.get("/", function(req, res) {

    res.sendFile(__dirname + "/form.html");
});
app.get("/submit", function(req, res) {

    res.sendFile(__dirname + "/submit.html");
});






app.post('/', function(req, res) {



    const answer = "HyperText Markup Language";
    const chosen = req.body.q;

    if (chosen == answer) {

        res.write("<h1 style=color:green;> CORRECT ANSWER </h1>");
        res.write("<h1> ANSWER CHOSEN:</h1>" + chosen);
        res.write("<h1>THE CORRECT ANSWER: HyperText Markup Language </h1>");


    } else {
        res.write("<h1 style =color:red; > WRONG ANSWER </h1>");
        res.write("<h1> ANSWER CHOSEN:</h1>" + chosen);
        res.write("<h1>THE CORRECT ANSWER: HyperText Markup Language </h1>");


    }


});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running at port 3000");
})