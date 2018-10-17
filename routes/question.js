'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load User Model
const User = require('../models/user');
// Load Question Model
const Question = require('../models/question');

// const { handleAnswer, generateNewQuestions } = require('../utils/LinkedList');
const linkedList = require('../utils/LinkedList');

// @route   GET api/trips/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Question Works' }));

// @route   GET api/question
// @desc    Get one question
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const itemToReturn = linkedList.peek();
    console.log('linkedList: ', linkedList);
    console.log('itemToReturn: ', itemToReturn);

    linkedList.deleteFirst();
    linkedList.insertLast(itemToReturn);
    res.json(itemToReturn);
  }
);

// @route   POST api/question
// @desc
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const questionToPost = req.body.question;
    // linkedList.deleteFirst();
    linkedList.insertLast(questionToPost);
    // posts the next one
    res.send('Post successful');
  }
);

module.exports = router;
