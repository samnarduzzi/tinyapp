
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


module.exports = { generateRandomString, getUserByEmail, };