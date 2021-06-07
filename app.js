//jshint esversion: 6

// common code for all app
const express = require("express");
const request = require("request");
const https = require("https");
const { options } = require("yargs");

const app = express();
app.use(express.static("public"));
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// common code end

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
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
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonDATA = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/9ea0ae0bfd";
  const options = {
    method: "POST",
    auth: "sajjitab:a17a4ea64956d9c320748b71675678ef-us6",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", function (data) {

    // });
  });

  request.write(jsonDATA);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
