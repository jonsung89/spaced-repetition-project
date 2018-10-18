'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load User Model
const User = require('../models/user');
// Load Question Model
const Question = require('../models/question');

router.use(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true })
);

// @route   GET api/question/test
// @desc    Tests POST route
// @access  Private
router.get('/test', (req, res) => res.json({ msg: 'Question Works' }));

// @route   GET api/question
// @desc    Gets one question
// @access  Private
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .populate('questions.question')
    .then(user => {
      res.json(user.questions[user.head]);
    });
});

// // @route   POST api/question
// // @desc    Posts answer to the current question
// // @access  Private
router.post('/', (req, res, next) => {
  let { answer } = req.body;

  answer = answer.toLowerCase();

  User.findById(req.user.id)
    .populate('questions.question')
    .then(user => {
      let current = user.head,
        tail = user.tail,
        next = null,
        nextNext = null,
        response = '';

      user.questions[current].question.answer = user.questions[
        current
      ].question.answer.toLowerCase();

      console.log('correct answer: ', user.questions[current].question.answer);
      console.log('user answer: ', answer);

      if (user.questions[current].question.answer === answer) {
        user.questions[tail].next = current;
        user.tail = current;
        user.head = user.questions[current].next;
        user.questions[current].next = null;

        response = 'Correct';
      } else {
        next = user.questions[current].next;
        user.head = next;
        nextNext = user.questions[next].next;

        user.questions[next].next = current;
        user.questions[current].next = nextNext;

        response = 'Incorrect';
      }

      user.save();
      return response;
    })
    .then(response => res.send({ msg: response }))
    .catch(err => next(err));
});

module.exports = router;
