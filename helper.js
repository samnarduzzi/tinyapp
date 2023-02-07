
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


const getUserByEmail = function(users, email) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

//  URL / USER DATA 
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



module.exports = { generateRandomString, getUserByEmail, urlDatabase, users, };