const {AUTH_HEADER, SECRCT} = require('./constants');
const {GetDistance} = require('./utils');
const express = require('express');
const Router = express.Router();
const util = require('utility'); // import util module for md5 encode
const jwt = require('jwt-simple'); // import jwt-simple module for encode/decode json web token

//config database
const models = require('./model');
const users = models.getModel("user");
const posts = models.getModel('post');
//end config database-----------------------------------------------------------------------------------------------------------

//config multer
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./build/static/public/image`);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.lat}-${req.body.lon}-${file.originalname}`);
    }
});
const upload = multer({storage});
//end config multer-----------------------------------------------------------------------------------------------------------

//handle login
Router.post('/login', async (req, res) => {
    let {username, password} = req.body;
    let token = jwt.encode({
       username,
       exp: Date.now() + 7*24*60*60*1000, // 一天后过期
    }, 'Bearer');
    let d = await users.findOne({username});
    if (!d) {
        res.status(500).send("username doesn't exit");
    }
    let d2 = await users.findOne({username, password: util.md5(password)});
    if (!d2) {
        res.status(500).send("password is not correct");
    }
    res.json(token);
});
//end handle login -----------------------------------------------------------------------------------------------------------

//handle register
Router.post('/signup', async (req, res) => {
    let {username, password} = req.body;
    let d = await users.findOne({username});
    if (d) {
        res.status(500).send('Username exists!');
    } else {
        try {
            let data = await users.create({username, password: util.md5(password)});
            res.send("sign on success!");
        } catch (e) {
            console.log(e);
            res.status(500).send('server error !');
        }
    }

});
//end handle register -----------------------------------------------------------------------------------------------------------

//handle post image
Router.post('/post', upload.fields([{name: 'image', maxCount: 1}, {name: "message"}]), async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.redirect('/login');
    }
    let {username} = jwt.decode(token.slice(AUTH_HEADER.length, token.length - 1), SECRCT, true);
    let {lat, lon, message} = req.body;
    let {filename, mimetype} = req.files.image[0];
    let url = `/static/public/image/${filename}`;
    try {
        let d = await posts.create({username, lat, lon, url, type: mimetype, message});
        res.send("post success!");
    }catch (e) {
        console.log(e);
        res.status(500).send('server error !');
    }
});
//end handle post image -----------------------------------------------------------------------------------------------------------

//handle search posts
Router.get('/search', async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.redirect('/login');
    }
    let files = await posts.find({});
    let {lat, lon, range} = req.query;
    res.send(files.filter(v => {
        v.type = v.type.split('/')[0];
        v.lat = parseFloat(v.lat);
        v.lon = parseFloat(v.lon);
        let dis = GetDistance(lat, lon, v.lat, v.lon);
        return dis <= range? true: false;
    }));
});
//end handle search posts -----------------------------------------------------------------------------------------------------------

module.exports = Router;
