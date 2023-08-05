const express = require('express');
const jwt = require('jsonwebtoken');
let forEachEntry = require("../util.js").forEachEntry;
let queryKey = require("../util.js").queryKey;
let queryIndex = require("../util.js").queryIndex;
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const queryBookWithKey = (targetKey, targetValue) => {
    const bookKey = queryKey(books, (isbn, book) => book[targetKey] === targetValue);
    if (bookKey !== null) {
        return books[bookKey]
    } else {
        return null;
    }
}

const queryUserWithUsername = (username) => {
    const userIndex = queryIndex(users, (user) => user.username === username);
    if (userIndex > -1) {
        return users[userIndex]
    } else {
        return null;
    }
}

const isValid = (username)=>{ 
    const user = queryUserWithUsername(username);
    if (user) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username,password)=>{ 
    const user = queryUserWithUsername(username);
    if (user && user.password === password) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (authenticatedUser(req.body.username, req.body.password)) {
    req.session.authorization = { accessToken: jwt.sign({ data: req.body.password }, 'access', { expiresIn: 60 * 60 }), username: req.body.username}
    res.send("User successfully logged in!");
  } else {
      res.status(404).json({ message: "Incorrect username or password" });
  };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  if (book) {
    book.reviews[req.session.authorization.username] = req.body.review;
    return res.send("Book review successfully added");
  } else {
    return res.status(400).json({message: "No book found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  if (book) {
    delete book.reviews[req.session.authorization.username];
    return res.send("Book review successfully added");
  } else {
    return res.status(400).json({message: "No book found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.queryUserWithUsername = queryUserWithUsername;
module.exports.queryBookWithKey = queryBookWithKey;
