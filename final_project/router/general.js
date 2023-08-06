const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let queryUserWithUsername = require("./auth_users.js").queryUserWithUsername;
let queryBooksWithKey = require("./auth_users.js").queryBooksWithKey;
const public_users = express.Router();

/*
DEBUG API TO GET ALL USERS

public_users.get("/register", (req,res) => {
    return res.send(users);
});
/**/

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

// PROMISE CODE
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => resolve(books))
    .then((retrievedBooks) => res.send(retrievedBooks))
});

// PROMISE CODE
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn
    if (isbn in books) {
        resolve(books[isbn])
    } else {
        reject("No book found with isbn: " + isbn)
    }
  })
  .then((retrievedBook) => res.send(retrievedBook))
  .catch((errorMessage) => res.status(400).json({ "message": errorMessage}));
 });

// PROMISE CODE
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve, reject) => {
        const books = queryBooksWithKey("author", req.params.author)
        if (books.length > 0) {
            resolve(books)
        } else {
            reject("No book found with author: " + req.params.author)
        }
      })
      .then((retrievedBook) => res.send(retrievedBook))
      .catch((errorMessage) => res.status(400).json({ "message": errorMessage}));
});

// PROMISE CODE
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        const books = queryBooksWithKey("title", req.params.title)
        if (books.length > 0) {
            resolve(books)
        } else {
            reject("No book found with title: " + req.params.title)
        }
      })
      .then((retrievedBook) => res.send(retrievedBook))
      .catch((errorMessage) => res.status(400).json({ "message": errorMessage}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.send(books[req.params.isbn].reviews);
});

/*

NON PROMISE CODE:

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

/**/

module.exports.general = public_users;