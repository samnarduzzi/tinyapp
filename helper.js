
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
  return null;
};



const urlsForUser = function (user, database) {
  const userURL = {};
  for (const urlId in database) {
    if (database[urlId].userID === user) {
      userURL[urlId] = database[urlId].longURL;
    }
  }
  return userURL;
};



module.exports = { generateRandomString, userFound, urlsForUser };