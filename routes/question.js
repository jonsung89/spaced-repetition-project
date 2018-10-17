'use strict';

const express = require('express');
const router = express.Router();

const linkedList = require('../utils/LinkedList');

router.get('/', (req, res) => {
  // returns the first question
  const itemToReturn = linkedList.peek();
  console.log(linkedList);

  linkedList.deleteFirst();
  linkedList.insertLast(itemToReturn);
  res.json(itemToReturn);
});

router.post('/', (req, res) => {
  const questionToPost = req.body.question;
  // linkedList.deleteFirst();
  linkedList.insertLast(questionToPost);
  // posts the next one
  res.send('Post successful');
});

module.exports = router;
