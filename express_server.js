const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//template engine
app.set("view engine", "ejs");
//body-parser middleware for POST requests
app.use(express.urlencoded({ extended: true }));

//returns a string of 6 random alphanumeric characters
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  // When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//presents the form to the user
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//This page will display a single URL and its shortened form.
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});
//the data in the input field will be avaialbe to us in the req.body.longURL variable
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();
  //the new  the id-longURL key-value pair are saved to the urlDatabase
  urlDatabase[randomID] = req.body.longURL;
  res.statusCode = 200;
  res.redirect(`/urls/${randomID}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
