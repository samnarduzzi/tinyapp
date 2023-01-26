// -----* PORT *----- //
const PORT = 8080; // default port 8080
//_________________________________________________________________________


// -----* DEPENDENCIES *----- //
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//_________________________________________________________________________


// -----* MIDDLEWARE *----- //
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user
  };
  if (!user) {
    res.render('register', templateVars);
  } else {
    res.redirect('/urls');
  }
});
//_________________________________________________________________________


// -----* REGISTRATION post *----- //
app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const newUser = generateRandomString();

  if (!email || !password) {
    res.status(400).send("Error, please fill in all areas");
  }

  if (userFound) {
      return res.status(400).send("This email is already in use ");
    }

  users[newUser] = {
    email: email,
    password: password,
    id: newUser,
  };

  res.cookie('user_id', userId);
  res.redirect('/urls');
});
//_________________________________________________________________________


// -----* LOGIN GET *----- //
app.get('/login', (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user
  };
  if (!user) {
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

if (!userFound) {
  return res.status(403).send("Email has not yet been registered")
}

if (userFound.password !== password) {
  return res.status(403).send("Invalid password. Please try again")
}

if (!email || !password) {
  return res.status(403).send("Please provide an email and password")
}

res.cookie('user_id', userFound.id)
res.redirect('/urls')
})
//_________________________________________________________________________


// -----* LOGOUT POST *----- //
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');  //username
  res.redirect('/login');
});
//_________________________________________________________________________


// -----* MAIN URL *----- //
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});
//_________________________________________________________________________


// -----* NEW URL *----- //
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };

  if (!templateVars.user) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});
//_________________________________________________________________________


// -----* SHORT URL *----- //
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    longURL: urlDatabase[req.params.id],
    id: req.params.id,
    user: users[req.cookies["user_id"]]
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
  urlDatabase[newShortURL] = req.body.longURL;

  res.redirect(`/urls/${newShortURL}`);
});
//_________________________________________________________________________

// -----* DELETE A URL *----- //
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id
  delete urlDatabase[id]

  res.redirect('/urls');
});
//_________________________________________________________________________


// -----* HELPER FUNCTIONS *----- //
const generateRandomString = function() {
  let result = '';
  let char = '1234567890abcdefghijklmnopqrstuvwxyz';
  let charLength = char.length;
  for (let i = 0; i < 6; i++) {
    result += char[Math.floor(Math.random() * charLength)];
  }
  return result;
};

const userFound = function(users, email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return false;
};
//_________________________________________________________________________

// -----* LISTENING PORT *----- //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//_________________________________________________________________________
