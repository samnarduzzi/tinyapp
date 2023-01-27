// -----* PORT *----- //
const PORT = 8080; // default port 8080
//_________________________________________________________________________


// -----* HELPER FUNCTIONS *----- //
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helper');
//_________________________________________________________________________


// -----* DEPENDENCIES *----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
//_________________________________________________________________________


// -----* MIDDLEWARE *----- //
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({ 
  name: 'session', 
  keys: ['slipperySalmon2999']
}));
//_________________________________________________________________________


// -----* URL / USER DATA *----- //
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
//_________________________________________________________________________


// -----* HOMEPAGE *----- //
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//_________________________________________________________________________


// -----* REGISTRATION GET *----- //
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
//_________________________________________________________________________


// -----* REGISTRATION POST *----- //
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
//_________________________________________________________________________


// -----* LOGIN GET *----- //
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
//_________________________________________________________________________


// -----* LOGIN POST *----- //
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUser = getUserByEmail(users, email)

  if (!getUserByEmail(users, email)) {
    return res.status(403).send("Email has not yet been registered");
  }

  // if ((getUserByEmail(users, email)).password !== password) {
  //   return res.status(403).send("Invalid password. Please try again");
  // }

  if (!email || !password) {
    return res.status(403).send("Please provide an email and password");
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.status(403).send(`Password is incorrect!`);
  }

  req.session.user_id = foundUser.id;
  res.redirect('/urls');
});
//_________________________________________________________________________


// -----* LOGOUT POST *----- //
app.post('/logout', (req, res) => {
  // res.clearCookie('session.sig'); 
  res.clearCookie('session')
  res.redirect('/login');
});
//_________________________________________________________________________


// -----* MAIN URL *----- //
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  // const urls = urlsForUser(users, urlDatabase)
  
  const templateVars = {
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});
//_________________________________________________________________________


// -----* NEW URL *----- //
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  return res.render('urls_new', templateVars);
});
//_________________________________________________________________________


// -----* SHORT URL *----- //
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;

  const templateVars = {
    longURL: urlDatabase[req.params.id],
    id: req.params.id,
    user: users[userID]
  };
  res.render("urls_show", templateVars);
});
//_________________________________________________________________________

// -----* TO LONG URL *----- //
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
//_________________________________________________________________________


// -----* POST FOR URL *----- //
app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };

  res.redirect(`/urls/${newShortURL}`);
});
//_________________________________________________________________________

// -----* DELETE A URL *----- //
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  const userID = req.session.user_id;
  
  if (req.session.user_id === urlDatabase[id].userID) {

    delete urlDatabase[id];
  }


  res.redirect('/urls');
});
//_________________________________________________________________________


// -----* LISTENING PORT *----- //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//_________________________________________________________________________

