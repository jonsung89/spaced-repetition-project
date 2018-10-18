'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user');
const Question = require('../models/question');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public

router.post('/register', (req, res, next) => {
  /***** Never trust users - validate input *****/
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be type String`);
    err.status = 422;
    return next(err);
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(
      `Field: '${nonTrimmedField}' cannot start or end with whitespace`
    );
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = new Error(
      `Field: '${tooSmallField}' must be at least ${min} characters long`
    );
    err.status = 422;
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = new Error(
      `Field: '${tooLargeField}' must be at most ${max} characters long`
    );
    err.status = 422;
    return next(err);
  }

  // Username and password were validated as pre-trimmed
  let { username, password } = req.body;

  let resolvedQuestions;

  return Question.find()
    .then(questions => {
      resolvedQuestions = questions.map((question, index) => ({
        question,
        next: index === questions.length - 1 ? null : index + 1
      }));
      return;
    })
    .then(() => {
      return User.hashPassword(password);
    })
    .then(digest => {
      return User.create({
        username,
        password: digest
      });
    })
    .then(user => {
      user.questions = resolvedQuestions;
      return user.save();
    })
    .then(user => {
      res
        .status(201)
        .location(`/users/${user.id}`)
        .json(user);
    })
    .catch(err => {
      if (err.code === 11000) {
        return res.status(400).json({
          reason: 'Validation Error',
          message: 'The username already exists',
          location: 'username'
        });
      }
      next(err);
    });
});

module.exports = router;
