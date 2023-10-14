const express = require('express');
const moment = require('moment');
const User = require('../models/User');
const Post = require('../models/Post');

async function getUserById(id){
    let user = await User.findOne({
        where:{
            id
        },
        raw: true
    });
    return user;
}

async function getUserByUserName(username){
    let user = await User.findOne({
        where:{
            username
        },
        raw: true
    });
    return user;
}

module.exports = {getUserById, getUserByUserName};