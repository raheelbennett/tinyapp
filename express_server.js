const {generateRandomString, urlsForUser, getUserByEmail} = require("./helpers");


const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080

//template engine
app.set("view engine", "ejs");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["userID"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));



//databases
const urlDatabase = {
  "b6UTxQ": {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "user2RandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID",
  },
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: (bcrypt.hashSync("purple-monkey-dinosaur", 10)),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: (bcrypt.hashSync("dishwasher-funk", 10)),
  },
  "useraJ48lW": {
    id: "useraJ48lW",
    email: "tom@gmail.com",
    hashedPassword: (bcrypt.hashSync("newpass123", 10)),
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
  if (!req.session.userID) {
    return res.status(401).send(`Login required to view URLs. Click <a href="/login">here</a> to login`);
  }
  // When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
  //we are using a helper function urlsForUser to filter out the urlDatabase for records that match the user id passed in as the argument. In our case it will be the value of the userID cookie.
  const templateVars = {
    user: users[req.session.userID],
    urls: urlsForUser(req.session.userID, urlDatabase)
  };
  res.render("urls_index", templateVars);
});
//the data in the input field will be avaialbe to us in the req.body.longURL variable
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();
  if (!req.session.userID) {
    return res.send("Need to be logged in to shorten URLs");
  } else {
    //the new  the id-longURL key-value pair are saved to the urlDatabase
    urlDatabase[randomID] = {
      longURL: req.body.longURL,
      userID: req.session.userID
    };
    res.status(200);
    res.redirect(`/urls/${randomID}`);
  }
});
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  if (!templateVars.user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

//This page will display a single URL and its shortened form.
//Users must be logged in and only authorized user can view their url page.
app.get("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID !== req.session.userID) {
    return res.status(401).send(`Login required to view your URL page. Click <a href="/login">here</a> to login`);
  } else {
    const templateVars = {
      user: users[req.session.userID],
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
    };
    res.render("urls_show", templateVars);
  }
});


//redirects Short URLs to long urls, unless short url id is invalid, then it will send error 404
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    res.status(404).send("This short URL was not found in our system");
  } else {
    res.redirect(longURL);
  }
});

// removes a URL resource and once deleted redirects to the "/urls" page.
app.post("/urls/:id/delete", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("This short URL was not found in our system");
  }
  if (urlDatabase[req.params.id].userID !== req.session.userID) {
    return res.status(401).send(`Login Required! You are not authorized to make changes to this URL. Click <a href="/login">here</a> to login`);
  } else {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
});

//Updates a URL resource and redirects back to "/urls" page.
app.post("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("This short URL was not found in our system");
  }
  if (urlDatabase[req.params.id].userID !== req.session.userID) {
    return res.status(401).send(`Login Required! You are not authorized to make changes to this URL. Click <a href="/login">here</a> to login`);
  } else {
    urlDatabase[req.params.id].longURL = req.body.newURL;
    res.redirect("/urls");
  }
});


//Login page and /login endpoint handler
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("user_login", templateVars);
  }
});//if user found then usign bcrypt to compare hashedPassword
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userFound = getUserByEmail(email, users);
  if (userFound && bcrypt.compareSync(password, userFound.hashedPassword)) {
    req.session.userID = userFound.id;
    res.redirect("/urls");
  } else {
    return res.status(403).send(`Login Failed! The information provided does not match our records. Click <a href="/login">here</a> to return to the login page`);
  }
});


//handing /logout endpoint
app.post("/logout", (req, res) => {
  req.session.userID = "";
  res.redirect("/login");
});


//Registration page and /register endpoint handler
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("user_register", templateVars);
  }
});//password will be stored as hashedPassword using bcrypt
app.post("/register", (req, res) => {
  const id = "user" + generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send(`Please enter a valid Email Address and Password to register. Click <a href="/register">here</a> to return to the registration page`);
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send(`Email Address already in use. Click <a href="/register">here</a> to return to the registration page`);
  } else {
    users[id] = {
      id,
      email,
      hashedPassword: bcrypt.hashSync(password, 10)
    };
    req.session.userID = id;
    res.redirect("/urls");
  } 
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
