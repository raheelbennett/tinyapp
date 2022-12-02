//helper functions
const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};
const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  } return null;
};
const urlsForUser = (id, urlDatabase) => {
  let returnURLDatabase = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      returnURLDatabase[url] = urlDatabase[url];
    }
  } return returnURLDatabase;
};


module.exports = {
  generateRandomString,
  urlsForUser,
  getUserByEmail
};