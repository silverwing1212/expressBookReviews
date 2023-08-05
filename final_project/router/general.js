const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let queryUserWithUsername = require("./auth_users.js").queryUserWithUsername;
let queryBookWithKey = require("./auth_users.js").queryBookWithKey;
const public_users = express.Router();

public_users.get("/register", (req,res) => {
    return res.send(users);
});

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!queryUserWithUsername(username)) {
            users.push({ username, password });
            return res.send("User successfully registered!")
        } else {
            return res.status(404).json({message: "User with username " + username + " already exists."})
        }
    } else {
        return res.status(404).json({message: "Please enter both a username and password."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return res.send(queryBookWithKey("author", req.params.author));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return res.send(queryBookWithKey("title", req.params.title));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
