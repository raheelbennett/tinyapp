const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

//template engine
app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//helper functions
const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};
const userLookup = (searchThisEmail) => {
  for (const user in users) {
    if (users[user].email === searchThisEmail) {
      return users[user];
    }
  } return null;
};

//databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


//random endpoint handlers
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


///urls endponint handlers
app.get("/urls", (req, res) => {
  // When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});
//the data in the input field will be avaialbe to us in the req.body.longURL variable
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();
  //the new  the id-longURL key-value pair are saved to the urlDatabase
  urlDatabase[randomID] = req.body.longURL;
  res.status(200);
  res.redirect(`/urls/${randomID}`);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("urls_new", templateVars);
});
//This page will display a single URL and its shortened form.
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});
//redirects Short URLs to long urls, unless short url id is invalid, then it will send error 404
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.status(404);
    res.send("not found");
  } else {
    res.redirect(longURL);
  }
});
// removes a URL resource and once deleted redirects to the "/urls" page.
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
//Updates a URL resource and redirects back to "/urls" page.
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect("/urls");
});


//Login page and endpoint handler
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("user_login", templateVars);
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userFound = userLookup(email);
  if (userFound && userFound.password === password) {
    res.cookie("user_id", userFound.id);
    res.redirect("/urls");
  } else {
    return res.status(403).send("The information provided does not match our records. Login Failed!")
  }
});


//handing /logout endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


//Registration page and endpoint handler
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("user_register", templateVars);
});
app.post("/register", (req, res) => {
  const id = "user" + generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please enter a valid Email Address and Password to register');
  }
  if (userLookup(email)) {
    return res.status(400).send('Email Address already in use');
  } else {
    users[id] = {
      id,
      email,
      password
    };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
