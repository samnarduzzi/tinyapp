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

  for (let index in users) {
    console.log(users[index].email);
    if (users[index].email === email) {
      return res.status(400).send("This email is already in use ");
    }
  }
  
  users[newUser] = {
    email: email,
    password: password,
    id: newUser,
  }
  
  res.cookie('user_id', userId);
  res.redirect('/urls');
});
//_________________________________________________________________________




//...
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//...

const generateRandomString = function() {
  let result = '';
  let char = '1234567890abcdefghijklmnopqrstuvwxyz';
  let charLength = char.length;
  for (let i = 0; i < 6; i++) {
    result += char[Math.floor(Math.random() * charLength)];
  }
  return result;
};

const addUser = (email, password) => {
  const newId = generateRandomString();
  users[newId] = {
    id: newId,
    email: email,
    password: password,
  };
  return newId;
};

const verifyId = function(users, email) {
  for (const newID in users) {
    if (users[newID].email === email) {
      return users[newID];
    }
  }
  return false;
};

//... GET ROUTES 

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"],
    user: users[req.cookies["user_id"]]
  };
  if (templateVars.user) {
    templateVars.urls = urlsForUser(templateVars.user['id'], urlDatabase); // returns urls that match user id
  }
  res.render("urls_index", templateVars);
});

//
app.get("/urls/new", (req, res) => {
  const templateVars = {
    // username: req.cookies["username"]
    user: users[req.cookies["user_id"]]
  };
  if (!templateVars.user) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});

//
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    id: req.params.id,
    // username: req.cookies["username"],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

//
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});






app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const user = findID(users, req.body.email);
  res.cookie('user', req.body.user); // username x2
  res.redirect('/urls');
});



app.post('/logout', (req, res) => {
  res.clearCookie('user');  //username
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// app.get("/", (req, res) => {
//   res.send("Hello!");
// // });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
