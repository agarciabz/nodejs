"use strict"

const continents = require('./continents.json');
const jwt = require('jsonwebtoken');
const express = require('express');
const { authenticateJWTHandler } = require('../login/login');
const http = require('http');

const getContinents = async (req, res) => {
    res.json(continents);
};


const getContinent = async (req, res) => {
    try {
        let code = req.params.code;
        if (code) {
            let found = continents.find(element => element.code === code);
            if (found) {
                res.set("X-Service", "getContinent")
                return res.json(found);
            }
        } else {
            res.sendStatus(404);
        }
        res.sendStatus(400);
    } catch (e) {
        res.sendStatus(500);
    }
};

const getForwardingContinent = (req, res) => {

    try {
        const reqOpts = {
            headers: req.headers,
            hostname: req.host,
            method: req.method,
            path: `/api/countries/${req.params.code}`,
            port: 3000,
            protocol: req.protocol + ':'
        };

        const connector = http.request(reqOpts, (response) => {
            response.pipe(res)
                .on('error', console.error);
        });

        // Pipe the original request into the connector
        req.pipe(connector).on('error', console.error);
    }
    catch (e) {
        res.sendStatus(500);
    }
};

const getForwardingUrl = (req, res) => {
    const url = new URL(req.query.url);

    const reqOpts = {
        headers: req.headers,
        hostname: url.hostname,
        method: req.method,
        path: url.pathname,
        port: url.port || 80,
        protocol: url.protocol
    };
    const connector = http.request(reqOpts, (response) => {
        response.pipe(res)
            .on('error', console.error);
    });

    req.pipe(connector).on('error', console.error);
};


const waitToUpperCase = (req, res) => {
    try {
        setTimeout(() => {
            const maliciousStrings = ['fuck', 'ass', 'dick'];
            const text = req.query.text;
            if (maliciousStrings.some(element => text.includes(element))) {
                return res.status(400).send('The string contains bad words!!!');
            }

            const textUpperCase = text ? text.toUpperCase() : '';
            res.json(textUpperCase);
        }, 1000);
    }
    catch (e) {
        res.status(500).send(e);
    }
};

// Express sub-router definitions
const continentsRouter = express.Router();
continentsRouter.get('/', authenticateJWTHandler, getContinents);
continentsRouter.get('/forwardingUrl', getForwardingUrl);
continentsRouter.get('/waitToUpperCase', waitToUpperCase);
continentsRouter.get('/requestforwarding/:code', authenticateJWTHandler, getForwardingContinent);
continentsRouter.get('/:code', authenticateJWTHandler, getContinent);
module.exports = { continentsRouter };  
