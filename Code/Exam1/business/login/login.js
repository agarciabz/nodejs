const jwt = require('jsonwebtoken');
const express = require('express');
const accessTokenSecret = 'thisismyaccesstokensecret';
const refreshTokenSecret = 'thisismyrefreshaccesstokensecret';
const fs  = require('fs').promises;
const path = require('path');
const{cache} = require('../../assets');

var refreshTokens = [];

const login = async (req, res) => {

    const { username, password } = req.body;
    let users = cache.get('users');
    if(!users){
        users = await getUsers();
        cache.put('users', users);
    }
    const user = users.find(u => { return u.username === username && u.password === password });
    

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role, acl:['acl1', 'acl2'] }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role, acl:['acl1'] }, refreshTokenSecret);
        refreshTokens.push(refreshToken);
        res.json({
            accessToken,
            refreshToken
        });

    } else {
        res.send('Username or password incorrect');
    }
};

async function getUsers(){
    //return  new Promise(async (resolve, reject) => {
        const input1Path = path.join(__dirname, '/users.txt');
        const users = await fs.readFile(input1Path, "utf-8");
        return JSON.parse(users);
    //     resolve(JSON.parse(users));
    // });
}

const authenticateJWTHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const token = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        res.json({ accessToken });
    });
};

const logout = (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.send("Logout successful");
};

// Express sub-router definitions
const loginRouter = express.Router();
loginRouter.post('/', login);
loginRouter.post('/token', token);
loginRouter.post('/logout', logout);
module.exports = { loginRouter, authenticateJWTHandler }; 