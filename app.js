//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { Http2ServerRequest } = require("http2");
const https = require("https");
const { post } = require("request");

const app = express();

//needed in order to specify location of static files (images/css)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
  
  });

  app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName 
          }
        }
      ]
    };
    //turns data variable into a JSON string
    const jsonData = JSON.stringify(data);
    //mailchimp url, will show usX, replace the X with the last number of your api key,  that will be the server your mailchimp account is on
    const url = "https://us14.api.mailchimp.com/3.0/lists/8a19c6575e";

    const options = {
      method: "POST",
      auth: "joe:7d8a0436a1294092bda89a5058b6ce4d-us14"
    }

    const request = https.request(url, options, function(response) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function(data) {
        console.log(JSON.parse(data));
      })

    })

    request.write(jsonData);
    request.end();
  });

  app.post("/failure", function(req, res) {
    res.redirect("/")
  })

//sets up server
app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});


// 7d8a0436a1294092bda89a5058b6ce4d-us14

// 8a19c6575e