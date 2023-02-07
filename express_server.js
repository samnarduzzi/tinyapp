const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const app = express();

const { generateRandomString, getUserByEmail, urlDatabase, users, } = require('./helper');

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['slipperySalmon2999']
}));


app.get('/', (req, res) => {
  if (users[req.session.user_id]) {
    return res.redirect(`/urls`);
  }
  return res.redirect(`/login`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/register', (req, res) => {
  const userID = req.session.user_id;

  const templateVars = {
    user: users[userID]
  };
  if (!userID) {
    res.render('register', templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => {
  const userID = req.session.user_id;

  const templateVars = {
    user: users[userID]
  };

  if (!userID) {
    res.render('login', templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("You must be logged in to view the URLs.");
  }

  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }

  const templateVars = {
    urls: userUrls,
    user: users[userID]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: users[req.session["user_id"]]
  };

  return res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("You must be logged in to have access to this page.");
  }

  const urlID = req.params.id;
  const url = urlDatabase[urlID];

  if (!url) {
    return res.status(404).send("URL can not be found.");
  }

  if (url.userID !== userID) {
    return res.status(403).send("You are not allowed to access this URL.");
  }

  const templateVars = {
    longURL: url,
    id: urlID,
    user: users[userID]
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const urlID = req.params.id;
  const longURL = urlDatabase[urlID];

  if (!longURL) {
    return res.status(404).send('Error: URL not found');
  }

  return res.redirect(longURL);
});

app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = generateRandomString();

  if (!email || !password) {
    res.status(400).send("Error, please fill in email and password areas");
  }

  if (getUserByEmail(users, email)) {
    return res.status(400).send("This email is already in use ");
  }

  users[newUser] = {
    email: email,
    password: hashedPassword,
    id: newUser,
  };

  req.session.user_id = newUser;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUser = getUserByEmail(users, email);

  if (!getUserByEmail(users, email)) {
    return res.status(403).send("Email has not yet been registered");
  }


  if (!email || !password) {
    return res.status(403).send("Please provide an email and password");
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.status(403).send(`Password is incorrect!`);
  }

  req.session.user_id = foundUser.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.clearCookie('session');
  res.redirect('/login');
});

app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  const newURL = req.body.newURL;

  if (!userID) {
    res.status(401).send("You must be logged in to edit the URL.");
    return;
  }

  if (urlDatabase[urlID].userID !== userID) {
    res.status(403).send("You don't have permission to edit this URL.");
    return;
  }

  urlDatabase[urlID].longURL = newURL;

  res.redirect(`/urls`);
});

app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };

  res.redirect(`/urls/${newShortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("Please log in to delete a URL.");
  }

  if (req.session.user_id !== urlDatabase[id].userID) {
    return res.status(403).send("You are not allowed to delete this URL.");
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

