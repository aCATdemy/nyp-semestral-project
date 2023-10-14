const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const flashMessage = require('../helpers/messenger');
const User = require('../models/User');
const Video = require('../models/Video');
const Like = require('../models/Like');

module.exports = router;